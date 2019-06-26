/**
 * Property controller
 * handles every property related task
 */
import { validationResult } from 'express-validator/check';
import { propertyService } from '../models/Property';
import userHelper from '../helpers/userHelper';
import { uploader } from '../config/cloudinaryConfig';

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
  postProperty(req, res) {
    const { owner, imageData } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        error: errors.array()[0].msg,
      });
    }
    let propertyResp;
    if (userHelper.checkifAgent(owner)) {
      // upload image
      if (imageData) {
        uploader
          .upload(imageData)
          .then((result) => {
            req.body.image_url = result.url;
            const property = propertyService.createProperty(req.body);
            propertyResp = res.send({
              status: 'success',
              data: property,
            });
          })
          .catch(err => res.status(400).send({
            status: 'error',
            error: err,
          }));
      } else {
        propertyResp = res.status(400).send({
          status: 'error',
          error: 'You need to attach an Image to your property',
        });
      }
    } else {
      propertyResp = res.status(400).send({
        status: 'error',
        error: 'User not found or not an agent.',
      });
    }
    return propertyResp;
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
};

export default PropertyController;
