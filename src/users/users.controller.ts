import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Res,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from './users.service';
import { Response } from 'express';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './interfaces/user.interface';

@Controller('api/users')
@ApiTags('[사용자 관련]')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('/new')
  @ApiOperation({
    summary: '신규 유저 등록',
    description: '전송된 데이터를 토대로 신규 유저 정보를 등록한다.',
  })
  @ApiResponse({ status: 201 })
  @ApiResponse({
    status: 400,
    description: '부정확한 정보를 포함하고 있거나 기타 장애로 생성 실패시',
  })
  async signupHandle(@Body() signupDto: SignUpDto, @Res() res: Response) {
    const created = await this.usersService.create(signupDto);
    res.status(201).json(created);
  }

  @Get('/auth')
  @ApiOperation({
    summary: '유저 확인',
    description:
      '전송된 데이터를 토대로 유저 정보를 확인하여 억세스토큰을 발급한다.',
  })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, description: '사용자 검색에 실패시' })
  async signInHandle(@Query() signinDto: SignInDto, @Res() res: Response) {
    await this.usersService.authenticate(signinDto);

    const payload = {
      iss: 'babbelmate',
      sub: signinDto.userId,
      iat: Date.now(),
    };
    const token = await this.jwtService.signAsync(payload, {
      secret: 'ah7T4hbC0sNlM99XnRWI11vlA9FdSPR9',
    });

    res.status(200).json({ access_token: token });
  }

  @Get('/private')
  async myInfoHandle(
    @Headers('authorization') token: string,
    @Res() res: Response,
  ) {
    // console.log(token);
    if (token) {
      if (!token.startsWith('Bearer') || token.split(' ').length !== 2) {
        return res
          .status(401)
          .json({ statusCode: 401, message: 'Invalid token' });
      }
      const extrat = token.split(' ')[1];
      try {
        const decoded = await this.jwtService.verifyAsync(extrat, {
          secret: 'ah7T4hbC0sNlM99XnRWI11vlA9FdSPR9',
        });
        res.status(200).json(decoded);
      } catch (error) {
        // 토큰이 유효하지 않은 경우 또는 오류가 발생한 경우 처리
        return res
          .status(401)
          .json({ statusCode: 401, message: 'Invalid token' });
      }
    } else {
      // 토큰이 없는 경우 처리
      return res
        .status(401)
        .json({ statusCode: 401, message: 'Token not provided' });
    }
  }
}
