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

  fetchAll() {
    return this.user;
  }

  create(data) {
    const allUsers = this.fetchAll();
    const newUser = {
      id: allUsers.length + 1,
      token: '',
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phoneNumber: data.phone || '',
      is_admin: data.isAdmin || false,
      address: data.address || '',
      password: data.password || '',
      isAgent: data.isAgent || false,
      createdDate: moment.now(),
      modifiedDate: moment.now(),
    };
    this.user.push(newUser);
    return newUser;
  }
}

export default new User();
