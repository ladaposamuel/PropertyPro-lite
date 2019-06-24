class propertyServices {
  constructor() {
    this.properties = [];
  }

  fetchById(id) {
    function isPropertyId(property) {
      return property.id === id;
    }

    return this.properties.find(isPropertyId);
  }

  createProperty(property) {
    this.properties.push(property);
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
}

export default propertyServices;
