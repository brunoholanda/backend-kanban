import { IsString, IsNotEmpty, MinLength, MaxLength, IsUUID, IsOptional } from 'class-validator';

export class CreateApproverDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @IsUUID()
  @IsOptional()
  companyId?: string;
}

export class UpdateApproverDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;
}
