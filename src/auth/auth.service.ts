import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { User } from '../domain/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { Payload } from './security/payload.interface';
import { JwtService } from '@nestjs/jwt';

const logger: Logger = new Logger('AuthService');

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}

    async registerUser(newUser: UserDTO): Promise<UserDTO> {
        let userFind: UserDTO = await this.userService.findByFields({
            where: { username: newUser.username }
        });
        if(userFind) {
            throw new HttpException('Username aleady used!', HttpStatus.BAD_REQUEST);
        }
        const registeredUser = await this.userService.save(newUser);
        if(registeredUser){
            logger.log('registered user is ' + JSON.stringify(registeredUser));
            await this.userService.saveAuthority(registeredUser.id);
        }else {
            logger.log('register error user is ' + newUser.username);
            throw new HttpException('Username register error!', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return registeredUser;
    }

    async validateUser(userDTO: UserDTO): Promise<{accessToken: string} | undefined> {
        console.log('ENV :' +process.env.BACKEND_ENV);
        let userFind: User = await this.userService.findByFields({
            where: { username: userDTO.username }
        });
        if(!userFind) {
            throw new UnauthorizedException();
        }
        const validatePassword = await bcrypt.compare(userDTO.password, userFind.password);
        if(!validatePassword) {
            throw new UnauthorizedException();
        }

        this.convertInAuthorities(userFind);

        const payload: Payload = { id: userFind.id, username: userFind.username, authorities: userFind.authorities };
        return {
            accessToken: this.jwtService.sign(payload)
        };
    }

    async tokenValidateUser(payload: Payload): Promise<User| undefined> {
        const userFind = await this.userService.findByFields({
            where: { id: payload.id }
        });
        this.flatAuthorities(userFind);
        return userFind;
    }

    private flatAuthorities(user: any): User {
        if (user && user.authorities) {
            const authorities: string[] = [];
            user.authorities.forEach(authority => authorities.push(authority.authorityName));
            user.authorities = authorities;
        }
        return user;
    }

    private convertInAuthorities(user: any): User {
        if (user && user.authorities) {
            const authorities: any[] = [];
            user.authorities.forEach(authority => authorities.push({ name: authority.authorityName }));
            user.authorities = authorities;
        }
        return user;
    }
}
