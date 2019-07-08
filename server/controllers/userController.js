import bcrypt from 'bcrypt';
import uuid from 'uuid';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator/check';
import nodemailer from 'nodemailer';
import { userService } from '../models/User';
import { resetPasswordEmailTemplate } from '../mail_templates/password_reset';
import db from '../database/index';
import userHelper from '../helpers/userHelper';

dotenv.config();
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const UserController = {
  async create(req, res) {
    const {
      firstName, lastName, email, address, isAgent, password, phoneNumber,
    } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        error: errors.array()[0].msg,
      });
    }
    const hashPassword = userHelper.hashPassword(password);
    const createQuery = `INSERT INTO
    users (first_name , last_name, email, phone_number, address, password, is_agent, created_date, modified_date)
    VALUES ($1, $2, $3, $4, $5, $6 ,$7, $8 , $9)
    returning *`;
    const values = [
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      hashPassword,
      isAgent,
      new Date().toDateString(),
      new Date().toDateString(),
    ];

    try {
      const { rows } = await db.query(createQuery, values);
      const token = userHelper.generateToken(rows[0].id);
      rows[0].token = token;
      return res.status(201).send({
        status: 'success',
        data: rows[0],
      });
    } catch (error) {
      if (error.routine === '_bt_check_unique') {
        return res
          .status(409)
          .send({ status: 'error', error: 'User with that EMAIL already exist' });
      }
      return res.status(422).send({
        status: 'error',
        error: 'User could not be created, Please try again.',
      });
    }
  },
  async login(req, res) {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        error: errors.array()[0].msg,
      });
    }

    const text = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows } = await db.query(text, [email]);
      if (!rows[0]) {
        return res
          .status(400)
          .send({ status: 'error', error: 'The credentials you provided is incorrect' });
      }
      if (!userHelper.comparePassword(rows[0].password, password)) {
        return res
          .status(400)
          .send({ status: 'error', error: 'The credentials you provided is incorrect' });
      }
      const token = userHelper.generateToken(rows[0].id);
      rows[0].token = token;
      return res.status(200).send({
        status: 'success',
        data: rows[0],
      });
    } catch (error) {
      return res.status(422).send({
        status: 'error',
        error: 'User could not be signed in, Please try again.',
      });
    }
  },
  resetPassword(req, res) {
    let response;
    const { email } = req.body;
    const user = userService.fetchUserByEmail(email);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        error: errors.array()[0].msg,
      });
    }
    if (!user) {
      return res.status(404).json({
        status: 'error',
        error: 'Email not available',
      });
    }
    const resetToken = uuid.v4();
    userService.updateUser(
      {
        resetToken,
        resetTime: Date.now(),
      },
      user.id,
    );
    const messageBody = resetPasswordEmailTemplate(
      req.headers.host,
      resetToken,
      email,
      new Date().getFullYear(),
    );
    const mailOptions = {
      from: 'PropertPro-Lite',
      to: email,
      subject: 'Password Request on PropertyPro-Lite',
      html: messageBody,
    };
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res.status(400).json({
          status: 'error',
          error: 'Reset password email could not be sent',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Email sent. Check your inbox',
          token: resetToken,
          resetTime: Date.now(),
        },
      });
    });

    return response;
  },

  newPassword(req, res) {
    const errors = validationResult(req);
    const user = userService.fetchUserByEmail(req.body.email);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        error: errors.array()[0].msg,
      });
    }
    if (!user) {
      return res.status(404).json({
        status: 'error',
        error: 'Email not available',
      });
    }
    if (!req.body.token) {
      return res.status(400).send({ status: 'error', error: 'No token is provided' });
    }
    const receivedToken = req.body.token;
    const currentTime = Date.now();
    const { password } = req.body;
    if (user.resetToken !== receivedToken) {
      return res.status(400).send({ status: 'error', error: 'Invalid token' });
    }
    if (currentTime - user.resetTime > 3600000) {
      return res
        .status(400)
        .send({ status: 'error', error: 'Link has expired. Request for another reset link.' });
    }
    userService.updateUser({ password: bcrypt.hashSync(password, salt) }, user.id);
    return res.send({
      status: 'success',
      data: user,
    });
  },
};

export default UserController;
