-- Add missing fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active',
ADD COLUMN IF NOT EXISTS org_affiliation TEXT DEFAULT 'Lambda Xi Eta Sorority, Inc.',
ADD COLUMN IF NOT EXISTS is_invisible BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS points_total INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS chapter TEXT,
ADD COLUMN IF NOT EXISTS line_name TEXT,
ADD COLUMN IF NOT EXISTS line_number INTEGER,
ADD COLUMN IF NOT EXISTS crossing_semester TEXT,
ADD COLUMN IF NOT EXISTS crossing_year INTEGER,
ADD COLUMN IF NOT EXISTS big_sibling TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_relationship TEXT;

-- Update visibility_settings to include new fields
UPDATE public.profiles 
SET visibility_settings = jsonb_set(
    visibility_settings,
    '{email}',
    'false'
) WHERE NOT visibility_settings ? 'email';

UPDATE public.profiles 
SET visibility_settings = jsonb_set(
    visibility_settings,
    '{status}',
    'true'
) WHERE NOT visibility_settings ? 'status';

UPDATE public.profiles 
SET visibility_settings = jsonb_set(
    visibility_settings,
    '{org_affiliation}',
    'true'
) WHERE NOT visibility_settings ? 'org_affiliation';

UPDATE public.profiles 
SET visibility_settings = jsonb_set(
    visibility_settings,
    '{chapter}',
    'true'
) WHERE NOT visibility_settings ? 'chapter';

UPDATE public.profiles 
SET visibility_settings = jsonb_set(
    visibility_settings,
    '{line_name}',
    'false'
) WHERE NOT visibility_settings ? 'line_name';

UPDATE public.profiles 
SET visibility_settings = jsonb_set(
    visibility_settings,
    '{crossing_info}',
    'true'
) WHERE NOT visibility_settings ? 'crossing_info';

-- Update the handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        first_name,
        last_name,
        phone,
        organization,
        org_affiliation,
        can_approve_members,
        is_super_admin
    )
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'phone',
        COALESCE(NEW.raw_user_meta_data->>'organization', 'Lambda Empire'),
        COALESCE(NEW.raw_user_meta_data->>'org_affiliation', 'Lambda Xi Eta Sorority, Inc.'),
        COALESCE((NEW.raw_user_meta_data->>'can_approve_members')::boolean, false),
        COALESCE((NEW.raw_user_meta_data->>'is_super_admin')::boolean, false)
    );
    
    -- Create default notification preferences
    INSERT INTO public.notification_preferences (user_id) VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add some default point activities
INSERT INTO public.point_activities (activity_name, points_value, category) VALUES
('Attending Chapter Meeting', 10, 'Meeting Attendance'),
('Community Service Hours', 5, 'Service'),
('Fundraising Event Participation', 15, 'Fundraising'),
('Study Hours', 2, 'Academic'),
('Mentoring New Members', 20, 'Leadership'),
('Event Planning Committee', 25, 'Leadership'),
('Social Media Promotion', 5, 'Marketing'),
('Recruitment Activity', 15, 'Recruitment')
ON CONFLICT DO NOTHING;

-- Add some default dues periods
INSERT INTO public.dues_periods (name, amount, due_date, description) VALUES
('Fall 2024 Semester Dues', 150.00, '2024-09-15', 'Semester dues for Fall 2024'),
('Spring 2025 Semester Dues', 150.00, '2025-01-15', 'Semester dues for Spring 2025'),
('Annual Membership Fee', 50.00, '2024-12-31', 'Annual national membership fee')
ON CONFLICT DO NOTHING;