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
    const user = UserModel.create(req.body);

    const data = {
      status: 'success',
      user,
    };

    return res.status(201).send(data);
  },
};

export default User;
