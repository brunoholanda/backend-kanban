import { IsString, IsNotEmpty, IsUrl, IsDateString, IsEnum, IsArray, IsUUID, IsOptional, MaxLength, Allow } from 'class-validator';
import { CardStatus } from '../../../entities/card.entity';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsUrl()
  gmudLink: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  executor: string;

  @IsDateString()
  openDate: string;

  @IsDateString()
  executionForecast: string;

  @IsEnum(CardStatus)
  @IsOptional()
  status?: CardStatus;

  @IsArray()
  @IsUUID('4', { each: true })
  approverIds: string[];

  @IsUUID()
  @IsOptional()
  companyId?: string;
}

export class UpdateCardDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @IsOptional()
  title?: string;

  @IsUrl()
  @IsOptional()
  gmudLink?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @IsOptional()
  executor?: string;

  @IsDateString()
  @IsOptional()
  openDate?: string;

  @IsDateString()
  @IsOptional()
  executionForecast?: string;

  @IsEnum(CardStatus)
  @IsOptional()
  status?: CardStatus;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  approverIds?: string[];

  // Propriedades que podem vir do frontend mas não são validadas
  @Allow()
  id?: string;
  
  @Allow()
  companyId?: string;
  
  @Allow()
  approvers?: any[];
  
  @Allow()
  createdAt?: string;
  
  @Allow()
  updatedAt?: string;
}
