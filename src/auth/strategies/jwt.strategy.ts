import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

export const jwtConstants = {
  secret: `LO:5S"?^7NaCVGwk8i:T8,*Th"9b@'dZ77~^O7*6F@|/u=mn*AQ{(asGDXY7@Ct`,
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  //this is called with every log in
  async validate(payload: any) {
    return { username: payload.username };
  }
}
