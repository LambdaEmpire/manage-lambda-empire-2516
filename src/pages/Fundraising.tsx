import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Target, TrendingUp, Heart } from 'lucide-react';

export default function Fundraising() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl text-white">
        <div className="flex items-center gap-4">
          <DollarSign className="h-12 w-12" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Fundraising</h1>
            <p className="text-white/90 mt-1">Campaign management for fundraisers and scholarships</p>
          </div>
        </div>
      </div>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>Current fundraising initiatives and their progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">Annual Scholarship Fund</h3>
                <p className="text-gray-600 mt-1">Supporting educational opportunities for deserving students</p>
              </div>
              <Badge className="bg-lambda-gold text-white">Featured</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>$47,500 of $75,000</span>
              </div>
              <Progress value={63} className="h-3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">156</div>
                <p className="text-sm text-gray-600">Contributors</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">$305</div>
                <p className="text-sm text-gray-600">Avg. Donation</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">23</div>
                <p className="text-sm text-gray-600">Days Left</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="bg-lambda-purple hover:bg-lambda-purple/90">
                <Heart className="h-4 w-4 mr-2" />
                Donate Now
              </Button>
              <Button variant="outline">Share Campaign</Button>
            </div>
          </div>

          <div className="border rounded-lg p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">Community Center Renovation</h3>
                <p className="text-gray-600 mt-1">Upgrading facilities to better serve our community</p>
              </div>
              <Badge variant="outline">Ongoing</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>$23,750 of $50,000</span>
              </div>
              <Progress value={48} className="h-3" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">89</div>
                <p className="text-sm text-gray-600">Contributors</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">$267</div>
                <p className="text-sm text-gray-600">Avg. Donation</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">45</div>
                <p className="text-sm text-gray-600">Days Left</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="bg-lambda-gold hover:bg-lambda-gold/90">
                <Heart className="h-4 w-4 mr-2" />
                Donate Now
              </Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fundraising Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Raised (2024)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$234,750</div>
            <p className="text-xs text-muted-foreground">+18% from 2023</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">5</div>
            <p className="text-xs text-muted-foreground">2 ending soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Contributors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">1,247</div>
            <p className="text-xs text-muted-foreground">Unique donors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scholarships Awarded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">28</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Donations & Scholarship Recipients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
            <CardDescription>Latest contributions to our campaigns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium">Anonymous Donor</p>
                <p className="text-sm text-gray-600">Scholarship Fund • 2 hours ago</p>
              </div>
              <Badge className="bg-green-100 text-green-800">$500</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium">Marcus Johnson</p>
                <p className="text-sm text-gray-600">Community Center • 5 hours ago</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">$250</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium">Sarah Thompson</p>
                <p className="text-sm text-gray-600">Scholarship Fund • 1 day ago</p>
              </div>
              <Badge className="bg-purple-100 text-purple-800">$100</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Scholarship Recipients</CardTitle>
            <CardDescription>Students supported by our fundraising efforts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Maria Rodriguez</p>
                <p className="text-sm text-gray-600">Pre-Med • State University</p>
              </div>
              <Badge>$2,500</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">James Wilson</p>
                <p className="text-sm text-gray-600">Engineering • Tech Institute</p>
              </div>
              <Badge>$3,000</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Ashley Davis</p>
                <p className="text-sm text-gray-600">Education • Community College</p>
              </div>
              <Badge>$1,500</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Historical fundraising data and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">$89,450</div>
              <p className="text-sm text-gray-600">Q4 2024 Total</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">94%</div>
              <p className="text-sm text-gray-600">Goal Achievement</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <Heart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">456</div>
              <p className="text-sm text-gray-600">New Donors</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}