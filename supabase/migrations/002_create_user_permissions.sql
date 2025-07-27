-- Create user permissions system
create table public.user_permissions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    permission_type text not null,
    granted_by uuid references auth.users(id),
    granted_at timestamp with time zone default now(),
    unique (user_id, permission_type)
);

-- Enable RLS
alter table public.user_permissions enable row level security;

-- Create policies
create policy "Users can view their own permissions"
on public.user_permissions
for select
to authenticated
using (user_id = auth.uid());

create policy "Admins can manage all permissions"
on public.user_permissions
for all
to authenticated
using (
    exists (
        select 1 from public.user_permissions 
        where user_id = auth.uid() 
        and permission_type = 'admin'
    )
);

-- Create function to check permissions
create or replace function public.has_permission(_user_id uuid, _permission text)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1
    from public.user_permissions
    where user_id = _user_id
      and permission_type = _permission
  )
$$;

-- Insert some sample permissions (you can modify these as needed)
-- Note: Replace these UUIDs with actual user IDs from your auth.users table
-- insert into public.user_permissions (user_id, permission_type) values 
-- ('your-user-id-here', 'add_knowledge'),
-- ('your-user-id-here', 'admin');