import { IsUUID } from 'class-validator';

export class LinkProjectTechnologyDto {
  @IsUUID()
  technologyId!: string;
}
