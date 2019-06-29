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
 *         required: true
 *       password:
 *         type: string
 *       firstName:
 *         type: string
 *       lastName:
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

router.post('/signup', validator.signUpValidation, UserController.create);
router.post('/signin', validator.signInValidation, UserController.login);
router.post('/reset', validator.passwordResetValidation, UserController.resetPassword);
router.post('/new-password', validator.newPasswordValidation, UserController.newPassword);

export default router;
