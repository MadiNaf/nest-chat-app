import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserJwtPayload } from 'src/model/user.model';
import { UserService } from 'src/user/user.service';
import { JWT_CONSTENT, SALT_ROUNDS } from './constent';

@Injectable()
export class AuthService {

  constructor(private userService: UserService,
              private jwtService: JwtService) {}

  /**
   * Generate hashed password
   * @param password - password to hashe
   * @returns hashed password
   */
  async getHashedPassword(password: string): Promise<string> {
    return new Promise( async (resolve, reject) => {
      try {
        const hashed = await bcrypt.hashSync(password, SALT_ROUNDS);
        resolve(hashed);
      } catch (error) {
        reject('Error: Cannot hashed password.');
      }
    });
  }

  /**
   * check password validity
   * @param password - password to check
   * @param hashedPassword - hashed password
   */
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return new Promise( async (resolve, reject) => {
      try {
        const match = await bcrypt.compare(password, hashedPassword);
        resolve(match);
      } catch (error) {
        reject('Error: Cannot compare password.');
      }
    });
  }

  async generateNewToken(payload: UserJwtPayload): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const token = this.jwtService.sign(payload);
        resolve(token);
      } catch (e) {
        reject('Error: Cannot generate token.');
      }
    })
  }

  async verifyToken(toekn: string, userId: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const payload = await this.jwtService.verify(toekn, {secret: JWT_CONSTENT.secret});
        const isValidToken = payload.sub === userId;
        resolve(isValidToken);
      } catch (error) {
        reject(false);
      }
    });
  }

  async isValidCredentials(source: string, target: string): Promise<boolean> {
    return await this.comparePassword(source, target);
  }

  async validateUser(username: string, password: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
      if (!this.userService.isValidUsernmae(username) || !this.userService.isValidPassword(password)) {
        reject('Invalid username or password.');
      }
      try {
        const user = await this.userService.getUserByUsername(username);
        if (!user) reject('Invalid username or password.');
        if (user.username.toLowerCase() != username.toLowerCase()) reject('Invalid username.');
        
        const isValidPwd = await this.isValidCredentials(password, user.password);
        if (!isValidPwd) reject('Invalid password.');

        resolve({...user, password: '***'});
      } catch (error) {
        reject(error);
      }
    });
  }

  async login(user: User): Promise<User> {
    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);
    user['token'] = token; 
    const isTokenUpdated = this.userService.updateUserToken(user);
    if (!isTokenUpdated) throw new Error('Cannot save user token');
    return user;
  }

  async SignUp(user: User): Promise<User> {
    return new Promise(async (resolve, reject) => {
      if (!user) reject('Error: user should not be null.')
      if (!this.userService.isValidPassword(user.password)) reject('Error: Unacceptable password.')
      if (!this.userService.isValidName(user.firstname)) reject('Error: Invalid first name.');
      if (!this.userService.isValidName(user.lastname)) reject('Error: Invalid last name.');
      if (!this.userService.isValidName(user.username)) reject('Error: Invalid username.');
      if (!this.userService.isValidName(user.password)) reject('Error: Weak password.');

      const users = await this.userService.getUsers();
      if (!this.userService.isUniqueUserName(user.username, users)) reject('This username already exist');

      try {
        // Get hashe password
        const pwd = await this.getHashedPassword(user.password);

        // Create a new toekn
        const payload = { username: user.username, sub: user.id };
        const token = await this.generateNewToken(payload);
        user = { ...user, token: token, password: pwd };
        const isCreated = await this.userService.createUser(user);
        if (!isCreated) throw new Error('Cannot save user');
        resolve(user)
      } catch (error) {
        reject('ERROR: Sign up.');
      }
    });
  }
}
