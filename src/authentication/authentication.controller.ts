import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { EmailVerificationService } from 'src/email-verification/email-verification.service';
import { RemovePasswordInterceptor } from 'src/removePassword.interceptor';
import { UsersService } from 'src/users/users.service';
import { AuthenticationService } from './authentication.service';
import { ChangePasswordDto } from './change-password.dto';
import { CreateUserDto } from './create-user.dto';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import JwtRefreshGuard from './jwtRefresh.guard';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import { LogInDto } from './log-in.dto';
import RequestWithUser from './requestWithUser.interface';

@Controller('auth')
@ApiTags('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UsersService,
    private readonly verifyEmailService: EmailVerificationService,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  @UseInterceptors(RemovePasswordInterceptor)
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }

  @Post('register')
  @UseInterceptors(RemovePasswordInterceptor)
  async register(@Body() registrationData: CreateUserDto) {
    const user = await this.authenticationService.register(registrationData);
    await this.verifyEmailService.sendVerificationLink(user.email);

    return user;
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  @ApiBody({ type: LogInDto })
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const user = request.user;
    const accesToken = this.authenticationService.getCookieWithJwtToken(
      user.id,
    );
    const refreshToken =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(refreshToken.token, user.id);
    response.setHeader('Set-Cookie', [accesToken, refreshToken.cookie]);
    user.password = undefined;

    return response.send(user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    await this.userService.removeRefreshToken(request.user.id);
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );

    return response.sendStatus(200);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authenticationService.getCookieWithJwtToken(
      request.user.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }

  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  @Patch('password-change')
  async changePassword(@Body() body: ChangePasswordDto) {
    const { userId, oldPassword, newPassword, confirmationPassword } = body;

    const user = this.authenticationService.resetPassword(
      userId,
      oldPassword,
      newPassword,
      confirmationPassword,
    );

    return user;
  }
}
