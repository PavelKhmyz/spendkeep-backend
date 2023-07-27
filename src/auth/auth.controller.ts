// import {
//   Body,
//   Controller,
//   Get,
//   Post,
//   UseGuards,
//   Request,
// } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { SignUpDto } from './dto/sign-up.dto';
// import { SignInDto } from './dto/sign-in.dto';
// import { AuthGuard, CustomRequest } from './auth.guard';

// @Controller('auth')
// export class AuthController {
//   constructor(private authService: AuthService) {}

//   @Post('signUp')
//   signUp(@Body() signUpDto: SignUpDto) {
//     return this.authService.signUp(signUpDto);
//   }

//   @Post('signIn')
//   signIn(@Body() signInDto: SignInDto) {
//     return this.authService.signIn(signInDto);
//   }

//   @UseGuards(AuthGuard)
//   @Get('refresh')
//   refresh(@Request() req: CustomRequest) {
//     return this.authService.refresh(req.token, req.user);
//   }

//   @UseGuards(AuthGuard)
//   @Get('signOut')
//   signOut(@Request() req: CustomRequest) {
//     return this.authService.signOut(req.user.sub);
//   }

//   @UseGuards(AuthGuard)
//   @Get('deleteUser')
//   removeUser(@Request() req: CustomRequest) {
//     return this.authService.remove(req.user.sub);
//   }

//   @UseGuards(AuthGuard)
//   @Get('user')
//   getUser(@Request() req: CustomRequest) {
//     return req.user;
//   }
// }
