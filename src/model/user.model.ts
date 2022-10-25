export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  token?: string;
}

export interface ConnectedUser {
  id: number;
  username: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface UserJwtPayload {
  username: string;
  sub: number;
}