import { User } from '../../domain/entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';

export interface IAuthService {
  validateUser(email: string, plainPassword: string): Promise<User>;
  login(loginDto: LoginDto): Promise<{
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: string;
    user: any;
  }>;
  refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<{
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: string;
  }>;
  logout(userId: string, refreshToken: string): Promise<void>;
  changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void>;
  logoutAllDevices(userId: string): Promise<void>;
}