-- Add RLS policy to public.profiles table
create policy "Allow authenticated users to select their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);