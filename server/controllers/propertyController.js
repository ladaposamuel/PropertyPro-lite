import { validationResult } from 'express-validator/check';
import { Property, propertyService } from '../models/Property';
import userHelper from '../helpers/userHelper';
import { uploader } from '../config/cloudinaryConfig';

const PropertyController = {
  viewProperty(req, res) {
    const { id } = req.params;
    const fetchById = propertyService.fetchById(parseInt(id, 10));
    if (!fetchById) {
      return res.status(400)
        .send({
          status: 'error',
          error: 'Property not found!',
        });
    }
    return res.send({
      status: 1,
      data: fetchById,
    });
  },
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
  // eslint-disable-next-line consistent-return
  postProperty(req, res) {
    const {
      owner, status, price, state, city, address, type, imageData,
    } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400)
        .json({
          status: 'error',
          error: errors.array()[0].msg,
        });
    }
    if (userHelper.checkifAgent(owner)) {
      // upload image
      if (imageData) {
        uploader
          .upload(imageData)
          .then((result) => {
            const allProperties = propertyService.fetchAll();
            const newProperty = new Property({
              id: allProperties.length + 1,
              owner,
              status,
              price,
              state,
              city,
              address,
              type,
              createdOn: new Date().toDateString(),
              imageUrl: result.url,
            });
            propertyService.createProperty(newProperty);
            return res.send({
              status: 'success',
              data: newProperty,
            });
          })
          .catch(err => res.status(400)
            .json({
              status: 'error',
              error: err,
            }));
      } else {
        return res.status(400)
          .send({
            status: 'error',
            error: 'You need to attach an Image to your property',
          });
      }
    } else {
      return res.status(400)
        .send({
          status: 'error',
          error: 'User not found or not an agent.',
        });
    }
  },
};

export default PropertyController;
