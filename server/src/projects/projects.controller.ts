import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { AddProjectImageDto } from './dto/add-project-image.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { LinkProjectTechnologyDto } from './dto/link-project-technology.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Public()
  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get('admin')
  findAllAdmin() {
    return this.projectsService.findAllAdmin();
  }

  @Get('admin/:id')
  findOneAdmin(@Param('id') id: string) {
    return this.projectsService.findOneAdmin(id);
  }

  @Public()
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Post(':id/images')
  addImage(@Param('id') id: string, @Body() addProjectImageDto: AddProjectImageDto) {
    return this.projectsService.addImage(id, addProjectImageDto);
  }

  @Delete(':id/images/:imageId')
  removeImage(@Param('imageId') imageId: string) {
    return this.projectsService.removeImage(imageId);
  }

  @Post(':id/technologies')
  linkTechnology(
    @Param('id') id: string,
    @Body() linkProjectTechnologyDto: LinkProjectTechnologyDto,
  ) {
    return this.projectsService.linkTechnology(id, linkProjectTechnologyDto);
  }

  @Delete(':id/technologies/:technologyId')
  unlinkTechnology(@Param('id') id: string, @Param('technologyId') technologyId: string) {
    return this.projectsService.unlinkTechnology(id, technologyId);
  }
}
