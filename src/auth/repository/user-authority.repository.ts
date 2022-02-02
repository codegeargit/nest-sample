import { EntityRepository, Repository } from "typeorm";
import { UserAuthority } from "../entity/user-authority.entity";

@EntityRepository(UserAuthority)
export class UserAuthorityRepository extends Repository<UserAuthority> {}