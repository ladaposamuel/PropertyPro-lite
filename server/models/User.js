import moment from 'moment';
import uuid from 'uuid';


class User {
  /**
   * class constructor
   * @param {object} data
   */
  constructor() {
    this.user = [];
  }

  /**
   *
   * @returns {object} user object
   */
  create(data) {
    const newUser = {
      id: uuid.v4(),
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',
      password: data.password || '',
      isAgent: data.isAgent || '',
      createdDate: moment.now(),
      modifiedDate: moment.now(),
    };
    this.user.push(newUser);
    return newUser;
  }
}

export default new User();
