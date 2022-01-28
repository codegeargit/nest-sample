import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService
    ){}

    async registerUser(newUser: UserDTO): Promise<UserDTO> {
        let userFind: UserDTO = await this.userService.findByFields({ 
            where: { username: newUser.username }
        });
        if(userFind) {
            throw new HttpException('Username aleady used!', HttpStatus.BAD_REQUEST);
        }
        return await this.userService.save(newUser);
    }

    async validateUser(userDTO: UserDTO): Promise<UserDTO | undefined> {
        let userFind: UserDTO = await this.userService.findByFields({
            where: { username: userDTO.username }
        });
        if(!userFind || userDTO.password !== userFind.password) {
            throw new UnauthorizedException();
        }
        return userFind;
    }
}
