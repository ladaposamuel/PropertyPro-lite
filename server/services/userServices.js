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
    function isUserId(user) {
      return user.id === id;
    }
    return this.users.find(isUserId);
  }

  fetchUserByEmail(email) {
    function isUserEmail(user) {
      return user.email === email;
    }
    return this.users.find(isUserEmail);
  }

  loginUser() {
    const user = this.fetchUsers()[0];
    return user;
  }

  updateUser(data, userId) {
    const user = this.fetchUserById(userId);
    const index = this.users.findIndex(xuser => xuser === user);
    const newUser = Object.assign(user, data, { id: user.id });
    this.users.splice(index, 1, newUser);
    return user;
  }
}

export default userServices;
