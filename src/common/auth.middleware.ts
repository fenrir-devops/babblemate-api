// auth.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request & {user : string}, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (token) {
      try {
        const decodedToken = await this.jwtService.verifyAsync(token, {
            secret: 'ah7T4hbC0sNlM99XnRWI11vlA9FdSPR9',
          });
        req.user = decodedToken.sub; // 검증된 토큰 정보를 req.user에 저장
      } catch (error) {
        // 토큰이 유효하지 않은 경우 또는 오류가 발생한 경우 처리
        return res.status(401).json({ statusCode : 401, message: 'Invalid token' });
      }
    } else {
      // 토큰이 없는 경우 처리
      return res.status(401).json({ statusCode : 401, message: 'Token not provided' });
    }
    next();
  }
}