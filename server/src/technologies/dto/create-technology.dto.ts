import { IsOptional, IsString } from 'class-validator';

export class CreateTechnologyDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  iconClass?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
