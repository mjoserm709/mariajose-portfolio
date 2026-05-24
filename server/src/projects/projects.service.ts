import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AddProjectImageDto } from './dto/add-project-image.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { LinkProjectTechnologyDto } from './dto/link-project-technology.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

const PROJECT_SELECT = `
  id,
  title,
  slug,
  short_description,
  description,
  github_url,
  demo_url,
  status,
  featured,
  sort_order,
  created_at,
  updated_at,
  project_images (
    id,
    image_url,
    alt_text,
    sort_order
  ),
  project_technologies (
    technologies (
      id,
      name,
      icon_url,
      category
    )
  )
`;

@Injectable()
export class ProjectsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('projects')
      .select(PROJECT_SELECT)
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data?.map((project) => this.mapProject(project)) ?? [];
  }

  async findAllAdmin() {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('projects')
      .select(PROJECT_SELECT)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data?.map((project) => this.mapProject(project)) ?? [];
  }

  async findOneAdmin(id: string) {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('projects')
      .select(PROJECT_SELECT)
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Project not found.');
    }

    return this.mapProject(data);
  }

  async findBySlug(slug: string) {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('projects')
      .select(PROJECT_SELECT)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      throw new NotFoundException('Project not found.');
    }

    return this.mapProject(data);
  }

  async create(createProjectDto: CreateProjectDto) {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('projects')
      .insert({
        title: createProjectDto.title,
        slug: createProjectDto.slug,
        short_description: createProjectDto.shortDescription,
        description: createProjectDto.description,
        github_url: createProjectDto.githubUrl,
        demo_url: createProjectDto.demoUrl,
        status: createProjectDto.status ?? 'published',
        featured: createProjectDto.featured ?? false,
        sort_order: createProjectDto.sortOrder ?? 0,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('projects')
      .update(this.toProjectRow(updateProjectDto))
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('Project not found.');
    }

    return data;
  }

  async remove(id: string) {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('projects')
      .delete()
      .eq('id', id)
      .select('id')
      .single();

    if (error || !data) {
      throw new NotFoundException('Project not found.');
    }

    return {
      id: data.id,
      deleted: true,
    };
  }

  async addImage(projectId: string, addProjectImageDto: AddProjectImageDto) {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('project_images')
      .insert({
        project_id: projectId,
        image_url: addProjectImageDto.imageUrl,
        alt_text: addProjectImageDto.altText,
        sort_order: addProjectImageDto.sortOrder ?? 0,
      })
      .select('id, project_id, image_url, alt_text, sort_order')
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async removeImage(imageId: string) {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('project_images')
      .delete()
      .eq('id', imageId)
      .select('id')
      .single();

    if (error || !data) {
      throw new NotFoundException('Project image not found.');
    }

    return {
      id: data.id,
      deleted: true,
    };
  }

  async linkTechnology(projectId: string, linkProjectTechnologyDto: LinkProjectTechnologyDto) {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('project_technologies')
      .insert({
        project_id: projectId,
        technology_id: linkProjectTechnologyDto.technologyId,
      })
      .select('project_id, technology_id')
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async unlinkTechnology(projectId: string, technologyId: string) {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('project_technologies')
      .delete()
      .eq('project_id', projectId)
      .eq('technology_id', technologyId)
      .select('project_id, technology_id')
      .single();

    if (error || !data) {
      throw new NotFoundException('Project technology relation not found.');
    }

    return {
      projectId: data.project_id,
      technologyId: data.technology_id,
      deleted: true,
    };
  }

  private toProjectRow(projectDto: CreateProjectDto | UpdateProjectDto) {
    return {
      ...(projectDto.title !== undefined && { title: projectDto.title }),
      ...(projectDto.slug !== undefined && { slug: projectDto.slug }),
      ...(projectDto.shortDescription !== undefined && {
        short_description: projectDto.shortDescription,
      }),
      ...(projectDto.description !== undefined && { description: projectDto.description }),
      ...(projectDto.githubUrl !== undefined && { github_url: projectDto.githubUrl }),
      ...(projectDto.demoUrl !== undefined && { demo_url: projectDto.demoUrl }),
      ...(projectDto.status !== undefined && { status: projectDto.status }),
      ...(projectDto.featured !== undefined && { featured: projectDto.featured }),
      ...(projectDto.sortOrder !== undefined && { sort_order: projectDto.sortOrder }),
    };
  }

  private mapProject(project: any) {
    return {
      id: project.id,
      title: project.title,
      slug: project.slug,
      shortDescription: project.short_description,
      description: project.description,
      githubUrl: project.github_url,
      demoUrl: project.demo_url,
      status: project.status,
      featured: project.featured,
      sortOrder: project.sort_order,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
      images: [...(project.project_images ?? [])].sort(
        (firstImage, secondImage) => firstImage.sort_order - secondImage.sort_order,
      ),
      technologies: (project.project_technologies ?? [])
        .map((item: any) => item.technologies)
        .filter(Boolean),
    };
  }
}
