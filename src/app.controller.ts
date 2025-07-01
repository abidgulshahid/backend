import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UsersService } from './users/users.service';
import { Request as ExpressRequest } from 'express';

interface UserJwtPayload {
  userId: string;
  email: string;
  role: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req: ExpressRequest) {
    const userJwt = req.user as UserJwtPayload;
    const user = await this.usersService.findByEmail(userJwt.email);
    if (!user) {
      return { error: 'User not found' };
    }
    return {
      email: user.email,
      role: user.role,
    };
  }
}
