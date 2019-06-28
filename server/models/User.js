import UserServices from '../services/userServices';

const userService = new UserServices();
class User {
  constructor({
    id,
    token,
    firstName,
    lastName,
    email,
    phoneNumber,
    isAdmin,
    address,
    password,
    isAgent,
    resetToken,
    createdDate,
    modifiedDate,
  }) {
    this.id = id;
    this.token = token;
    this.first_name = firstName;
    this.last_name = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.is_admin = isAdmin || false;
    this.address = address;
    this.password = password;
    this.isAgent = isAgent || false;
    this.reset_token = resetToken || null;
    this.createdDate = createdDate;
    this.modifiedDate = modifiedDate;
  }
}

export { User, userService };
