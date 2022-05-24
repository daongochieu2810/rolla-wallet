import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ethers } from 'ethers';

import { UserAuthDto } from '../dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    //hash 10 rounds
    return bcrypt.hash(password, 10);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (isMatch) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserAuthDto) {
    const payload = { username: user.username };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(user: UserAuthDto) {
    try {
      const wallet = ethers.Wallet.createRandom();
      const createdUser = await this.usersService.create({
        username: user.username,
        passwordHash: await this.hashPassword(user.password),
        walletAddress: wallet.address,
        mnemonic: wallet.mnemonic.phrase,
      });

      const payload = { username: createdUser.username };
      return {
        accessToken: this.jwtService.sign(payload),
        wallet: {
          privateKey: wallet.privateKey,
          mnemonic: wallet.mnemonic.phrase,
        },
      };
    } catch (e) {
      console.log(e);
      return {
        error: e,
      };
    }
  }
}
