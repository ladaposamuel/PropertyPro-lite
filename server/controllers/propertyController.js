import { validationResult } from 'express-validator/check';
import { Property, propertyService } from '../models/Property';
import userHelper from '../helpers/userHelper';

const PropertyController = {
  viewPropertyAll(req, res) {
    const data = propertyService.fetchAll();

    return res.send({
      status: 1,
      data,
    });
  },
  postProperty(req, res) {
    const {
      owner, status, price, state, city, address, type, imageUrl,
    } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        error: errors.array()[0].msg,
      });
    }
    let newProperty = {};
    if (userHelper.checkifAgent(owner)) {
      // post property
      const allProperties = propertyService.fetchAll();
      newProperty = new Property({
        id: allProperties.length + 1,
        owner,
        status,
        price,
        state,
        city,
        address,
        type,
        createdOn: new Date().toDateString(),
        imageUrl,
      });
      propertyService.createProperty(newProperty);
    } else {
      return res.status(400).send({
        status: 'error',
        error: 'User not found or not an agent.',
      });
    }
    return res.send({
      status: 'success',
      data: newProperty,
    });
  },
};

export default PropertyController;
