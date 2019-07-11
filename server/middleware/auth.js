/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import db from '../database';

const Auth = {
  /**
   * Verify Token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */
  async verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).json({
        status: 'error',
        error: 'Access denied. No token provided.',
      });
    }
    try {
      const user = await jwt.verify(token, process.env.SECRET);
      const text = 'SELECT * FROM users WHERE id = $1';
      const { rows } = await db.query(text, [user.id]);
      if (!rows[0]) {
        return res
          .status(400)
          .send({ status: 'error', error: 'The token you provided is invalid' });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(400).send({ status: 'error', error });
    }
  },
  agent(req, res, next) {
    if (req.user.is_agent === 0) {
      return res.status(403).json({
        status: 'error',
        error: 'Access denied. Only Agents can access this route',
      });
    }
    next();
  },
};

export default Auth;
