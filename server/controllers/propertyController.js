/**
 * Property controller
 * handles every property related task
 */
import { validationResult } from 'express-validator/check';
import dotenv from 'dotenv';
import { dataUri } from '../middleware/multerUpload';
import { propertyService } from '../models/Property';
import { uploader } from '../config/cloudinaryConfig';
import { flagService, Flag } from '../models/Flag';
import db from '../database/index';

dotenv.config();

const PropertyController = {
  /**
   * @description Method to view a property
   * @param {object} req request object
   * @param {object} res response object
   * @return {object} returns an object containing the details of the property
   */
  viewProperty(req, res) {
    const { id } = req.params;
    const fetchById = propertyService.fetchById(parseInt(id, 10));
    if (!fetchById) {
      return res.status(400).send({
        status: 'error',
        error: 'Property not found!',
      });
    }
    return res.send({
      status: 1,
      data: fetchById,
    });
  },
  /**
   * @description Method to view all properties
   * @param {object} req request object
   * @param {object} res response object
   * @return {object} returns an array of objects containing all properties
   */
  viewPropertyAll(req, res) {
    const propertyType = req.query.type;
    let data = {};
    if (propertyType) {
      data = propertyService.fetchByType(propertyType);
    } else {
      data = propertyService.fetchAll();
    }

    return res.send({
      status: 1,
      data,
    });
  },
  /**
   * @description Method to post a property
   * @param {object} req request object
   * @param {object} res response object
   * @return {object} returns an object containing the posted property
   */
  async postProperty(req, res) {
    const { user } = req;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        error: errors.array()[0].msg,
      });
    }
    try {
      if (!req.file) {
        return res
          .status(400)
          .send({ status: 'error', error: 'You need to attach an Image to your property' });
      }
      const file = dataUri(req).content;
      const imageFile = await uploader.upload(file, result => result.secure_url);
      const imageUrl = imageFile.secure_url;
      const creatQuery = `INSERT INTO 
            property (agent_id, price , status, state, city, address, type, image_url, created_on,updated_on) 
            VALUES ($1, $2, $3, $4, $5, $6, $7 ,$8, $9, $10) RETURNING *`;
      const values = [
        user.id,
        req.body.price,
        req.body.status || 'available',
        req.body.state,
        req.body.city,
        req.body.address,
        req.body.type,
        imageUrl,
        new Date().toDateString(),
        new Date().toDateString(),
      ];
      const newProperty = await db.query(creatQuery, values);
      const property = newProperty.rows[0];
      return res.status(201).send({
        status: 'success',
        data: property,
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        error: `Could not save property, Please try again ${error}`,
      });
    }
  },
  /**
   * @description Method to delete a property
   * @param {object} req request object
   * @param {object} res response object
   * @return {object} returns an object containing the the message of the action
   */
  deleteProperty(req, res) {
    const { id } = req.params;
    const result = propertyService.deleteById(parseInt(id, 10));
    if (!result) {
      return res.status(404).send({
        status: 'error',
        error: 'No Property found with such ID',
      });
    }
    return res.send({
      status: 'success',
      data: {
        message: 'Property Deleted successfully',
      },
    });
  },
  /**
   * @description Method to mark property as sold
   * @param {object} req request object
   * @param {object} res response object
   * @return {object} returns an object containing the details of the property
   */
  soldProperty(req, res) {
    const { id } = req.params;
    const result = propertyService.markAsSold(parseInt(id, 10));
    if (!result) {
      return res.status(404).send({
        status: 'error',
        error: 'No Property found with such ID',
      });
    }
    return res.send({
      status: 'success',
      data: result,
    });
  },
  /**
   * @description Method to update a property
   * @param {object} req request object
   * @param {object} res response object
   * @return {object} returns an object containing the details of the property
   */
  updateProperty(req, res) {
    const { id } = req.params;
    const result = propertyService.fetchById(parseInt(id, 10));
    if (!result) {
      return res.status(404).send({
        status: 'error',
        error: 'No Property found with such ID',
      });
    }
    Object.assign(result, req.body);
    return res.send({
      status: 'success',
      data: result,
    });
  },
  /**
   * @description Method to flag a property
   * @param {object} req request object
   * @param {object} res response object
   * @return {object} returns an object containing the the message of the action
   */
  flagProperty(req, res) {
    let response;
    const { id } = req.params;
    const { reason, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        error: errors.array()[0].msg,
      });
    }
    const result = propertyService.fetchById(parseInt(id, 10));
    if (result) {
      const flag = new Flag({
        property_id: id,
        reason,
        description,
      });
      flagService.flagProperty(flag);
      response = res.status(200).send({
        status: 'success',
        data: flag,
      });
    } else {
      response = res.status(404).send({
        status: 'error',
        error: 'No Property found with such ID',
      });
    }
    return response;
  },
};

export default PropertyController;
