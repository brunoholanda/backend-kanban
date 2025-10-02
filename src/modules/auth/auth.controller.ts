import { Controller, Post, Body, UseGuards, Get, Request, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, CreateUserDto, GoogleLoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      id: req.user.id,
      username: req.user.username,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      companyId: req.user.companyId,
      userType: req.user.userType,
    };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Esta rota será chamada pelo Google OAuth
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    try {
      console.log('🔄 Processando callback do Google OAuth...');
      console.log('👤 Dados do usuário Google:', req.user);
      
      const result = await this.authService.googleLogin(req.user);
      
      console.log('✅ Login processado com sucesso');
      console.log('🔑 Token gerado:', result.access_token ? 'Sim' : 'Não');
      console.log('👤 Usuário:', result.user);
      
      // Se for uma requisição de popup, enviar mensagem para o parent window
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Google Login</title>
        </head>
        <body>
          <script>
            console.log('📨 Enviando mensagem para parent window...');
            console.log('🎯 Target origin:', '${frontendUrl}');
            
            if (window.opener) {
              console.log('✅ Parent window encontrada, enviando dados...');
              window.opener.postMessage({
                type: 'GOOGLE_AUTH_SUCCESS',
                access_token: '${result.access_token}',
                user: ${JSON.stringify(result.user)}
              }, '${frontendUrl}');
              console.log('📤 Mensagem enviada com sucesso');
              window.close();
            } else {
              console.log('❌ Parent window não encontrada, redirecionando...');
              window.location.href = '${frontendUrl}?token=${result.access_token}';
            }
          </script>
        </body>
        </html>
      `;
      
      res.send(html);
    } catch (error) {
      console.error('❌ Erro no callback do Google OAuth:', error);
      
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Google Login Error</title>
        </head>
        <body>
          <script>
            console.log('❌ Enviando erro para parent window...');
            
            if (window.opener) {
              window.opener.postMessage({
                type: 'GOOGLE_AUTH_ERROR',
                error: '${error.message}'
              }, '${frontendUrl}');
              window.close();
            } else {
              window.location.href = '${frontendUrl}?error=${encodeURIComponent(error.message)}';
            }
          </script>
        </body>
        </html>
      `;
      
      res.send(html);
    }
  }

  @Post('google/login')
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    return this.authService.googleLogin(googleLoginDto);
  }
}
