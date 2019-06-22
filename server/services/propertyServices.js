class propertyServices {
  constructor() {
    this.properties = [];
  }

  createProperty(property) {
    this.properties.push(property);
  }

  fetchAll() {
    return this.properties;
  }
}

export default propertyServices;
