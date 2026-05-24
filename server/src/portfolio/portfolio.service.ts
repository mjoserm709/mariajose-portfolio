import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PortfolioService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getProfile() {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('profile')
      .select(
        'id, full_name, title, bio, location, email, whatsapp, github_url, linkedin_url, cv_url, avatar_url, updated_at',
      )
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      fullName: data.full_name,
      title: data.title,
      bio: data.bio,
      location: data.location,
      email: data.email,
      whatsapp: data.whatsapp,
      githubUrl: data.github_url,
      linkedinUrl: data.linkedin_url,
      cvUrl: data.cv_url,
      avatarUrl: data.avatar_url,
      updatedAt: data.updated_at,
    };
  }

  async getExperience() {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('experience')
      .select('id, company, role, description, start_date, end_date, current, location, sort_order')
      .order('sort_order', { ascending: true })
      .order('start_date', { ascending: false });

    if (error) {
      throw error;
    }

    return (
      data?.map((experience) => ({
        id: experience.id,
        company: experience.company,
        role: experience.role,
        description: experience.description,
        startDate: experience.start_date,
        endDate: experience.end_date,
        current: experience.current,
        location: experience.location,
        sortOrder: experience.sort_order,
      })) ?? []
    );
  }

  async getSkills() {
    const { data, error } = await this.supabaseService.adminClient
      .schema('portfolio')
      .from('skills')
      .select('id, name, category, level, sort_order')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return (
      data?.map((skill) => ({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        level: skill.level,
        sortOrder: skill.sort_order,
      })) ?? []
    );
  }
}
