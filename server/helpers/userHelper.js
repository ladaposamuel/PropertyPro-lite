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

  static comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
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

  static generateRandom(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
export default userHelper;
