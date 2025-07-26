import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TreePine, Users, Crown, Star, Plus, Edit, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function EmpireHouse() {
  const [expandedSections, setExpandedSections] = useState({
    national: true,
    regional: true,
    chapter: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-lambda-purple to-indigo-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <TreePine className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">The Empire House</h1>
              <p className="text-white/90 mt-1">Lambda Empire Organizational Structure</p>
            </div>
          </div>
          <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Plus className="h-4 w-4 mr-2" />
            Add Position
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Family Tree</CardTitle>
          <CardDescription>Hierarchical structure of Lambda Empire membership with expandable roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* National Level */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('national')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-lambda-gold to-yellow-500 text-white px-6 py-3 rounded-full font-bold text-lg hover:from-lambda-gold/90 hover:to-yellow-500/90"
                >
                  {expandedSections.national ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  <Crown className="h-5 w-5" />
                  National Leadership
                </Button>
                <Button size="sm" variant="outline" className="ml-2">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Role
                </Button>
              </div>
              
              {expandedSections.national && (
                <div className="space-y-4">
                  {/* Executive Positions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200 relative group">
                      <Button size="sm" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <h3 className="font-semibold">National President</h3>
                      <p className="text-sm text-gray-600">Marcus Johnson</p>
                      <p className="text-xs text-gray-500">LEM000001</p>
                      <Badge className="mt-2 bg-red-100 text-red-800">Executive</Badge>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200 relative group">
                      <Button size="sm" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <h3 className="font-semibold">National VP</h3>
                      <p className="text-sm text-gray-600">Angela Davis</p>
                      <p className="text-xs text-gray-500">LEM000002</p>
                      <Badge className="mt-2 bg-red-100 text-red-800">Executive</Badge>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200 relative group">
                      <Button size="sm" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <h3 className="font-semibold">National Secretary</h3>
                      <p className="text-sm text-gray-600">David Wilson</p>
                      <p className="text-xs text-gray-500">LEM000003</p>
                      <Badge className="mt-2 bg-red-100 text-red-800">Executive</Badge>
                    </div>
                  </div>

                  {/* Additional National Roles */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 relative group">
                      <Button size="sm" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <h3 className="font-semibold text-sm">National Treasurer</h3>
                      <p className="text-sm text-gray-600">Jennifer Lee</p>
                      <p className="text-xs text-gray-500">LEM000004</p>
                      <Badge className="mt-2 bg-blue-100 text-blue-800 text-xs">Financial</Badge>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 relative group">
                      <Button size="sm" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <h3 className="font-semibold text-sm">National Chaplain</h3>
                      <p className="text-sm text-gray-600">Rev. Michael Brown</p>
                      <p className="text-xs text-gray-500">LEM000005</p>
                      <Badge className="mt-2 bg-purple-100 text-purple-800 text-xs">Spiritual</Badge>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 relative group">
                      <Button size="sm" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <h3 className="font-semibold text-sm">National Historian</h3>
                      <p className="text-sm text-gray-600">Dr. Sarah Mitchell</p>
                      <p className="text-xs text-gray-500">LEM000006</p>
                      <Badge className="mt-2 bg-green-100 text-green-800 text-xs">Archives</Badge>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 relative group">
                      <Button size="sm" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <h3 className="font-semibold text-sm">National Parliamentarian</h3>
                      <p className="text-sm text-gray-600">James Rodriguez</p>
                      <p className="text-xs text-gray-500">LEM000007</p>
                      <Badge className="mt-2 bg-orange-100 text-orange-800 text-xs">Legal</Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Connection Lines */}
            <div className="flex justify-center">
              <div className="w-px h-8 bg-gray-300"></div>
            </div>

            {/* Regional Level */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('regional')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-lambda-purple to-purple-600 text-white px-6 py-3 rounded-full font-bold hover:from-lambda-purple/90 hover:to-purple-600/90"
                >
                  {expandedSections.regional ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  <Star className="h-5 w-5" />
                  Regional Leadership
                </Button>
                <Button size="sm" variant="outline" className="ml-2">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Region
                </Button>
              </div>

              {expandedSections.regional && (
                <div className="space-y-4">
                  {/* Regional Directors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200 relative group">
                      <Button size="sm" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <h3 className="font-semibold">Northeast Region</h3>
                      <p className="text-sm text-gray-600">Sarah Thompson</p>
                      <p className="text-xs text-gray-500">LEM001001</p>
                      <p className="text-xs text-blue-600 mt-1">45 Chapters</p>
                      <Badge className="mt-2 bg-purple-100 text-purple-800 text-xs">Director</Badge>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200 relative group">
                      <Button size="sm" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <h3 className="font-semibold">Southeast Region</h3>
                      <p className="text-sm text-gray-600">Michael Brown</p>
                      <p className="text-xs text-gray-500">LEM001002</p>
                      <p className="text-xs text-blue-600 mt-1">38 Chapters</p>
                      <Badge className="mt-2 bg-purple-100 text-purple-800 text-xs">Director</Badge>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200 relative group">
                      <Button size="sm" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <h3 className="font-semibold">Midwest Region</h3>
                      <p className="text-sm text-gray-600">Lisa Garcia</p>
                      <p className="text-xs text-gray-500">LEM001003</p>
                      <p className="text-xs text-blue-600 mt-1">32 Chapters</p>
                      <Badge className="mt-2 bg-purple-100 text-purple-800 text-xs">Director</Badge>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200 relative group">
                      <Button size="sm" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <h3 className="font-semibold">West Region</h3>
                      <p className="text-sm text-gray-600">James Lee</p>
                      <p className="text-xs text-gray-500">LEM001004</p>
                      <p className="text-xs text-blue-600 mt-1">29 Chapters</p>
                      <Badge className="mt-2 bg-purple-100 text-purple-800 text-xs">Director</Badge>
                    </div>
                  </div>

                  {/* Regional Support Roles */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 relative group">
                      <Button size="sm" variant="ghost" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <h3 className="font-semibold text-sm">Regional Coordinator</h3>
                      <p className="text-xs text-gray-600">Training & Development</p>
                      <Badge className="mt-1 bg-blue-100 text-blue-800 text-xs">Support</Badge>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 relative group">
                      <Button size="sm" variant="ghost" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <h3 className="font-semibold text-sm">Regional Treasurer</h3>
                      <p className="text-xs text-gray-600">Financial Oversight</p>
                      <Badge className="mt-1 bg-green-100 text-green-800 text-xs">Financial</Badge>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 relative group">
                      <Button size="sm" variant="ghost" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <h3 className="font-semibold text-sm">Regional Secretary</h3>
                      <p className="text-xs text-gray-600">Communications</p>
                      <Badge className="mt-1 bg-orange-100 text-orange-800 text-xs">Admin</Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Connection Lines */}
            <div className="flex justify-center">
              <div className="w-px h-8 bg-gray-300"></div>
            </div>

            {/* Chapter Level */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('chapter')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-bold hover:from-blue-500/90 hover:to-blue-600/90"
                >
                  {expandedSections.chapter ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  <Users className="h-5 w-5" />
                  Chapter Leadership
                </Button>
                <Button size="sm" variant="outline" className="ml-2">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Chapter
                </Button>
              </div>

              {expandedSections.chapter && (
                <div className="space-y-4">
                  {/* Sample Chapters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 relative group">
                      <Button size="sm" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <h3 className="font-semibold">Alpha Chapter</h3>
                      <p className="text-sm text-gray-600">New York, NY</p>
                      <p className="text-xs text-gray-500">Est. 1995</p>
                      <p className="text-xs text-green-600 mt-1">127 Members</p>
                      <div className="mt-2 space-y-1">
                        <Badge className="bg-blue-100 text-blue-800 text-xs mr-1">President: John Smith</Badge>
                        <Badge className="bg-green-100 text-green-800 text-xs mr-1">VP: Mary Johnson</Badge>
                        <Badge className="bg-purple-100 text-purple-800 text-xs">Treasurer: Bob Wilson</Badge>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 relative group">
                      <Button size="sm" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <h3 className="font-semibold">Beta Chapter</h3>
                      <p className="text-sm text-gray-600">Atlanta, GA</p>
                      <p className="text-xs text-gray-500">Est. 1996</p>
                      <p className="text-xs text-green-600 mt-1">98 Members</p>
                      <div className="mt-2 space-y-1">
                        <Badge className="bg-blue-100 text-blue-800 text-xs mr-1">President: Lisa Davis</Badge>
                        <Badge className="bg-green-100 text-green-800 text-xs mr-1">VP: Mike Brown</Badge>
                        <Badge className="bg-purple-100 text-purple-800 text-xs">Secretary: Ann Lee</Badge>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 relative group">
                      <Button size="sm" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <h3 className="font-semibold">Gamma Chapter</h3>
                      <p className="text-sm text-gray-600">Chicago, IL</p>
                      <p className="text-xs text-gray-500">Est. 1997</p>
                      <p className="text-xs text-green-600 mt-1">89 Members</p>
                      <div className="mt-2 space-y-1">
                        <Badge className="bg-blue-100 text-blue-800 text-xs mr-1">President: Tom Garcia</Badge>
                        <Badge className="bg-green-100 text-green-800 text-xs mr-1">VP: Sue Miller</Badge>
                        <Badge className="bg-purple-100 text-purple-800 text-xs">Chaplain: Rev. Jones</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">... and 141 more chapters nationwide</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View All Chapters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Membership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-lambda-purple">1,247</div>
            <p className="text-sm text-gray-600 mt-1">Active members across all levels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chapters Nationwide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-lambda-gold">144</div>
            <p className="text-sm text-gray-600 mt-1">Active chapters in 48 states</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leadership Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">892</div>
            <p className="text-sm text-gray-600 mt-1">Total leadership roles filled</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}