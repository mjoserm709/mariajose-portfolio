import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class AddProjectImageDto {
  @IsUrl()
  imageUrl!: string;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
