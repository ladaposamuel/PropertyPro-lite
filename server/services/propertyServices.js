class propertyServices {
  constructor() {
    this.properties = [];
  }

  fetchById(id) {
    return this.properties.find(property => property.id === id);
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
