import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Roles } from './decorator/role.decorator';
import { UserDTO } from './dto/user.dto';
import { RoleType } from './role-type';
import { AuthGuard } from './security/auth.guard';
import { RolesGuard } from './security/role.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/register')
    @UsePipes(ValidationPipe)
    async registerAccount(@Body() userDTO: UserDTO): Promise<any> {
        return await this.authService.registerUser(userDTO);
    }

    @Post('/login')
    async login(@Body() userDTO: UserDTO, @Res() res: Response): Promise<any> {
        const jwt = await this.authService.validateUser(userDTO);
        res.setHeader('Authorization', 'Bearer '+jwt.accessToken);
        return res.json(jwt);
    }

    @Get('/authenticate')
    @UseGuards(AuthGuard)
    isAuthenticated(@Req() req: Request): any {
        const user: any = req.user;
        return user;
    }

    @Get('/admin-role')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(RoleType.ADMIN)
    adminRole(@Req() req: Request): any {
        const user: any = req.user;
        return user;
    }
}
