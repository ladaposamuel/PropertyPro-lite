import express from 'express';
import validator from '../utils/validator';
import PropertyController from '../controllers/propertyController';
import { cloudinaryConfig } from '../config/cloudinaryConfig';

const router = express.Router();

router.get('/property/', PropertyController.viewPropertyAll);
router.get('/property/:id', PropertyController.viewProperty);

router.post(
  '/property/',
  validator.propertyValidation,
  cloudinaryConfig,
  PropertyController.postProperty,
);

export default router;