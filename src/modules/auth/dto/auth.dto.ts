import { IsString, IsNotEmpty, MinLength, MaxLength, IsEmail, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { UserType } from '../../../entities/user.entity';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @IsEmail()
  email: string;

  @IsUUID()
  @IsNotEmpty()
  companyId?: string;

  @IsEnum(UserType)
  @IsOptional()
  userType?: UserType;
}

export class GoogleLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  picture?: string;
}

export class AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    companyId: string;
    userType: UserType;
  };
}
