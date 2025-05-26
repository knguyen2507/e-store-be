import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UtilityImplement } from 'src/libs/utility/utility.module';
import moment = require('moment');

@Injectable()
export class AuthnGuard implements CanActivate {
  constructor(private readonly util: UtilityImplement) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();


    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new HttpException('Authentication Required', HttpStatus.UNAUTHORIZED);
    }
    try {
      const payload = this.util.verifyAccessToken(token);
      if (!payload) throw new HttpException('Authentication Required', HttpStatus.UNAUTHORIZED);
      request['user'] = payload.user;
      request['token'] = token;
    } catch {
      throw new HttpException('Error Server!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
