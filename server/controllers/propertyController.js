import { propertyService } from '../models/Property';

const PropertyController = {
  viewPropertyAll(req, res) {
    const data = propertyService.fetchAll();
    if (data) {
      return res.send({
        status: 1,
        data,
      });
    }
    return res.status(400).send({
      status: 'error',
      error: 'No Property found!',
    });
  },
};

export default PropertyController;
