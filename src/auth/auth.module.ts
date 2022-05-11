import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { Profile, profileSchema } from './profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Profile.name, schema: profileSchema },
    ]),
    ConfigModule,
    PassportModule.registerAsync({
      useFactory: () => ({
        defaultStrategy: 'jwt',
        property: 'user',
        session: false,
      }),
    }),
    JwtModule.registerAsync({
      useFactory: () => ({
        signOptions: { expiresIn: '15m' },
        secret: process.env.AUTH_SECRET,
      }),
    }),
  ],
  providers: [LocalStrategy, JwtStrategy, AuthService, UsersService],
  controllers: [AuthController, UsersController],
})
export class AuthModule {}
