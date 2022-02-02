import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserAuthority } from "./user-authority.entity";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToMany(()=>UserAuthority, userAuthority => userAuthority.user, {eager: true})
    authorities?: any[];
}