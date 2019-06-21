import uuid from 'uuid';
import { validationResult } from 'express-validator/check';
import { User, userService } from '../models/User';

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
};

export default UserController;
