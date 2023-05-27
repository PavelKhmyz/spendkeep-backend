import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tokens, TokensDocument } from './schemas/tokens.schema';
import { TokenDto } from './dto/token.dto';
import { GenerateTokensDto } from './dto/generate-token.dto';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Tokens.name) private tokensModel: Model<TokensDocument>,
    private jwtService: JwtService,
  ) {}

  async generateTokens(payload: GenerateTokensDto): Promise<Tokens> {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: 15 * 60,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30 days',
    });
    return { accessToken, refreshToken, userId: payload.sub };
  }

  async saveTokens(tokensDto: TokenDto): Promise<Tokens> {
    const newTokens = new this.tokensModel(tokensDto);
    return await newTokens.save();
  }

  async removeTokens(userId: string) {
    return await this.tokensModel.deleteOne({ userId: userId });
  }

  async findTokens(token: string): Promise<boolean> {
    const existAccess = await this.tokensModel
      .findOne({ accessToken: token })
      .exec();
    const existRefresh = await this.tokensModel
      .findOne({ refreshToken: token })
      .exec();
    return existAccess || existRefresh ? true : false;
  }

  async refreshTokens(token: string, newTokens: TokenDto): Promise<Tokens> {
    return await this.tokensModel
      .findOneAndUpdate(
        { refreshToken: token },
        {
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
        },
        { new: true },
      )
      .exec();
  }

  async verifyTokens(token: string): Promise<GenerateTokensDto> {
    const userData = await this.jwtService.verifyAsync(token);
    return userData;
  }
}
