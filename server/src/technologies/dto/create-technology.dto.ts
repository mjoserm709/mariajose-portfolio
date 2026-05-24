import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateTechnologyDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsUrl()
  iconUrl?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
