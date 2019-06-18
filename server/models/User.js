import moment from 'moment';

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
      id: this.user.length + 1,
      token: '',
      first_name: data.firstName || '',
      last_name: data.lastName || '',
      email: data.email || '',
      phoneNumber: data.phone || '',
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
