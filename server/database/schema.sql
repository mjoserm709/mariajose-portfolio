create extension if not exists "pgcrypto";

create schema if not exists portfolio;
create schema if not exists analytics;

create table if not exists portfolio.profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  title text,
  bio text,
  location text,
  email text,
  whatsapp text,
  github_url text,
  linkedin_url text,
  cv_url text,
  avatar_url text,
  updated_at timestamp default now()
);

create table if not exists portfolio.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  short_description text,
  description text,
  github_url text,
  demo_url text,
  status text default 'published',
  featured boolean default false,
  sort_order int default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists portfolio.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references portfolio.projects(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order int default 0,
  created_at timestamp default now()
);

create table if not exists portfolio.technologies (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  icon_url text,
  category text
);

create table if not exists portfolio.project_technologies (
  project_id uuid not null references portfolio.projects(id) on delete cascade,
  technology_id uuid not null references portfolio.technologies(id) on delete cascade,
  primary key (project_id, technology_id)
);

create table if not exists portfolio.experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  description text,
  start_date date,
  end_date date,
  current boolean default false,
  location text,
  sort_order int default 0,
  created_at timestamp default now()
);

create table if not exists portfolio.skills (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  category text,
  level int check (level between 1 and 5),
  sort_order int default 0
);

create table if not exists portfolio.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text not null,
  source text default 'portfolio',
  is_read boolean default false,
  created_at timestamp default now()
);

create table if not exists analytics.events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  page text,
  project_id uuid references portfolio.projects(id) on delete set null,
  target_url text,
  referrer text,
  user_agent text,
  created_at timestamp default now()
);

create index if not exists idx_projects_slug on portfolio.projects(slug);
create index if not exists idx_projects_featured on portfolio.projects(featured);
create index if not exists idx_project_images_project_id on portfolio.project_images(project_id);
create index if not exists idx_experience_sort_order on portfolio.experience(sort_order);
create index if not exists idx_skills_category on portfolio.skills(category);
create index if not exists idx_analytics_event_type on analytics.events(event_type);
create index if not exists idx_analytics_created_at on analytics.events(created_at);

create or replace function portfolio.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profile_updated_at on portfolio.profile;
create trigger trg_profile_updated_at
before update on portfolio.profile
for each row
execute function portfolio.set_updated_at();

drop trigger if exists trg_projects_updated_at on portfolio.projects;
create trigger trg_projects_updated_at
before update on portfolio.projects
for each row
execute function portfolio.set_updated_at();
