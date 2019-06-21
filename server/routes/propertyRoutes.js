import express from 'express';
import PropertyController from '../controllers/propertyController';

const router = express.Router();

router.get('/property/', PropertyController.viewPropertyAll);


export default router;
