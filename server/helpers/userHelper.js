import { userService } from '../models/User';

class userHelper {
  static checkifAgent(owner) {
    const userData = userService.fetchUserById(owner);
    if (userData && userData.isAgent) {
      return true;
    }
    return false;
  }

  static getUserDetail(id, data) {
    const userData = userService.fetchUserById(id);
    return userData[data];
  }
}
export default userHelper;
