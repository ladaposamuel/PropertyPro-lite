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
    ownerEmail,
    ownerPhoneNumber,
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
    this.ownerEmail = ownerEmail;
    this.ownerPhoneNumber = ownerPhoneNumber;
  }
}
export { Property, propertyService };
