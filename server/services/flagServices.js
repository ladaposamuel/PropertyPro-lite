class flagServices {
  constructor() {
    this.flags = [];
  }

  flagProperty(flag) {
    const newFlag = flag;
    const allFlags = this.fetchAll();
    newFlag.id = allFlags.length + 1;
    newFlag.created_on = new Date().toDateString();
    this.flags.push(newFlag);
    return newFlag;
  }

  fetchAll() {
    return this.flags;
  }
}

export default flagServices;
