import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions } from "typeorm";
import { UserDTO } from "./dto/user.dto";
import { UserRepository } from "./repository/user.repository";
import * as bcrypt from 'bcrypt';
import { User } from "../domain/user.entity";
import { UserAuthorityRepository } from "./repository/user-authority.repository";
import { UserAuthority } from "../domain/user-authority.entity";
import { RoleType } from "./role-type";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        @InjectRepository(UserAuthorityRepository)
        private userAuthorityRepository: UserAuthorityRepository
    ){}

    async findByFields(options: FindOneOptions<UserDTO>): Promise<User | undefined> {
        return await this.userRepository.findOne(options);
    }

    async save(userDTO: UserDTO): Promise<User | undefined> {
        await this.transformPassword(userDTO);
        console.log(userDTO);
        return await this.userRepository.save(userDTO);
    }

    async saveAuthority(userId: number): Promise<UserAuthority | undefined> {
        let userAuth = new UserAuthority();
        userAuth.userId = userId;
        userAuth.authorityName = RoleType.USER;
        return await this.userAuthorityRepository.save(userAuth);
    }

    async transformPassword(user: UserDTO): Promise<void> {
        user.password = await bcrypt.hash(
            user.password, 10,
        );
        return Promise.resolve();
    }
}
