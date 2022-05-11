import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/users/decorators/users.decorator';
import { User } from 'src/schemas/user.schema';
import { AuthGuardJwt } from './auth-guard.jwt';
import { AuthGuardLocal } from './auth-guard.local';
import { AuthService } from './auth.service';

@Controller('auth')
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User): Promise<{
    userId: import('mongoose').Schema.Types.ObjectId;
    token: string;
  }> {
    return {
      userId: user._id,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Get('profile')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async getProfile(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
