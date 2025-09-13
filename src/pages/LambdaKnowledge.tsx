import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  GraduationCap, 
  BookOpen, 
  Video, 
  CheckCircle, 
  Clock, 
  Plus, 
  Brain,
  Trophy,
  Target,
  X,
  Check,
  Loader2
} from 'lucide-react';
import { useOptimizedAuth } from '@/hooks/useOptimizedAuth';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { createKnowledgeEntry, createQuiz, submitQuizAnswer } from '@/lib/dataHelpers';
import { useToast } from '@/hooks/use-toast';

export default function LambdaKnowledge() {
  const { user, profile } = useOptimizedAuth();
  
  // Fetch real-time data
  const { data: knowledgeEntries, loading: knowledgeLoading } = useRealtimeData('knowledge_entries');
  const { data: quizzes, loading: quizzesLoading } = useRealtimeData('quizzes');
  const { data: quizQuestions, loading: questionsLoading } = useRealtimeData('quiz_questions');
  const { data: quizSubmissions, loading: submissionsLoading } = useRealtimeData('quiz_submissions', user ? [['user_id', 'eq', user.id]] : null);
  
  const loading = knowledgeLoading || quizzesLoading || questionsLoading || submissionsLoading;
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [isQuizFormOpen, setIsQuizFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [canAddKnowledge, setCanAddKnowledge] = useState(false);
  const { toast } = useToast();

  const knowledgeCategories = [
    'History',
    'Policies',
    'How-To Guides',
    'Resources',
    'FAQs',
    'Leadership',
    'Community Service',
    'Events',
    'Training Materials'
  ];

  // Check user permissions
  useEffect(() => {
    if (profile) {
      setCanAddKnowledge(profile.can_approve_members || profile.is_super_admin);
    }
  }, [profile]);

  const handleAddKnowledge = () => {
    setIsFormDialogOpen(true);
  };

  const handleAddQuiz = () => {
    setIsQuizFormOpen(true);
  };

  const handleTakeQuiz = (quiz) => {
    // Get questions for this quiz
    const questionsForQuiz = quizQuestions?.filter(q => q.quiz_id === quiz.id) || [];
    
    setCurrentQuiz(quiz);
    setCurrentQuizQuestions(questionsForQuiz);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizCompleted(false);
    setQuizScore(0);
    setIsQuizDialogOpen(true);
  };

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < currentQuizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate score and complete quiz
      let correct = 0;
      currentQuizQuestions.forEach(question => {
        const userAnswer = userAnswers[question.id];
        if (userAnswer === question.correct_answer) {
          correct++;
        }
      });
      
      const score = Math.round((correct / currentQuizQuestions.length) * 100);
      setQuizScore(score);
      setQuizCompleted(true);
      
      // Save quiz submission to database
      if (user && currentQuiz) {
        try {
          await submitQuizAnswer(
            currentQuiz.id, 
            Object.values(userAnswers), 
            score, 
            currentQuizQuestions.length
          );
        } catch (error) {
          console.error('Error saving quiz submission:', error);
        }
      }
      
      toast({
        title: "Quiz Completed!",
        description: `You scored ${score}% on ${currentQuiz.title}`,
      });
    }
  };

  const handleSubmitKnowledge = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target);
      const title = formData.get('title') as string;
      const content = formData.get('content') as string;
      const category = formData.get('category') as string;

      await createKnowledgeEntry(title, content, category);

      toast({
        title: "Knowledge Article Created",
        description: `"${title}" has been successfully added to the knowledge base.`,
      });

      setIsFormDialogOpen(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating knowledge article:', error);
      toast({
        title: "Error",
        description: "Failed to create knowledge article. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitQuiz = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target);
      const title = formData.get('quiz_title') as string;
      const description = formData.get('quiz_description') as string;
      const category = formData.get('quiz_category') as string;
      
      // For now, create quiz without questions - questions can be added separately
      const questions = []; // TODO: Add question creation interface
      
      await createQuiz(title, description, category, questions);

      toast({
        title: "Quiz Created",
        description: `"${title}" has been successfully created.`,
      });

      setIsQuizFormOpen(false);
      e.target.reset();
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast({
        title: "Error",
        description: "Failed to create quiz. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = currentQuizQuestions[currentQuestionIndex];
  
  // Calculate user progress
  const completedQuizzes = quizzes?.filter(quiz => 
    quizSubmissions?.some(submission => submission.quiz_id === quiz.id)
  ) || [];
  
  const userSubmissions = quizSubmissions || [];
  const totalQuizzes = quizzes?.length || 0;
  const completedCount = completedQuizzes.length;
  const progressPercentage = totalQuizzes > 0 ? Math.round((completedCount / totalQuizzes) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading Lambda Knowledge...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GraduationCap className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Lambda Knowledge</h1>
              <p className="text-white/90 mt-1">Online Learning Management System</p>
            </div>
          </div>
          {canAddKnowledge && (
            <div className="flex gap-2">
              <Button 
                onClick={handleAddQuiz} 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Brain className="h-4 w-4 mr-2" />
                Add Quiz
              </Button>
              <Button 
                onClick={handleAddKnowledge} 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Knowledge
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Learning Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Progress</CardTitle>
          <CardDescription>Track your completion of required learning modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">{progressPercentage}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{knowledgeEntries?.length || 0}</div>
                <p className="text-sm text-gray-600">Knowledge Articles</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{totalQuizzes - completedCount}</div>
                <p className="text-sm text-gray-600">Available</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{userSubmissions.length}</div>
                <p className="text-sm text-gray-600">Quizzes Taken</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Quizzes */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Quizzes</CardTitle>
          <CardDescription>Test your understanding with interactive quizzes</CardDescription>
        </CardHeader>
        <CardContent>
          {!quizzes || quizzes.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Quizzes Available</h3>
              <p className="text-gray-500 mb-4">Check back later for new quizzes to test your knowledge.</p>
              {canAddKnowledge && (
                <Button onClick={handleAddQuiz}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Quiz
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {quizzes.map(quiz => {
                const submission = userSubmissions.find(sub => sub.quiz_id === quiz.id);
                const isCompleted = !!submission;
                const questionsCount = quizQuestions?.filter(q => q.quiz_id === quiz.id).length || 0;

                return (
                  <div key={quiz.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Brain className="h-5 w-5 text-blue-600" />
                        )}
                        <div>
                          <h3 className="font-semibold">{quiz.title}</h3>
                          <p className="text-sm text-gray-600">{quiz.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {isCompleted && submission && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            {Math.round((submission.score / submission.total_questions) * 100)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {questionsCount} questions
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {quiz.category}
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full" 
                      onClick={() => handleTakeQuiz(quiz)}
                      variant={isCompleted ? "outline" : "default"}
                      disabled={questionsCount === 0}
                    >
                      {questionsCount === 0 ? "No Questions Available" : 
                       isCompleted ? "Retake Quiz" : "Take Quiz"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Knowledge Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Articles</CardTitle>
          <CardDescription>Browse our collection of educational articles and resources</CardDescription>
        </CardHeader>
        <CardContent>
          {!knowledgeEntries || knowledgeEntries.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Knowledge Articles Yet</h3>
              <p className="text-gray-500 mb-4">Be the first to add valuable knowledge to our database.</p>
              {canAddKnowledge && (
                <Button onClick={handleAddKnowledge}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Article
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {knowledgeEntries.map(article => (
                <div key={article.id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold line-clamp-1">{article.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{article.content.substring(0, 100)}...</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {article.category}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Read Article
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Optional Learning</CardTitle>
            <CardDescription>Enhance your skills with additional content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Video className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-medium">Advanced Public Speaking</p>
                  <p className="text-sm text-gray-600">6 modules • 4 hours</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Explore</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium">Financial Management</p>
                  <p className="text-sm text-gray-600">8 readings • 2 hours</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Explore</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Video className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="font-medium">Conflict Resolution</p>
                  <p className="text-sm text-gray-600">4 modules • 3 hours</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Explore</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest learning achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Trophy className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Scored 85% on Leadership Quiz</p>
                <p className="text-sm text-gray-600">December 13, 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Completed Leadership Fundamentals</p>
                <p className="text-sm text-gray-600">December 12, 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Started Ethics in Leadership</p>
                <p className="text-sm text-gray-600">December 10, 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Knowledge Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Knowledge Article</DialogTitle>
            <DialogDescription>
              Create a new knowledge article for the Lambda Empire learning system.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitKnowledge} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title *</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="e.g., How to Conduct Effective Meetings"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {knowledgeCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Article Content *</Label>
              <Textarea 
                id="content" 
                name="content" 
                placeholder="Write the main content of your knowledge article here..."
                className="min-h-[200px]" 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty_level">Difficulty Level</Label>
                <Select name="difficulty_level">
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated_time">Estimated Reading Time</Label>
                <Input 
                  id="estimated_time" 
                  name="estimated_time" 
                  placeholder="e.g., 15 minutes"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input 
                id="tags" 
                name="tags" 
                placeholder="e.g., leadership, meetings, communication"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="is_required">Article Type</Label>
              <Select name="is_required">
                <SelectTrigger>
                  <SelectValue placeholder="Select article type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Optional Learning</SelectItem>
                  <SelectItem value="true">Required Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsFormDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Article"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Quiz Form Dialog */}
      <Dialog open={isQuizFormOpen} onOpenChange={setIsQuizFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Quiz</DialogTitle>
            <DialogDescription>
              Create a new quiz to test knowledge on Lambda Empire topics.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitQuiz} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quiz_title">Quiz Title *</Label>
                <Input 
                  id="quiz_title" 
                  name="quiz_title" 
                  placeholder="e.g., Leadership Fundamentals Quiz"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiz_category">Category *</Label>
                <Select name="quiz_category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {knowledgeCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quiz_description">Quiz Description *</Label>
              <Textarea 
                id="quiz_description" 
                name="quiz_description" 
                placeholder="Describe what this quiz covers..."
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time_limit">Time Limit (minutes)</Label>
                <Input 
                  id="time_limit" 
                  name="time_limit" 
                  type="number"
                  placeholder="15"
                  min="1"
                  max="120"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiz_difficulty">Difficulty Level</Label>
                <Select name="quiz_difficulty">
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiz_required">Quiz Type</Label>
                <Select name="quiz_required">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Optional</SelectItem>
                    <SelectItem value="true">Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsQuizFormOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Quiz"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Quiz Taking Dialog */}
      <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentQuiz?.title}</DialogTitle>
            <DialogDescription>
              {quizCompleted ? 
                `Quiz completed! Your score: ${quizScore}%` :
                `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`
              }
            </DialogDescription>
          </DialogHeader>
          
          {!quizCompleted && currentQuestion ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>
                
                <RadioGroup 
                  value={userAnswers[currentQuestion.id]?.toString() || ""} 
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, parseInt(value))}
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Progress: {currentQuestionIndex + 1} / {currentQuizQuestions.length}
                </div>
                <Button 
                  onClick={handleNextQuestion}
                  disabled={userAnswers[currentQuestion.id] === undefined}
                >
                  {currentQuestionIndex === currentQuizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Button>
              </div>
            </div>
          ) : quizCompleted && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                {quizScore >= 70 ? (
                  <Trophy className="h-16 w-16 text-yellow-500" />
                ) : (
                  <Target className="h-16 w-16 text-blue-500" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold">Quiz Complete!</h3>
                <p className="text-lg">Your Score: {quizScore}%</p>
                <p className="text-sm text-gray-600 mt-2">
                  {quizScore >= 70 ? 
                    "Congratulations! You passed the quiz." : 
                    "You can retake this quiz to improve your score."
                  }
                </p>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsQuizDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}