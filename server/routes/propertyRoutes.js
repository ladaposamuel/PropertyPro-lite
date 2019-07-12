import express from 'express';
import validator from '../utils/validator';
import PropertyController from '../controllers/propertyController';
import { cloudinaryConfig } from '../config/cloudinaryConfig';
import { multerUploads } from '../middleware/multerUpload';
import Auth from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   Property:
 *     properties:
 *       price:
 *         type: integer
 *       state:
 *         type: string
 *       city:
 *          type: string
 *       address:
 *          type: string
 *       type:
 *          type: string
 *       owner:
 *          type: integer
 *       imageData:
 *          type: string
 *
 */

/**
 * @swagger
 * /api/v1/property:
 *   post:
 *     tags:
 *       - Property
 *     description: Create a new property
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: tarun
 *         description: property's Object
 *         in: body
 *         schema:
 *           $ref: '#/definitions/Property'
 *     responses:
 *       200:
 *         description: property
 *       400:
 *         description: User not found or not an agent.
 */

/**
 * @swagger
 * /api/v1/property/{id}:
 *   patch:
 *     tags:
 *       - Property
 *     description: Update a property
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: property's ID
 *         in: path
 *         schema:
 *           $ref: '#/definitions/Property'
 *     responses:
 *       200:
 *         description: Successfully updated
 *       400:
 *         description: User not found or not an agent.
 */

/**
 * @swagger
 * /api/v1/property/{id}:
 *   get:
 *     tags:
 *       - Property
 *     description: Get property by ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: property's ID
 *         in: path
 *         schema:
 *           $ref: '#/definitions/Property'
 *     responses:
 *       200:
 *         description: Successfully created
 *       404:
 *         description: Property not found.
 */

/**
 * @swagger
 * /api/v1/property/{id}/sold:
 *   patch:
 *     tags:
 *       - Property
 *     description: Mark Property as Sold
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: property's ID
 *         in: path
 *         schema:
 *           $ref: '#/definitions/Property'
 *       - name: sold
 *         description : sold flag
 *         in: path
 *         schema:
 *           $ref: '#/definitions/Property'
 *     responses:
 *       200:
 *         description: Successfully marked as sold
 *       404:
 *         description: Property not found.
 */

/**
 * @swagger
 * /api/v1/property/{id}:
 *   delete:
 *     tags:
 *       - Property
 *     description: Delete a Property
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: property's ID
 *         in: path
 *         schema:
 *           $ref: '#/definitions/Property'
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: Property not found.
 */

router.get('/property/', Auth.verifyToken, PropertyController.viewPropertyAll);
router.patch(
  '/property/:id/',
  [
    Auth.verifyToken,
    Auth.agent,
    multerUploads,
    cloudinaryConfig,
    validator.updatePropertyValidation,
  ],
  PropertyController.updateProperty,
);
router.get('/property/:id', Auth.verifyToken, PropertyController.viewProperty);
router.patch('/property/:id/sold', [Auth.verifyToken, Auth.agent], PropertyController.soldProperty);
router.delete('/property/:id', [Auth.verifyToken, Auth.agent], PropertyController.deleteProperty);
router.post(
  '/property/:id/flag',
  [Auth.verifyToken, validator.propertyFlagValidation],
  PropertyController.flagProperty,
);

router.post(
  '/property/',
  [Auth.verifyToken, Auth.agent, multerUploads, cloudinaryConfig, validator.propertyValidation],
  PropertyController.postProperty,
);

export default router;
