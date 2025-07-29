-- Enable Row-Level Security on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow authenticated users to select their own profile
CREATE POLICY "Allow authenticated users to select their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);