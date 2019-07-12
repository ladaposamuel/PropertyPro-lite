import dotenv from 'dotenv';
import { validationResult } from 'express-validator/check';
import nodemailer from 'nodemailer';
import { resetPasswordEmailTemplate } from '../mail_templates/password_reset';
import db from '../database/index';
import userHelper from '../helpers/userHelper';

dotenv.config();
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
    users (first_name , last_name, email, phone_number, address, password, is_admin, created_date, modified_date)
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
      const token = userHelper.generateToken(rows[0]);
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
    let response;
    const text = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows } = await db.query(text, [email]);
      if (!rows[0]) {
        response = res
          .status(400)
          .send({ status: 'error', error: 'The credentials you provided is incorrect' });
      }
      if (!userHelper.comparePassword(rows[0].password, password)) {
        response = res
          .status(400)
          .send({ status: 'error', error: 'The credentials you provided is incorrect' });
      }
      const token = userHelper.generateToken(rows[0]);
      rows[0].token = token;
      response = res.status(200).send({
        status: 'success',
        data: rows[0],
      });
    } catch (error) {
      response = res.status(422).send({
        status: 'error',
        error: 'User could not be signed in, Please try again.',
      });
    }
    return response;
  },
  async resetPassword(req, res) {
    const { email } = req.params;
    const { password, newPassword } = req.body;

    let defaultPassword = userHelper.generateRandom(10);

    if (process.env.NODE_ENV === 'test') {
      defaultPassword = 'NewPassword1_';
    }

    let hashPassword = userHelper.hashPassword(defaultPassword);
    if (!email) {
      return res.status(400).send({ status: 'error', error: 'Please provide an email' });
    }
    const text = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows } = await db.query(text, [email]);
      if (!rows[0]) {
        return res.status(404).send({ status: 'error', error: 'Email not available' });
      }
      if (password && newPassword) {
        if (!userHelper.comparePassword(rows[0].password, password)) {
          return res.status(400).send({ status: 'error', error: 'Old password is not correct' });
        }
        hashPassword = userHelper.hashPassword(newPassword);
      }
      const updatePassword = 'UPDATE users set password = $1 where email = $2';
      db.query(updatePassword, [hashPassword, email]);
      const messageBody = resetPasswordEmailTemplate(defaultPassword, new Date().getFullYear());
      const mailOptions = {
        from: 'PropertPro-Lite',
        to: email,
        subject: 'Password reset-PropertyPro-Lite',
        html: messageBody,
      };
      const sendEmail = await transporter.sendMail(mailOptions);
      if (!sendEmail.messageId) {
        return res.status(400).json({
          status: 'error',
          error: 'Reset password email could not be sent',
        });
      }
    } catch (error) {
      return res.status(422).send({
        status: 'error',
        error: 'User passsword could not be reset, Please try again.',
      });
    }
    return res.status(204).json({});
  },
};

export default UserController;
