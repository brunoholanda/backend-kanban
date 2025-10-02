import { IsString, IsNotEmpty, MaxLength, IsEmail } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  domain: string;

  @IsEmail()
  email: string;
}

export class UpdateCompanyDto {
  @IsString()
  @MaxLength(200)
  name?: string;

  @IsString()
  @MaxLength(100)
  domain?: string;

  @IsEmail()
  email?: string;
}

