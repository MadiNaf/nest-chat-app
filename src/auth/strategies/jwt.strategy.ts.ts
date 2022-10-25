import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { JWT_CONSTENT } from '../constent'

Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor() {
    super({
      // get JWT from Header 
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONSTENT.secret
    })
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
