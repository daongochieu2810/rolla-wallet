import { Body, Controller, Post, Get, Request } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/deposit')
  async sendTransaction(@Request() req, @Body() body) {
    const username = req.user.username;
    return this.usersService.deposit(username, body);
  }

  @Post('/get-balance')
  async getBalance(@Request() req, @Body() body) {
    const username = req.user.username;
    return this.usersService.getBalance(username, body);
  }
}
