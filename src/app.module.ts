import { AuthModule } from '@Auth/auth.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@User/user.module';
import joiSchema from '../joi.schema';
import { getTypeormConfig } from '../configs/typeorm.config';
import { JwtLocalModule } from './jwt-local/jwt-local.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.dev.env',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: joiSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeormConfig,
    }),
    JwtLocalModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
