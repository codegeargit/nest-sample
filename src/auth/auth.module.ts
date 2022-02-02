import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './security/passport.jwt.strategy';
import { UserRepository } from './repository/user.repository';
import { UserService } from './user.service';
import { UserAuthorityRepository } from './repository/user-authority.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, UserAuthorityRepository]),
    JwtModule.register({
      secret: 'SECRET_KEY',
      signOptions: {expiresIn: '300s'},
    }),
    PassportModule
  ],
  exports: [TypeOrmModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy]
})
export class AuthModule {}
