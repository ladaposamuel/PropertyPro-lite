class userServices {
  constructor() {
    this.users = [];
  }

  createUser(user) {
    this.users.push(user);
  }

  fetchUsers() {
    return this.users;
  }

  fetchUserById(id) {
    return this.users.find(user => user.id === id);
  }

  loginUser() {
    const user = this.fetchUsers()[0];
    return user;
  }
}

export default userServices;
