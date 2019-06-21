import { propertyService } from '../models/Property';

const PropertyController = {
  viewPropertyAll(req, res) {
    const data = propertyService.fetchAll();

    return res.send({
      status: 1,
      data,
    });
  },
};

export default PropertyController;
