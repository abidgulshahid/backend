import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<{ _id: string; email: string; role: string } | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await this.usersService.validatePassword(user, password))) {
      const userDoc = user as UserDocument & { _id: Types.ObjectId };
      return {
        _id: userDoc._id.toString(),
        email: userDoc.email,
        role: userDoc.role,
      };
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, role } = registerDto;
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const user = await this.usersService.create(email, password, role);
    const userDoc = user as UserDocument & { _id: Types.ObjectId };
    const payload = {
      email: userDoc.email,
      sub: userDoc._id.toString(),
      role: userDoc.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: userDoc._id.toString(),
        email: userDoc.email,
        role: userDoc.role,
      },
    };
  }
}
