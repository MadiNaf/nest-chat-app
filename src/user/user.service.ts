import { Injectable } from '@nestjs/common';
import { ConnectedUser, User } from 'src/model/user.model';
import UserGuards from './user-guards';
import DbHelper from 'src/db/chatdb-helper';

@Injectable()
export class UserService extends UserGuards {

  constructor() {
    super();
  }

  async getUsers(): Promise<User []> {
    return new Promise(async (resolve, reject) => {
      try {
        const query = `SELECT * FROM user ORDER BY id DESC;`;
        const dbUsers = await DbHelper.selectAll(query) as Array<User>;
        resolve(dbUsers)
      } catch (error) {
        reject('Error: unauthorized');
      }
    });
  }

  async getUserById(userId: number): Promise<User> {
    return new Promise( async (resolve, reject) => {
      if (isNaN(userId)) reject('User id must be a number.');
      try {
        const query = `SELECT * FROM user WHERE id = ${userId}`;
        const user = await DbHelper.getOneElement(query);
        
        if (!user) reject('Error: user not found');
        resolve({...user, password: '***'});
      } catch (error) {
        reject('Error: Cannot get user');
      }
    });
  }

  async getUserByUsername(username: string): Promise<User> {
    return new Promise( async (resolve, reject) => {
      if (!this.isValidName(username)) reject('Error: Invalid username.');
      
      try {
        const query = `SELECT * FROM user WHERE username ='${username}';`;
        const user = await DbHelper.getOneElement(query);
        
        if (!user) reject('Error: user not found');
        resolve(user);
      } catch (error) {
        reject('Error: Cannot get user.');
      }
    });
  }

  async getConnectedUsers(): Promise<ConnectedUser []> {
    return new Promise(async (resolve, reject) => {
      try {
        const query = `SELECT * FROM chat_session ORDER BY id DESC;`;
        const dbUsers = await DbHelper.selectAll(query) as Array<ConnectedUser>;
        resolve(dbUsers)
      } catch (error) {
        reject('Error: GET all chat session.');
      }
    });
  }

  async addConnectedUser(user: User): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!user) reject('Cannot create session.');
      try {
        const { id, username } = user;
        const query = `INSERT INTO chat_session (user_id, username) VALUES (?, ?);`;
        const dbRes = await DbHelper.insertInto(query, [id?.toString(), username]);
        if (!dbRes) reject('ERROR: Sign up');
        user = { ...user, token: '' };
        resolve(true);
      } catch (error) {
        reject('Cannot add user to a session.');
      }
    });
  }

  async createUser(user: User): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const { firstname, lastname, username, password, token} = user;
        const query = `INSERT INTO user (firstname, lastname, username, password, token) VALUES (?, ?, ?, ?, ?);`;
        const dbRes = await DbHelper.insertInto(query, [firstname, lastname, username, password, token]);
        if (!dbRes) reject('ERROR: Sign up');
        if (!dbRes) reject(false);
        resolve(true);
      } catch (error) {
        reject(false);
      }
    });
  }

 async updateUserToken(user: User): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const token = user?.token;
      const query = `UPDATE user SET token ='${token}' WHERE id = ${user.id} AND username ='${user.username}';`;
      const dbRes = await DbHelper.update(query);
      if (!dbRes) reject(false);
      resolve(true);
    } catch (error) {
      reject(false);
    }
  });
 }
}