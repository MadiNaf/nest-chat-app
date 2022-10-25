import { User } from "src/model/user.model"

export default class UserGuards {

  isValidName(username: string): boolean {return !!username}

  isValidUsernmae(name: string): boolean {return !!name}

  isValidPassword(pwd: string): boolean {return !!pwd}

  isUniqueUserName(username: string, users: Array<User>): boolean {
    const found = users.find(user => user.username === username);
    return !found;
  }
}