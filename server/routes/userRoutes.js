import express from 'express';
import userController from '../controllers/userController';
import validator from '../utils/validator';

const router = express.Router();

router.post('/signup', validator.signUpValidation, userController.create);

export default router;
