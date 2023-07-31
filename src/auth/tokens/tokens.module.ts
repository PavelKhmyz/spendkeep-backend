// import { Module } from '@nestjs/common';
// import { TokensService } from './tokens.service';
// import { JwtModule } from '@nestjs/jwt';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Tokens, TokensSchema } from './schemas/tokens.schema';
// import { ConfigModule } from '@nestjs/config';
// @Module({
//   imports: [
//     ConfigModule.forRoot(),
//     JwtModule.register({
//       global: true,
//       secret: process.env.JWT_SECRET,
//     }),
//     MongooseModule.forFeature([{ name: Tokens.name, schema: TokensSchema }]),
//   ],
//   providers: [TokensService],
//   exports: [TokensService],
// })
// export class TokensModule {}
