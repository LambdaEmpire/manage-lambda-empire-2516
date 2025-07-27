import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, BookOpen, Video, CheckCircle, Clock } from 'lucide-react';

export default function LambdaKnowledge() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-xl text-white">
        <div className="flex items-center gap-4">
          <GraduationCap className="h-12 w-12" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Lambda Knowledge</h1>
            <p className="text-white/90 mt-1">Online Learning Management System</p>
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
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
            </div>
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
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <GraduationCap className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium">Earned Leadership Certificate</p>
                <p className="text-sm text-gray-600">December 8, 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}