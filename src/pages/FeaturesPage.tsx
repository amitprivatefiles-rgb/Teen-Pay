import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Users, Shield, Star, Award, Clock, Smartphone, Globe, CheckCircle, TrendingUp, Heart, Zap, Target } from 'lucide-react';

interface FeaturesPageProps {
  onGetStarted: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">Platform Features</h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
            Discover everything Engagement Experts has to offer for community members like you
          </p>
          <Button size="lg" onClick={onGetStarted} className="bg-white text-blue-600 hover:bg-gray-100">
            Get Started Free
          </Button>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Features for Members</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to participate, engage, and grow within our community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-xl transition-all">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Dashboard</h3>
              <p className="text-gray-600 mb-4">
                Access your personalized dashboard to manage all your activities, track participation,
                and stay connected with the community.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Real-time activity updates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Participation history</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Progress tracking</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all">
              <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Brand Activities</h3>
              <p className="text-gray-600 mb-4">
                Browse and participate in various brand engagement opportunities tailored to your interests
                and preferences.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Multiple activity types</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Clear instructions</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Instant participation</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all">
              <div className="bg-indigo-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure Platform</h3>
              <p className="text-gray-600 mb-4">
                Your data and privacy are protected with enterprise-grade security measures and
                transparent policies.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Encrypted connections</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Privacy-first approach</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Data protection</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all">
              <div className="bg-yellow-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Member Recognition</h3>
              <p className="text-gray-600 mb-4">
                Build your reputation within the community and gain recognition for your valuable
                contributions and participation.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Achievement system</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Community rankings</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Profile badges</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all">
              <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Exclusive Benefits</h3>
              <p className="text-gray-600 mb-4">
                Unlock special platform features and member-only benefits as you actively participate
                in the community.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Early access to activities</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Premium features</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Special opportunities</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-all">
              <div className="bg-red-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Support</h3>
              <p className="text-gray-600 mb-4">
                Get help whenever you need it with our responsive support team and helpful community
                resources.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">24/7 support access</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Help center</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">Community guidelines</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Advantages</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Why community members choose Engagement Experts
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100">
              <Clock className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Flexible Participation</h3>
              <p className="text-gray-600 mb-4">
                Participate on your own schedule. No fixed commitments or time constraints - engage
                whenever it's convenient for you.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Work at your own pace
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  No minimum time requirements
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Available 24/7
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100">
              <Smartphone className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mobile Friendly</h3>
              <p className="text-gray-600 mb-4">
                Access the platform from any device. Our responsive design works seamlessly on mobile,
                tablet, and desktop.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Optimized for mobile
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Works on all devices
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Fast and responsive
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100">
              <Globe className="w-12 h-12 text-indigo-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Community</h3>
              <p className="text-gray-600 mb-4">
                Join members from around the world. Connect with diverse brands and participate in
                international engagement opportunities.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  International brands
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Multilingual support
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Diverse opportunities
                </li>
              </ul>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-100">
              <Zap className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Instant Access</h3>
              <p className="text-gray-600 mb-4">
                Start participating immediately after joining. No waiting periods or approval processes -
                dive right in.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Quick registration
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Immediate participation
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  No verification delays
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience These Features?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join Engagement Experts today and unlock all these amazing features for free
          </p>
          <Button size="lg" onClick={onGetStarted} className="bg-white text-blue-600 hover:bg-gray-100">
            Join Community Now
          </Button>
        </div>
      </section>
    </div>
  );
};
