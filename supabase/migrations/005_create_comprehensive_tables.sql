-- Lambda Knowledge Table
CREATE TABLE IF NOT EXISTS public.knowledge_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz System Tables
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer INTEGER NOT NULL,
    points INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quiz_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    answers JSONB,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME,
    location TEXT,
    price DECIMAL(10,2) DEFAULT 0,
    capacity INTEGER,
    category TEXT NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Registrations Table
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Communications Log Table
CREATE TABLE IF NOT EXISTS public.communications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL, -- 'email', 'sms', 'push'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    recipients TEXT[] NOT NULL,
    sent_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fundraising Campaigns Table
CREATE TABLE IF NOT EXISTS public.fundraising_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    goal_amount DECIMAL(10,2) NOT NULL,
    current_amount DECIMAL(10,2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'active',
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fundraising Donations Table
CREATE TABLE IF NOT EXISTS public.fundraising_donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES public.fundraising_campaigns(id) ON DELETE CASCADE,
    donor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    donor_name TEXT, -- For anonymous or external donors
    amount DECIMAL(10,2) NOT NULL,
    message TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    donated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Point System Tables
CREATE TABLE IF NOT EXISTS public.point_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    activity_name TEXT NOT NULL,
    points_value INTEGER NOT NULL,
    category TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.member_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES public.point_activities(id) ON DELETE CASCADE,
    points_earned INTEGER NOT NULL,
    notes TEXT,
    awarded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Status Requests Table
CREATE TABLE IF NOT EXISTS public.status_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    current_status TEXT NOT NULL,
    requested_status TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, denied
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Dues Management Tables
CREATE TABLE IF NOT EXISTS public.dues_periods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.member_dues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    dues_period_id UUID REFERENCES public.dues_periods(id) ON DELETE CASCADE,
    amount_due DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'pending', -- pending, paid, overdue
    payment_method TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, dues_period_id)
);

-- Fines Table
CREATE TABLE IF NOT EXISTS public.member_fines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, paid, waived
    issued_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL, -- success, warning, error, info
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification Preferences Table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT TRUE,
    event_reminders BOOLEAN DEFAULT TRUE,
    dues_reminders BOOLEAN DEFAULT TRUE,
    system_updates BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Payment System Configuration
CREATE TABLE IF NOT EXISTS public.payment_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    square_application_id TEXT,
    square_location_id TEXT,
    square_environment TEXT DEFAULT 'sandbox',
    is_active BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page Visibility Settings
CREATE TABLE IF NOT EXISTS public.page_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_name TEXT UNIQUE NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for all tables
ALTER TABLE public.knowledge_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fundraising_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fundraising_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dues_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_dues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_fines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for knowledge entries
CREATE POLICY "Anyone can view knowledge entries" ON public.knowledge_entries FOR SELECT USING (true);
CREATE POLICY "Approved members can create knowledge entries" ON public.knowledge_entries 
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (can_approve_members = true OR is_super_admin = true))
    );
CREATE POLICY "Authors and admins can update knowledge entries" ON public.knowledge_entries 
    FOR UPDATE USING (
        author_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (can_approve_members = true OR is_super_admin = true))
    );
CREATE POLICY "Authors and admins can delete knowledge entries" ON public.knowledge_entries 
    FOR DELETE USING (
        author_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (can_approve_members = true OR is_super_admin = true))
    );

-- Create policies for quizzes
CREATE POLICY "Anyone can view active quizzes" ON public.quizzes FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage quizzes" ON public.quizzes FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (can_approve_members = true OR is_super_admin = true))
);

-- Create policies for quiz questions
CREATE POLICY "Anyone can view quiz questions" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Admins can manage quiz questions" ON public.quiz_questions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (can_approve_members = true OR is_super_admin = true))
);

-- Create policies for quiz submissions
CREATE POLICY "Users can view own submissions" ON public.quiz_submissions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own submissions" ON public.quiz_submissions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all submissions" ON public.quiz_submissions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (can_approve_members = true OR is_super_admin = true))
);

-- Create policies for events
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON public.events FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (can_approve_members = true OR is_super_admin = true))
);

-- Create policies for event registrations
CREATE POLICY "Users can view own registrations" ON public.event_registrations FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can register for events" ON public.event_registrations FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can cancel own registrations" ON public.event_registrations FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "Admins can view all registrations" ON public.event_registrations FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (can_approve_members = true OR is_super_admin = true))
);

-- Create policies for communications
CREATE POLICY "Admins can manage communications" ON public.communications FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (can_approve_members = true OR is_super_admin = true))
);

-- Create policies for fundraising
CREATE POLICY "Anyone can view fundraising campaigns" ON public.fundraising_campaigns FOR SELECT USING (true);
CREATE POLICY "Admins can manage fundraising campaigns" ON public.fundraising_campaigns FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (can_approve_members = true OR is_super_admin = true))
);

CREATE POLICY "Users can view donations" ON public.fundraising_donations FOR SELECT USING (
    is_anonymous = false OR donor_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (can_approve_members = true OR is_super_admin = true))
);
CREATE POLICY "Users can create donations" ON public.fundraising_donations FOR INSERT WITH CHECK (true);

-- Create policies for point system
CREATE POLICY "Anyone can view point activities" ON public.point_activities FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage point activities" ON public.point_activities FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (can_approve_members = true OR is_super_admin = true))
);

CREATE POLICY "Users can view own points" ON public.member_points FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage member points" ON public.member_points FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (can_approve_members = true OR is_super_admin = true))
);

-- Create policies for status requests
CREATE POLICY "Users can view own status requests" ON public.status_requests FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create status requests" ON public.status_requests FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view and manage status requests" ON public.status_requests FOR ALL USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (can_approve_members = true OR is_super_admin = true))
);

-- Create policies for dues and fines
CREATE POLICY "Users can view own dues" ON public.member_dues FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage dues" ON public.member_dues FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (can_approve_members = true OR is_super_admin = true))
);

CREATE POLICY "Anyone can view dues periods" ON public.dues_periods FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage dues periods" ON public.dues_periods FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (can_approve_members = true OR is_super_admin = true))
);

CREATE POLICY "Users can view own fines" ON public.member_fines FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage fines" ON public.member_fines FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (can_approve_members = true OR is_super_admin = true))
);

-- Create policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can manage own notification preferences" ON public.notification_preferences FOR ALL USING (user_id = auth.uid());

-- Create policies for admin settings
CREATE POLICY "Admins can manage payment config" ON public.payment_config FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (can_approve_members = true OR is_super_admin = true))
);

CREATE POLICY "Anyone can view page settings" ON public.page_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage page settings" ON public.page_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (can_approve_members = true OR is_super_admin = true))
);

-- Insert default page settings
INSERT INTO public.page_settings (page_name, is_visible) VALUES 
('empire_house', true),
('member_directory', true),
('lambda_knowledge', true),
('events', true),
('fundraising', true),
('communications', true)
ON CONFLICT (page_name) DO NOTHING;

-- Create update triggers for updated_at columns
CREATE TRIGGER update_knowledge_entries_updated_at
    BEFORE UPDATE ON public.knowledge_entries
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
    BEFORE UPDATE ON public.quizzes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fundraising_campaigns_updated_at
    BEFORE UPDATE ON public.fundraising_campaigns
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
    BEFORE UPDATE ON public.notification_preferences
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_config_updated_at
    BEFORE UPDATE ON public.payment_config
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_settings_updated_at
    BEFORE UPDATE ON public.page_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();