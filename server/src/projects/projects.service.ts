import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabaseService.client
      .schema('portfolio')
      .from('projects')
      .select(
        `
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
      `,
      )
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data?.map((project) => this.mapProject(project)) ?? [];
  }

  async findBySlug(slug: string) {
    const { data, error } = await this.supabaseService.client
      .schema('portfolio')
      .from('projects')
      .select(
        `
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
      `,
      )
      .eq('slug', slug)
      .single();

    if (error || !data) {
      throw new NotFoundException('Project not found.');
    }

    return this.mapProject(data);
  }

  async create(createProjectDto: CreateProjectDto) {
    const { data, error } = await this.supabaseService.client
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
