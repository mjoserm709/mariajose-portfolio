import { IsOptional, IsString } from 'class-validator';

export class UpdateTechnologyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  iconClass?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
