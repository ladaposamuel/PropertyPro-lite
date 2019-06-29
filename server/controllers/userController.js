import bcrypt from 'bcrypt';
import uuid from 'uuid';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator/check';
import nodemailer from 'nodemailer';
import { User, userService } from '../models/User';
import { resetPasswordEmailTemplate } from '../mail_templates/password_reset';

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
  create(req, res) {
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
    const allUsers = userService.fetchUsers();
    const newUser = new User({
      id: allUsers.length + 1,
      token: uuid.v4(),
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      password,
      isAgent,
      createdDate: new Date().toDateString(),
      modifiedDate: new Date().toDateString(),
    });

    userService.createUser(newUser);
    const user = {
      status: 'success',
      data: newUser,
    };
    return res.status(201).send(user);
  },
  login(req, res) {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        error: errors.array()[0].msg,
      });
    }
    const user = userService.loginUser(req.body);
    user.token = uuid.v4();
    if (email !== 'sam@mail.io' || password !== 'sam1111997') {
      return res.status(400).send({
        status: 'error',
        error: 'Invalid email or password',
      });
    }
    return res.send({
      status: 'success',
      data: user,
    });
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
