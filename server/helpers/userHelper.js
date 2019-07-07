// src/usingDB/controllers/Helper.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userService } from '../models/User';

class userHelper {
  static checkifAgent(owner) {
    const userData = userService.fetchUserById(owner);
    if (userData && userData.isAgent) {
      return true;
    }
    return false;
  }

  static getUserDetail(id, data) {
    const userData = userService.fetchUserById(id);
    return userData[data];
  }

  static hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  }

  static generateToken(id) {
    const token = jwt.sign(
      {
        userId: id,
      },
      process.env.SECRET,
      { expiresIn: '7d' },
    );
    return token;
  }
}
export default userHelper;
