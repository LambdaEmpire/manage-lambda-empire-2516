import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TreePine, Users, Crown, Star } from 'lucide-react';

export default function EmpireHouse() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-lambda-purple to-indigo-600 p-6 rounded-xl text-white">
        <div className="flex items-center gap-4">
          <TreePine className="h-12 w-12" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">The Empire House</h1>
            <p className="text-white/90 mt-1">Lambda Empire Organizational Structure</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Family Tree</CardTitle>
          <CardDescription>Hierarchical structure of Lambda Empire membership</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* National Level */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-lambda-gold to-yellow-500 text-white px-6 py-3 rounded-full font-bold text-lg">
                <Crown className="h-5 w-5" />
                National Leadership
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                  <h3 className="font-semibold">National President</h3>
                  <p className="text-sm text-gray-600">Marcus Johnson</p>
                  <p className="text-xs text-gray-500">LEM000001</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                  <h3 className="font-semibold">National VP</h3>
                  <p className="text-sm text-gray-600">Angela Davis</p>
                  <p className="text-xs text-gray-500">LEM000002</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                  <h3 className="font-semibold">National Secretary</h3>
                  <p className="text-sm text-gray-600">David Wilson</p>
                  <p className="text-xs text-gray-500">LEM000003</p>
                </div>
              </div>
            </div>

            {/* Connection Lines */}
            <div className="flex justify-center">
              <div className="w-px h-8 bg-gray-300"></div>
            </div>

            {/* Regional Level */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-lambda-purple to-purple-600 text-white px-6 py-3 rounded-full font-bold">
                <Star className="h-5 w-5" />
                Regional Leadership
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                  <h3 className="font-semibold">Northeast Region</h3>
                  <p className="text-sm text-gray-600">Sarah Thompson</p>
                  <p className="text-xs text-gray-500">LEM001001</p>
                  <p className="text-xs text-blue-600 mt-1">45 Chapters</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                  <h3 className="font-semibold">Southeast Region</h3>
                  <p className="text-sm text-gray-600">Michael Brown</p>
                  <p className="text-xs text-gray-500">LEM001002</p>
                  <p className="text-xs text-blue-600 mt-1">38 Chapters</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                  <h3 className="font-semibold">Midwest Region</h3>
                  <p className="text-sm text-gray-600">Lisa Garcia</p>
                  <p className="text-xs text-gray-500">LEM001003</p>
                  <p className="text-xs text-blue-600 mt-1">32 Chapters</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                  <h3 className="font-semibold">West Region</h3>
                  <p className="text-sm text-gray-600">James Lee</p>
                  <p className="text-xs text-gray-500">LEM001004</p>
                  <p className="text-xs text-blue-600 mt-1">29 Chapters</p>
                </div>
              </div>
            </div>

            {/* Connection Lines */}
            <div className="flex justify-center">
              <div className="w-px h-8 bg-gray-300"></div>
            </div>

            {/* Chapter Level */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-bold">
                <Users className="h-5 w-5" />
                Chapter Leadership
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <h3 className="font-semibold">Alpha Chapter</h3>
                  <p className="text-sm text-gray-600">New York, NY</p>
                  <p className="text-xs text-gray-500">Est. 1995</p>
                  <p className="text-xs text-green-600 mt-1">127 Members</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <h3 className="font-semibold">Beta Chapter</h3>
                  <p className="text-sm text-gray-600">Atlanta, GA</p>
                  <p className="text-xs text-gray-500">Est. 1996</p>
                  <p className="text-xs text-green-600 mt-1">98 Members</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <h3 className="font-semibold">Gamma Chapter</h3>
                  <p className="text-sm text-gray-600">Chicago, IL</p>
                  <p className="text-xs text-gray-500">Est. 1997</p>
                  <p className="text-xs text-green-600 mt-1">89 Members</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">... and 141 more chapters nationwide</p>
              </div>
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
            <CardTitle>Years of Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">29</div>
            <p className="text-sm text-gray-600 mt-1">Serving communities since 1995</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}