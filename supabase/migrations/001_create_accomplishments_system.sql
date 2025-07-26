-- Create accomplishment types table
create table public.accomplishment_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon_name text not null, -- Lucide icon name
  icon_color text default '#3B82F6', -- Hex color for the icon
  category text default 'general', -- academic, leadership, service, etc.
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create member accomplishments table (junction table)
create table public.member_accomplishments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references auth.users(id) on delete cascade not null,
  accomplishment_type_id uuid references public.accomplishment_types(id) on delete cascade not null,
  awarded_by uuid references auth.users(id) not null, -- Who awarded this
  awarded_at timestamp with time zone default now(),
  notes text, -- Optional notes about the accomplishment
  unique(member_id, accomplishment_type_id) -- Prevent duplicate accomplishments
);

-- Enable RLS
alter table public.accomplishment_types enable row level security;
alter table public.member_accomplishments enable row level security;

-- Create user roles enum and table if not exists
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('admin', 'national_admin', 'member');
  end if;
end
$$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Add city, state, can_approve_members, and visibility_settings to profiles table
alter table public.profiles
add column if not exists city text,
add column if not exists state text,
add column if not exists can_approve_members boolean default false,
add column if not exists visibility_settings jsonb default '{}';

-- Create security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- RLS Policies for accomplishment_types
create policy "Everyone can view active accomplishment types"
on public.accomplishment_types
for select
using (is_active = true);

create policy "National admins can manage accomplishment types"
on public.accomplishment_types
for all
using (public.has_role(auth.uid(), 'national_admin'));

-- RLS Policies for member_accomplishments
create policy "Everyone can view member accomplishments"
on public.member_accomplishments
for select
using (true);

create policy "National admins can award accomplishments"
on public.member_accomplishments
for insert
with check (public.has_role(auth.uid(), 'national_admin'));

create policy "National admins can update accomplishments"
on public.member_accomplishments
for update
using (public.has_role(auth.uid(), 'national_admin'));

create policy "National admins can delete accomplishments"
on public.member_accomplishments
for delete
using (public.has_role(auth.uid(), 'national_admin'));

-- RLS Policies for user_roles
create policy "Users can view their own roles"
on public.user_roles
for select
using (user_id = auth.uid());

create policy "National admins can manage all roles"
on public.user_roles
for all
using (public.has_role(auth.uid(), 'national_admin'));

-- Insert some default accomplishment types
insert into public.accomplishment_types (name, description, icon_name, icon_color, category) values
('Academic Excellence', 'Outstanding academic performance', 'GraduationCap', '#10B981', 'academic'),
('Leadership Award', 'Demonstrated exceptional leadership skills', 'Crown', '#F59E0B', 'leadership'),
('Community Service', 'Significant contribution to community service', 'Heart', '#EF4444', 'service'),
('Innovation Award', 'Creative problem solving and innovation', 'Lightbulb', '#8B5CF6', 'innovation'),
('Teamwork Excellence', 'Outstanding collaboration and teamwork', 'Users', '#06B6D4', 'teamwork'),
('Mentorship Award', 'Excellence in mentoring other members', 'UserCheck', '#84CC16', 'mentorship');