
import { Body, Controller, Get, Headers, Post, Query, Res, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from './users.service';
import { Response } from 'express';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService : UsersService, private jwtService : JwtService) {}

    @Post('/new')
    async signupHandle(@Body() signupDto : SignUpDto, @Res() res: Response)  {
        
        const created = await this.usersService.create(signupDto);
        res.status(201).json(created);
    }



    @Get('/auth')
    async signInHandle(@Query() signinDto : SignInDto, @Res() res: Response)  {
        
        await this.usersService.authenticate(signinDto);

        const paylod = {iss : "babbelmate",  sub : signinDto.userId, iat : Date.now()}
        const token = await this.jwtService.signAsync(paylod, {secret : "ah7T4hbC0sNlM99XnRWI11vlA9FdSPR9"});
        
        res.status(200).json({"access_token" : token});
    }


    @Get('/private') 
    async myInfoHandle(@Headers('authorization') token : string) {
        console.log(token);
        try {
            const result = await this.jwtService.verifyAsync(token, {secret : "ah7T4hbC0sNlM99XnRWI11vlA9FdSPR9"});
        }catch(e) {
            console.log(e);
            throw new UnauthorizedException("invalid token");
        }

    } 
}

