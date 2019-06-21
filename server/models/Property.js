import PropertyServices from '../services/propertyServices';

const propertyService = new PropertyServices();
class Property {
  constructor({
    id,
    owner,
    status,
    price,
    state,
    city,
    address,
    type,
    createdOn,
    imageUrl,
  }) {
    this.id = id;
    this.owner = owner;
    this.status = status;
    this.price = price;
    this.state = state;
    this.city = city;
    this.address = address;
    this.type = type;
    this.created_on = createdOn;
    this.image_url = imageUrl;
  }
}
export { Property, propertyService };
