import { EntityRepository, Repository } from "typeorm";
import { UserAuthority } from "../../domain/user-authority.entity";

@EntityRepository(UserAuthority)
export class UserAuthorityRepository extends Repository<UserAuthority> {}