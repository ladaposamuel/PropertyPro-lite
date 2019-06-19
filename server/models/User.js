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
    // const defaultUser = {
    //   firstName: 'Sam',
    //   lastName: 'Samuel',
    //   email: 'sam@mail.io',
    //   phone: '08068170006',
    //   address: 'Heaven Land street',
    //   password: '1',
    //   isAgent: 'false',
    //   createdDate: moment.now(),
    //   modifiedDate: moment.now(),
    // };
    // this.user.push(defaultUser);
    return this.user;
  }

  create(data) {
    const allUsers = this.fetchAll();
    const newUser = {
      id: allUsers.length + 1,
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
