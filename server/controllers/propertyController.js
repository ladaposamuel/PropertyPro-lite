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
  async viewProperty(req, res) {
    const { id } = req.params;
    const query = 'SELECT * FROM property where id = $1';
    const { rows } = await db.query(query, [id]);
    if (!rows[0]) {
      return res.status(400).send({
        status: 'error',
        error: 'Property not found!',
      });
    }
    return res.send({
      status: 'success',
      data: rows[0],
    });
  },
  /**
   * @description Method to view all properties
   * @param {object} req request object
   * @param {object} res response object
   * @return {object} returns an array of objects containing all properties
   */
  async viewPropertyAll(req, res) {
    let query;
    let properties;
    const propertyType = req.query.type;
    if (propertyType) {
      query = 'SELECT * FROM property where type = $1';
      const { rows } = await db.query(query, [propertyType]);
      properties = rows;
    } else {
      query = 'SELECT * FROM property';
      const { rows } = await db.query(query);
      properties = rows;
    }
    return res.send({
      status: 'success',
      data: properties,
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
  async deleteProperty(req, res) {
    const { id } = req.params;
    try {
      const queryText = 'DELETE from property where id = $1 and agent_id = $2 RETURNING *';
      const rows = await db.query(queryText, [id, req.user.id]);
      if (!rows.rowCount) {
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
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        error: `Could not delete property, Please try again ${error}`,
      });
    }
  },
  /**
   * @description Method to mark property as sold
   * @param {object} req request object
   * @param {object} res response object
   * @return {object} returns an object containing the details of the property
   */
  async soldProperty(req, res) {
    try {
      let { id } = req.params;
      id = parseInt(id, 10);
      const query = 'UPDATE property set status = $1 where id = $2 and agent_id = $3 RETURNING *';
      const { rows } = await db.query(query, ['sold', id, req.user.id]);
      if (!rows[0]) {
        return res.status(404).send({
          status: 'error',
          error: 'No Property found with such ID',
        });
      }
      return res.send({
        status: 'success',
        data: rows[0],
      });
    } catch (e) {
      return res.status(404).send({
        status: 'error',
        error: 'Could not update property as sold, please try again',
      });
    }
  },
  /**
   * @description Method to update a property
   * @param {object} req request object
   * @param {object} res response object
   * @return {object} returns an object containing the details of the property
   */
  async updateProperty(req, res) {
    const { id } = req.params;
    const { user } = req;
    let imageUrl;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        error: errors.array()[0].msg,
      });
    }
    try {
      if (req.file) {
        const file = dataUri(req).content;
        const imageFile = await uploader.upload(file, result => result.secure_url);
        imageUrl = imageFile.secure_url;
      }
      const checkQuery = 'SELECT * FROM property where id = $1 and agent_id = $2';
      const updateQuery = `UPDATE property set agent_id = $1, price = $2 , status = $3, state = $4, city = $5, address = $6, type = $7 , image_url =$8
      ,updated_on = $9 where id = $10 and agent_id = $1 RETURNING *`;
      const { rows } = await db.query(checkQuery, [id, req.user.id]);
      if (rows[0]) {
        const values = [
          user.id,
          req.body.price || rows[0].price,
          req.body.status || rows[0].status,
          req.body.state || rows[0].state,
          req.body.city || rows[0].city,
          req.body.address || rows[0].address,
          req.body.type || rows[0].type,
          imageUrl || rows[0].image_url,
          new Date().toDateString(),
          id,
        ];
        const updatedProperty = await db.query(updateQuery, values);
        const property = updatedProperty.rows[0];
        return res.status(200).send({
          status: 'success',
          data: property,
        });
      }
      return res.status(404).send({
        status: 'error',
        error: 'Property not found!',
      });
    } catch (error) {
      return res.status(400).send({
        status: 'error',
        error: `Could not update property, Please try again ${error}`,
      });
    }
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
