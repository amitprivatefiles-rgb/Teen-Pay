import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { UserPlus, Search, MessageSquare, Award, ArrowRight, CheckCircle, Star } from 'lucide-react';

interface HowItWorksPageProps {
  onGetStarted: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">How It Works</h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto">
            Join our community and start participating in just 4 simple steps
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-200 via-indigo-200 to-blue-200 hidden lg:block"></div>

            <div className="space-y-16">
              <div className="relative">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
                  <div className="lg:pr-8">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-2xl">
                      <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6">
                        <span className="text-3xl font-bold text-blue-600">1</span>
                      </div>
                      <UserPlus className="w-12 h-12 mb-4" />
                      <h3 className="text-3xl font-bold mb-4">Create Your Account</h3>
                      <p className="text-blue-100 text-lg leading-relaxed">
                        Sign up with your email address in less than a minute. It's completely free,
                        and no credit card is required. Verify your email and you're ready to go.
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 lg:mt-0">
                    <Card className="p-8 bg-white">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">What You'll Need:</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Valid email address</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Basic profile information</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Agreement to community guidelines</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Less than 60 seconds of your time</span>
                        </li>
                      </ul>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
                  <div className="lg:order-2 lg:pl-8">
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-8 rounded-2xl shadow-2xl">
                      <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6">
                        <span className="text-3xl font-bold text-green-600">2</span>
                      </div>
                      <Search className="w-12 h-12 mb-4" />
                      <h3 className="text-3xl font-bold mb-4">Browse Opportunities</h3>
                      <p className="text-green-100 text-lg leading-relaxed">
                        Explore various brand engagement opportunities from your dashboard. Filter by
                        category, type, or your interests to find activities that match your preferences.
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 lg:mt-0 lg:order-1">
                    <Card className="p-8 bg-white">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Available Activities:</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Star className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Brand feedback and reviews</span>
                        </li>
                        <li className="flex items-start">
                          <Star className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Social media engagement</span>
                        </li>
                        <li className="flex items-start">
                          <Star className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Product testing opportunities</span>
                        </li>
                        <li className="flex items-start">
                          <Star className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Survey participation</span>
                        </li>
                      </ul>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
                  <div className="lg:pr-8">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-2xl">
                      <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6">
                        <span className="text-3xl font-bold text-indigo-600">3</span>
                      </div>
                      <MessageSquare className="w-12 h-12 mb-4" />
                      <h3 className="text-3xl font-bold mb-4">Participate Authentically</h3>
                      <p className="text-indigo-100 text-lg leading-relaxed">
                        Engage genuinely with brands by following simple instructions. Provide honest
                        feedback, complete activities, and contribute meaningfully to the community.
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 lg:mt-0">
                    <Card className="p-8 bg-white">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Participation Tips:</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Follow instructions carefully</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Provide honest, detailed feedback</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Respect community guidelines</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Complete activities on time</span>
                        </li>
                      </ul>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
                  <div className="lg:order-2 lg:pl-8">
                    <div className="bg-gradient-to-br from-yellow-600 to-orange-600 text-white p-8 rounded-2xl shadow-2xl">
                      <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6">
                        <span className="text-3xl font-bold text-yellow-600">4</span>
                      </div>
                      <Award className="w-12 h-12 mb-4" />
                      <h3 className="text-3xl font-bold mb-4">Access Member Benefits</h3>
                      <p className="text-yellow-100 text-lg leading-relaxed">
                        Track your participation history, build your community reputation, and unlock
                        exclusive platform features available only to active members.
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 lg:mt-0 lg:order-1">
                    <Card className="p-8 bg-white">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Member Benefits:</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <Star className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Participation tracking dashboard</span>
                        </li>
                        <li className="flex items-start">
                          <Star className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Community recognition system</span>
                        </li>
                        <li className="flex items-start">
                          <Star className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Access to premium activities</span>
                        </li>
                        <li className="flex items-start">
                          <Star className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">Exclusive member features</span>
                        </li>
                      </ul>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Common questions about getting started</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">How long does registration take?</h3>
              <p className="text-gray-600">
                Registration takes less than 60 seconds. Simply provide your email, create a password,
                and verify your email address to get started.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Is it really free to join?</h3>
              <p className="text-gray-600">
                Yes, joining Engagement Experts is completely free. There are no hidden fees,
                subscription charges, or credit card requirements.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">What kind of activities will I do?</h3>
              <p className="text-gray-600">
                Activities include providing brand feedback, writing reviews, social media engagement,
                surveys, and other authentic brand interaction opportunities.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Can I participate on mobile?</h3>
              <p className="text-gray-600">
                Absolutely! Our platform is fully optimized for mobile devices. Participate from your
                smartphone, tablet, or computer - whatever works best for you.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">How often can I participate?</h3>
              <p className="text-gray-600">
                There's no limit! Participate as often as you'd like. New opportunities are added
                regularly, and you can engage whenever it's convenient for you.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Is my personal information safe?</h3>
              <p className="text-gray-600">
                Yes, we take data privacy seriously. We use enterprise-grade security measures and
                never share your personal information without your explicit consent.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of community members already participating in brand activities
          </p>
          <Button
            size="lg"
            onClick={onGetStarted}
            icon={ArrowRight}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Create Your Free Account
          </Button>
          <p className="mt-6 text-blue-100 text-sm">
            Takes less than 60 seconds • No credit card needed • Start immediately
          </p>
        </div>
      </section>
    </div>
  );
};
