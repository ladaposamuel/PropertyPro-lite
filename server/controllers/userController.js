import { validationResult } from 'express-validator/check';
import UserModel from '../models/User';

const User = {
  /**
   *
   * @param {object} req
   * @param {object} res
   * @returns {object} user object
   */
  create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: 'error',
        error: errors.array()[0].msg,
      });
    }
    const data = UserModel.create(req.body);
    const user = {
      status: 'success',
      data,
    };
    return res.status(201).send(user);
  },
};

export default User;
