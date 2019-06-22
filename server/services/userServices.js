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

  loginUser() {
    const user = this.fetchUsers()[0];
    return user;
  }
}

export default userServices;
