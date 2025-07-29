import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Award, BookOpen, Calendar, MessageSquare, DollarSign, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Index = () => {
  const features = [
    {
      icon: Users,
      title: 'Member Management',
      description: 'Comprehensive member administration and access control'
    },
    {
      icon: Award,
      title: 'Service Hours Tracking',
      description: 'Log, approve, and manage community service hours'
    },
    {
      icon: BookOpen,
      title: 'Lambda Knowledge',
      description: 'Access educational resources and learning modules'
    },
    {
      icon: Calendar,
      title: 'Event Management',
      description: 'Organize and participate in Lambda Empire events'
    },
    {
      icon: MessageSquare,
      title: 'Communications',
      description: 'Stay connected with announcements and messaging'
    },
    {
      icon: DollarSign,
      title: 'Financial Management',
      description: 'Track dues, fundraising, and financial reports'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-lambda-purple via-blue-900 to-lambda-gold">
      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Lambda Empire</h1>
                <p className="text-white/80 text-sm">Management System</p>
              </div>
            </div>
            <Link to="/login">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Welcome to Lambda Empire
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              A comprehensive management system designed to empower Lambda Empire members 
              with seamless administration, communication, and community engagement tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-white text-lambda-purple hover:bg-white/90 font-semibold px-8 py-3">
                  Access Your Account
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-3">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features for Modern Management
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Everything you need to manage your Lambda Empire chapter efficiently and effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardHeader>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-white/80">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-white/80">Active Members</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">50+</div>
                <div className="text-white/80">Chapters Nationwide</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">10K+</div>
                <div className="text-white/80">Service Hours Logged</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join your Lambda Empire community and access all the tools you need to succeed.
            </p>
            <Link to="/login">
              <Button size="lg" className="bg-white text-lambda-purple hover:bg-white/90 font-semibold px-8 py-3">
                Sign In Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-sm border-t border-white/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white/60">
            <p>&copy; 2024 Lambda Empire Management System. All rights reserved.</p>
            <p className="mt-2">
              Need help? Contact{' '}
              <a href="mailto:support@lambdaempire.org" className="text-white hover:underline">
                support@lambdaempire.org
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;