import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { TechnologiesService } from './technologies.service';

@Controller('technologies')
export class TechnologiesController {
  constructor(private readonly technologiesService: TechnologiesService) {}

  @Public()
  @Get()
  findAll() {
    return this.technologiesService.findAll();
  }

  @Post()
  create(@Body() createTechnologyDto: CreateTechnologyDto) {
    return this.technologiesService.create(createTechnologyDto);
  }
}
