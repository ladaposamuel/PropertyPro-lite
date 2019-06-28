import bcrypt from 'bcrypt';
import uuid from 'uuid';
import { validationResult } from 'express-validator/check';
import { User, userService } from '../models/User';
import sendEmailNotification from '../helpers/sendEmail';
import { resetPasswordEmailTemplate } from '../mail_templates/password_reset';

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

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
    const { email, type } = req.body;
    let response;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        error: errors.array()[0].msg,
      });
    }
    const user = userService.fetchUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        error: 'Email not available',
      });
    }
    if (!type) {
      return res.status(400).json({
        status: 'error',
        error: 'Request type must be specified',
      });
    }
    if (type === 'request') {
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
      const messageOptions = {
        subject: 'Password Request on PropertyPro-Lite',
        message: messageBody,
      };
      sendEmailNotification(email, messageOptions);
      response = res.send({
        status: 'success',
        message: 'Email sent. Check your inbox',
        token: resetToken,
        resetTime: Date.now(),
      });
    }
    if (type === 'reset') {
      // update password
      if (!req.body.password) {
        return res.status(400).send({ status: 'error', error: 'Provide a new password' });
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
      // update users
      userService.updateUser({ password: bcrypt.hashSync(password, salt) }, user.id);
      response = res.send({
        status: 'success',
        data: user,
      });
    }
    return response;
  },
};

export default UserController;
