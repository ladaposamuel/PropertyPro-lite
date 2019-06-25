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
    console.log('TCL: propertyServices -> deleteById -> id', id);
    const result = this.fetchById(id);
    console.log('TCL: propertyServices -> deleteById -> result', result);
    if (result) {
      const delety = this.properties.indexOf(result);
      console.log('TCL: propertyServices -> deleteById -> delety', delety);
      this.properties.splice(delety, 1);
    }
    return result;
  }
}

export default propertyServices;
