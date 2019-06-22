import express from 'express';
import validator from '../utils/validator';
import PropertyController from '../controllers/propertyController';

const router = express.Router();

router.get('/property/', PropertyController.viewPropertyAll);

router.post('/property/', validator.propertyValidation, PropertyController.postProperty);


export default router;
