// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Request } from 'express';
// import { TokensService } from './tokens/tokens.service';

// export interface CustomRequest extends Request {
//   token: string;
//   user: {
//     userName: string;
//     sub: string;
//     iat: number;
//     exp: number;
//   };
// }

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private tokensService: TokensService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const token = this.extractTokenFromHeader(request);
//     if (!token) {
//       throw new UnauthorizedException();
//     }
//     const isExsist = await this.tokensService.findTokens(token);
//     if (!isExsist) {
//       throw new UnauthorizedException();
//     }
//     try {
//       const payload = await this.tokensService.verifyTokens(token);
//       request['user'] = payload;
//       request['token'] = token;
//     } catch {
//       throw new UnauthorizedException();
//     }
//     return true;
//   }

//   private extractTokenFromHeader(request: Request): string | undefined {
//     const [type, token] = request.headers.authorization?.split(' ') ?? [];
//     return type === 'Bearer' ? token : undefined;
//   }
// }
