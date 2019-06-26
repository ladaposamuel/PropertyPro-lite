import userHelper from '../helpers/userHelper';

class propertyServices {
  constructor() {
    this.properties = [];
  }

  fetchById(id) {
    return this.properties.find(property => property.id === id);
  }

  createProperty(property) {
    const allProperties = this.fetchAll();
    const newProperty = {
      id: property.id ? property.id : allProperties.length + 1,
      owner: property.owner,
      status: property.status || 'available',
      price: property.price,
      state: property.state,
      city: property.city,
      address: property.address,
      type: property.type,
      ownerPhoneNumber: userHelper.getUserDetail(property.owner, 'phoneNumber'),
      ownerEmail: userHelper.getUserDetail(property.owner, 'email'),
      createdOn: new Date().toDateString(),
      image_url: property.image_url,
    };
    this.properties.push(newProperty);
    return newProperty;
  }

  fetchAll() {
    return this.properties;
  }

  fetchByType(type) {
    function isPropertyType(property) {
      return property.type === type;
    }

    return this.properties.filter(isPropertyType);
  }

  markAsSold(id) {
    const result = this.fetchById(id);
    if (result) {
      result.status = 'sold';
    }
    return result;
  }

  deleteById(id) {
    const result = this.fetchById(id);
    if (result) {
      const delety = this.properties.indexOf(result);
      this.properties.splice(delety, 1);
    }
    return result;
  }
}

export default propertyServices;
