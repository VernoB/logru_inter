import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigOptions } from 'config/option.config';

import 'reflect-metadata';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'config/.env',
      isGlobal: true,
      expandVariables: true,
    }),
    MongooseModule.forRootAsync({ useClass: ConfigOptions }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
