import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ConflictException,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './schemas/user.schema';
import { Request as ExpressRequest } from 'express';

interface UserJwtPayload {
  userId: string;
  email: string;
  role: string;
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

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

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UsePipes(new ValidationPipe())
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    const existing = await this.usersService.findByEmail(createAdminDto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    return this.usersService.create(
      createAdminDto.email,
      createAdminDto.password,
      UserRole.ADMIN,
    );
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllUsers() {
    return this.usersService.findAll();
  }
}
