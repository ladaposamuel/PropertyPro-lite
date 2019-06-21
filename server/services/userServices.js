class userServices {
  constructor() {
    this.users = [];
  }

  createUser(user) {
    this.users.push(user);
  }

  fetchUsers() {
    const user = {
      id: 1,
      first_name: 'oooo',
      last_name: 'Samuel',
      email: 'sam@mail.io',
      phoneNumber: '08068170006',
      address: 'Heaven Land street',
      password: 'sam1111997',
      isAgent: 'false',
    };
    this.users.push(user);
    return this.users;
  }

  loginUser() {
    const user = this.fetchUsers()[0];
    return user;
  }
}

export default userServices;
