import express from 'express';
import UserController from '../controllers/userController';
import validator from '../utils/validator';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   SignUp:
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       phonenNumber:
 *         type: string
 *       address:
 *         type: string
 *       is_Admin:
 *         type: boolean
 *       is_admin:
 *         type: boolean
 */

/**
 * @swagger
 * definitions:
 *   Login:
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   Request:
 *     properties:
 *       email:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   Reset:
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     description: Create a new user account
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/SignUp'
 *     responses:
 *       201:
 *         description: token
 *       400:
 *         description: Email already in use
 *       404:
 *         description: Email not found
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     description: Sign in an account
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Login'
 *     responses:
 *       200:
 *         description: token
 *       400:
 *         description: Invalid email or password
 */

/**
 * @swagger
 * /api/v1/auth/reset:
 *   post:
 *     tags:
 *       - Authentication
 *     description: Request for password reset
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Request'
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: Invalid email
 */

/**
 * @swagger
 * /api/v1/auth/new-password:
 *   post:
 *     tags:
 *       - Authentication
 *     description: Reset user's password
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Reset'
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid password
 */

router.post('/signup', validator.signUpValidation, UserController.create);
router.post('/signin', validator.signInValidation, UserController.login);
router.post('/:email/reset_password', UserController.resetPassword);

export default router;
