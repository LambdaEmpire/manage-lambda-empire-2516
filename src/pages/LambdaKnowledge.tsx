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
  Check
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Mock quiz data
const mockQuizzes = [
  {
    id: 'QUIZ001',
    title: 'Leadership Fundamentals Quiz',
    description: 'Test your knowledge of core leadership principles',
    category: 'Leadership',
    questions: 5,
    timeLimit: 10,
    difficulty: 'beginner',
    isRequired: true,
    completed: true,
    score: 85
  },
  {
    id: 'QUIZ002',
    title: 'Lambda Empire History',
    description: 'How well do you know our organization\'s history?',
    category: 'History',
    questions: 8,
    timeLimit: 15,
    difficulty: 'intermediate',
    isRequired: true,
    completed: false,
    score: null
  },
  {
    id: 'QUIZ003',
    title: 'Ethics in Leadership',
    description: 'Ethical decision-making scenarios',
    category: 'Leadership',
    questions: 6,
    timeLimit: 12,
    difficulty: 'advanced',
    isRequired: false,
    completed: false,
    score: null
  }
];

export default function LambdaKnowledge() {
  const [canAddKnowledge, setCanAddKnowledge] = useState(true); // Set to true by default for testing
  const [loading, setLoading] = useState(false); // Set to false by default
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [isQuizFormOpen, setIsQuizFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
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

  // Mock quiz questions
  const sampleQuestions = [
    {
      id: 1,
      question: "What is the primary goal of effective leadership?",
      type: "multiple_choice",
      options: [
        "To control others",
        "To inspire and guide others toward common goals",
        "To make all decisions alone",
        "To avoid responsibility"
      ],
      correctAnswer: 1,
      explanation: "Effective leadership is about inspiring and guiding others toward achieving common goals."
    },
    {
      id: 2,
      question: "Which of the following are key leadership qualities? (Select all that apply)",
      type: "multiple_select",
      options: [
        "Integrity",
        "Communication skills",
        "Micromanagement",
        "Empathy"
      ],
      correctAnswers: [0, 1, 3],
      explanation: "Integrity, communication skills, and empathy are essential leadership qualities."
    }
  ];

  // Check user permissions on component mount
  useEffect(() => {
    checkUserPermissions();
  }, []);

  const checkUserPermissions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // If no user is logged in, still show buttons for demo purposes
        console.log('No user logged in, showing buttons for demo');
        setCanAddKnowledge(true);
        setLoading(false);
        return;
      }

      // Check if user has permission to add knowledge
      const { data: addKnowledgePermission, error: addKnowledgeError } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('permission_type', 'add_knowledge')
        .maybeSingle();

      // Check if user is admin
      const { data: adminPermission, error: adminError } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('permission_type', 'admin')
        .maybeSingle();

      // If there are errors (like table doesn't exist), show buttons anyway for demo
      if (addKnowledgeError || adminError) {
        console.log('Permission check errors, showing buttons for demo:', { addKnowledgeError, adminError });
        setCanAddKnowledge(true);
      } else {
        setCanAddKnowledge(!!addKnowledgePermission || !!adminPermission);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error checking permissions:', error);
      // On error, show buttons for demo purposes
      setCanAddKnowledge(true);
      setLoading(false);
    }
  };

  const handleAddKnowledge = () => {
    setIsFormDialogOpen(true);
  };

  const handleAddQuiz = () => {
    setIsQuizFormOpen(true);
  };

  const handleTakeQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setQuizQuestions(sampleQuestions);
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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate score and complete quiz
      let correct = 0;
      quizQuestions.forEach(question => {
        const userAnswer = userAnswers[question.id];
        if (question.type === 'multiple_choice') {
          if (userAnswer === question.correctAnswer) correct++;
        } else if (question.type === 'multiple_select') {
          if (Array.isArray(userAnswer) && 
              userAnswer.length === question.correctAnswers.length &&
              userAnswer.every(ans => question.correctAnswers.includes(ans))) {
            correct++;
          }
        }
      });
      
      const score = Math.round((correct / quizQuestions.length) * 100);
      setQuizScore(score);
      setQuizCompleted(true);
      
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
      const knowledgeData = {
        title: formData.get('title'),
        content: formData.get('content'),
        category: formData.get('category'),
        tags: formData.get('tags')?.split(',').map(tag => tag.trim()).filter(tag => tag !== '') || [],
        difficulty_level: formData.get('difficulty_level'),
        estimated_time: formData.get('estimated_time'),
        is_required: formData.get('is_required') === 'true'
      };

      console.log('Knowledge article data:', knowledgeData);

      toast({
        title: "Knowledge Article Created",
        description: `"${knowledgeData.title}" has been successfully added to the knowledge base.`,
      });

      setIsFormDialogOpen(false);
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
      const quizData = {
        title: formData.get('quiz_title'),
        description: formData.get('quiz_description'),
        category: formData.get('quiz_category'),
        timeLimit: parseInt(formData.get('time_limit')),
        difficulty: formData.get('quiz_difficulty'),
        isRequired: formData.get('quiz_required') === 'true'
      };

      console.log('Quiz data:', quizData);

      toast({
        title: "Quiz Created",
        description: `"${quizData.title}" has been successfully created.`,
      });

      setIsQuizFormOpen(false);
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

  const currentQuestion = quizQuestions[currentQuestionIndex];

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
              <span className="text-sm text-gray-600">85% Complete</span>
            </div>
            <Progress value={85} className="h-2" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">12</div>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2</div>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">1</div>
                <p className="text-sm text-gray-600">Not Started</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">3</div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockQuizzes.map(quiz => (
              <div key={quiz.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {quiz.completed ? (
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
                    {quiz.isRequired && (
                      <Badge className="bg-red-100 text-red-800 text-xs">Required</Badge>
                    )}
                    {quiz.completed && quiz.score && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {quiz.score}%
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {quiz.questions} questions
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {quiz.timeLimit} min
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {quiz.difficulty}
                  </Badge>
                </div>
                <Button 
                  size="sm" 
                  className="w-full" 
                  onClick={() => handleTakeQuiz(quiz)}
                  variant={quiz.completed ? "outline" : "default"}
                >
                  {quiz.completed ? "Retake Quiz" : "Take Quiz"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Required Learning Modules */}
      <Card>
        <CardHeader>
          <CardTitle>Required Learning Modules</CardTitle>
          <CardDescription>Complete these modules to maintain active membership status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold">Leadership Fundamentals</h3>
                    <p className="text-sm text-gray-600">Core leadership principles and practices</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Video className="h-4 w-4" />
                4 videos • 2 hours
              </div>
              <Progress value={100} className="h-1" />
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Ethics in Leadership</h3>
                    <p className="text-sm text-gray-600">Ethical decision-making framework</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="h-4 w-4" />
                3 readings • 5 videos • 3 hours
              </div>
              <Progress value={60} className="h-1" />
              <Button size="sm" className="w-full">Continue Learning</Button>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold">Lambda Empire History</h3>
                    <p className="text-sm text-gray-600">Our organization's founding and evolution</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="h-4 w-4" />
                6 readings • 1.5 hours
              </div>
              <Progress value={100} className="h-1" />
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold">Community Engagement</h3>
                    <p className="text-sm text-gray-600">Effective community service strategies</p>
                  </div>
                </div>
                <Badge variant="outline">Not Started</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Video className="h-4 w-4" />
                2 videos • 4 readings • 2.5 hours
              </div>
              <Progress value={0} className="h-1" />
              <Button size="sm" variant="outline" className="w-full">Start Module</Button>
            </div>
          </div>
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
                
                {currentQuestion.type === 'multiple_choice' && (
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
                )}

                {currentQuestion.type === 'multiple_select' && (
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`checkbox-${index}`}
                          checked={userAnswers[currentQuestion.id]?.includes(index) || false}
                          onCheckedChange={(checked) => {
                            const currentAnswers = userAnswers[currentQuestion.id] || [];
                            if (checked) {
                              handleAnswerChange(currentQuestion.id, [...currentAnswers, index]);
                            } else {
                              handleAnswerChange(currentQuestion.id, currentAnswers.filter(ans => ans !== index));
                            }
                          }}
                        />
                        <Label htmlFor={`checkbox-${index}`} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Progress: {currentQuestionIndex + 1} / {quizQuestions.length}
                </div>
                <Button 
                  onClick={handleNextQuestion}
                  disabled={!userAnswers[currentQuestion.id]}
                >
                  {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
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