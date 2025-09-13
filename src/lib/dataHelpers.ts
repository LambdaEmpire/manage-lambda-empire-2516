import { supabase } from './supabase';

// Knowledge Management
export const createKnowledgeEntry = async (title: string, content: string, category: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('knowledge_entries')
    .insert({
      title,
      content,
      category,
      author_id: user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Quiz Management
export const createQuiz = async (title: string, description: string, category: string, questions: any[]) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Create quiz
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .insert({
      title,
      description,
      category,
      author_id: user.id
    })
    .select()
    .single();

  if (quizError) throw quizError;

  // Create questions
  const questionsData = questions.map(q => ({
    quiz_id: quiz.id,
    question: q.question,
    options: q.options,
    correct_answer: q.correctAnswer,
    points: q.points || 1
  }));

  const { error: questionsError } = await supabase
    .from('quiz_questions')
    .insert(questionsData);

  if (questionsError) throw questionsError;

  return quiz;
};

export const submitQuizAnswer = async (quizId: string, answers: any[], score: number, totalQuestions: number) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('quiz_submissions')
    .insert({
      quiz_id: quizId,
      user_id: user.id,
      score,
      total_questions: totalQuestions,
      answers
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Event Management
export const createEvent = async (eventData: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('events')
    .insert({
      ...eventData,
      created_by: user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const registerForEvent = async (eventId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('event_registrations')
    .insert({
      event_id: eventId,
      user_id: user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Communications
export const logCommunication = async (type: string, title: string, message: string, recipients: string[]) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('communications')
    .insert({
      type,
      title,
      message,
      recipients,
      sent_by: user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Fundraising
export const createFundraisingCampaign = async (campaignData: any) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('fundraising_campaigns')
    .insert({
      ...campaignData,
      created_by: user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const makeDonation = async (campaignId: string, amount: number, donorName?: string, message?: string, isAnonymous = false) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const donationData: any = {
    campaign_id: campaignId,
    amount,
    is_anonymous: isAnonymous,
    message
  };

  if (user && !isAnonymous) {
    donationData.donor_id = user.id;
  } else if (donorName) {
    donationData.donor_name = donorName;
  }

  const { data, error } = await supabase
    .from('fundraising_donations')
    .insert(donationData)
    .select()
    .single();

  if (error) throw error;

  // Update campaign total
  const { error: updateError } = await supabase.rpc('update_campaign_total', {
    campaign_id: campaignId,
    donation_amount: amount
  });

  if (updateError) console.error('Error updating campaign total:', updateError);

  return data;
};

// Point System
export const awardPoints = async (userId: string, activityId: string, notes?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get activity points value
  const { data: activity, error: activityError } = await supabase
    .from('point_activities')
    .select('points_value')
    .eq('id', activityId)
    .single();

  if (activityError) throw activityError;

  const { data, error } = await supabase
    .from('member_points')
    .insert({
      user_id: userId,
      activity_id: activityId,
      points_earned: activity.points_value,
      notes,
      awarded_by: user.id
    })
    .select()
    .single();

  if (error) throw error;

  // Update user's total points
  await updateUserPointsTotal(userId);

  return data;
};

export const updateUserPointsTotal = async (userId: string) => {
  const { data: points, error } = await supabase
    .from('member_points')
    .select('points_earned')
    .eq('user_id', userId);

  if (error) throw error;

  const totalPoints = points.reduce((sum, point) => sum + point.points_earned, 0);

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ points_total: totalPoints })
    .eq('id', userId);

  if (updateError) throw updateError;

  return totalPoints;
};

// Status Management
export const createStatusRequest = async (requestedStatus: string, reason?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get current user status
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single();

  if (profileError) throw profileError;

  const { data, error } = await supabase
    .from('status_requests')
    .insert({
      user_id: user.id,
      current_status: profile.status,
      requested_status: requestedStatus,
      reason
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const reviewStatusRequest = async (requestId: string, approved: boolean) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const status = approved ? 'approved' : 'denied';

  const { data, error } = await supabase
    .from('status_requests')
    .update({
      status,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .select()
    .single();

  if (error) throw error;

  // If approved, update the user's actual status
  if (approved) {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ status: data.requested_status })
      .eq('id', data.user_id);

    if (updateError) throw updateError;
  }

  return data;
};

// Dues Management
export const createDuesPeriod = async (name: string, amount: number, dueDate: string, description?: string) => {
  const { data, error } = await supabase
    .from('dues_periods')
    .insert({
      name,
      amount,
      due_date: dueDate,
      description
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const assignDuesToMember = async (userId: string, duesPeriodId: string, customAmount?: number) => {
  // Get dues period details
  const { data: duesPeriod, error: periodError } = await supabase
    .from('dues_periods')
    .select('amount')
    .eq('id', duesPeriodId)
    .single();

  if (periodError) throw periodError;

  const { data, error } = await supabase
    .from('member_dues')
    .insert({
      user_id: userId,
      dues_period_id: duesPeriodId,
      amount_due: customAmount || duesPeriod.amount
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Notification Management
export const createNotification = async (userId: string, title: string, message: string, type: string = 'info') => {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title,
      message,
      type
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Page Settings
export const updatePageVisibility = async (pageName: string, isVisible: boolean) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('page_settings')
    .upsert({
      page_name: pageName,
      is_visible: isVisible,
      updated_by: user.id
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};