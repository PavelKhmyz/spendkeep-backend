// import { BadRequestException, Injectable } from '@nestjs/common';
// import { SignUpDto } from './dto/sign-up.dto';
// import * as bcrypt from 'bcrypt';
// import { UserService } from 'src/user/user.service';
// import { TokensService } from './tokens/tokens.service';
// import { SignInDto } from './dto/sign-in.dto';
// import { Tokens } from './tokens/schemas/tokens.schema';
// import { User } from 'src/user/schemas/user.schema';
// import { GenerateTokensDto } from './tokens/dto/generate-token.dto';

// @Injectable()
// export class AuthService {
//   constructor(
//     private userService: UserService,
//     private tokensService: TokensService,
//   ) {}

//   async signUp(signUpDto: SignUpDto): Promise<Tokens> {
//     const isUserExist = await this.userService.find({ email: signUpDto.email });
//     if (isUserExist) {
//       throw new BadRequestException('User with this email already exists');
//     }
//     const passwordHash = await bcrypt.hash(
//       signUpDto.password,
//       +process.env.HASH_SALT,
//     );
//     const fullName = signUpDto.firstName + '' + signUpDto.lastName;
//     const user = await this.userService.create({
//       ...signUpDto,
//       password: passwordHash,
//       fullName,
//       avatarUrl: '',
//     });
//     const userTokens = await this.tokensService.generateTokens({
//       userName: user.fullName,
//       sub: user._id.toString(),
//     });
//     await this.tokensService.saveTokens(userTokens);
//     return userTokens;
//   }

//   async signIn(signInDto: SignInDto): Promise<Tokens> {
//     const findUser = await this.userService.find({ email: signInDto.email });
//     if (!findUser) {
//       throw new BadRequestException('User doesn`t exist');
//     }
//     const passwordCompare = await bcrypt.compare(
//       signInDto.password,
//       findUser.password,
//     );
//     if (!passwordCompare) {
//       throw new BadRequestException('Wrong password');
//     }
//     const userTokens = await this.tokensService.generateTokens({
//       userName: findUser.fullName,
//       sub: findUser._id.toString(),
//     });
//     await this.tokensService.saveTokens(userTokens);
//     return userTokens;
//   }

//   async signOut(sub: string) {
//     return await this.tokensService.removeTokens(sub);
//   }

//   async refresh(token: string, user: GenerateTokensDto): Promise<Tokens> {
//     const newTokens = await this.tokensService.generateTokens({
//       userName: user.userName,
//       sub: user.sub,
//     });
//     return await this.tokensService.refreshTokens(token, newTokens);
//   }

//   async remove(id: string): Promise<User> {
//     await this.signOut(id);
//     return await this.userService.remove(id);
//   }
// }
