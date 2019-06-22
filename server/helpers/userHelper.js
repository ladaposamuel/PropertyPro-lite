import { userService } from '../models/User';

class userHelper {
  static checkifAgent(owner) {
    const userData = userService.fetchUserById(owner);
    if (userData.isAgent) {
      return true;
    }
    return false;
  }
}
export default userHelper;
