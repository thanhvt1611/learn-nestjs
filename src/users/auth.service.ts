import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scryptSync } from 'crypto';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}
  async signUp(email: string, password: string) {
    // See if email is in use
    const users = await this.userService.find(email);
    if (users.length) throw new BadRequestException('Email is already in use');

    // Hash password
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash salt & password together
    const hash = scryptSync(password, salt, 32) as Buffer;

    // Join the hased result & salt together
    const resPass = `${salt}.${hash.toString('hex')}`;

    const user = await this.userService.createUser(email, resPass);
    return user;
  }

  async signIn(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) throw new NotFoundException('User not found');

    const [salt, storedHash] = user.password.split('.');
    const passwordHash = scryptSync(password, salt, 32) as Buffer;
    if (passwordHash.toString('hex') !== storedHash)
      throw new BadRequestException('Password invalid');

    return user;
  }
}
