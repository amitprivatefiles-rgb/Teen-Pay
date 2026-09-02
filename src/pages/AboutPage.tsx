import React from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Users, Heart, Shield, Target, TrendingUp, Globe, CheckCircle, Award } from 'lucide-react';

interface AboutPageProps {
  onGetStarted: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">About Engagement Experts</h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto">
            Building bridges between brands and communities through authentic engagement
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              <p>
                Engagement Experts was founded with a simple yet powerful vision: to create a trusted platform
                where community members and brands can connect through authentic, meaningful interactions.
              </p>
              <p>
                We recognized that in today's digital landscape, genuine engagement is more valuable than ever.
                Brands need real feedback from real people, and community members want to have their voices
                heard by the companies they care about.
              </p>
              <p>
                Our platform serves as the bridge, facilitating these important connections while maintaining
                the highest standards of trust, transparency, and authenticity.
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Authenticity First</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe in genuine interactions. Every engagement on our platform is authentic,
                with real people providing honest feedback to real brands.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Trust & Safety</h3>
              <p className="text-gray-600 leading-relaxed">
                Your security and privacy are paramount. We implement robust measures to protect
                your data and ensure a safe environment for all members.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Focus</h3>
              <p className="text-gray-600 leading-relaxed">
                Our community members are at the heart of everything we do. We're committed to
                providing value and fostering meaningful connections.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality Standards</h3>
              <p className="text-gray-600 leading-relaxed">
                We maintain high standards for both brands and community members, ensuring every
                interaction is valuable and respectful.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Continuous Growth</h3>
              <p className="text-gray-600 leading-relaxed">
                We're constantly evolving and improving our platform based on feedback from our
                community to better serve everyone.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-xl transition-all">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Global Reach</h3>
              <p className="text-gray-600 leading-relaxed">
                We connect community members and brands from around the world, creating a truly
                global engagement ecosystem.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600">
              Making a difference in the digital engagement landscape
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="text-5xl font-bold text-blue-600 mb-2">10,000+</div>
              <p className="text-gray-700 font-semibold">Active Members</p>
            </Card>

            <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="text-5xl font-bold text-green-600 mb-2">500+</div>
              <p className="text-gray-700 font-semibold">Brand Partners</p>
            </Card>

            <Card className="p-8 text-center bg-gradient-to-br from-indigo-50 to-purple-50">
              <div className="text-5xl font-bold text-indigo-600 mb-2">100K+</div>
              <p className="text-gray-700 font-semibold">Interactions</p>
            </Card>

            <Card className="p-8 text-center bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="text-5xl font-bold text-yellow-600 mb-2">95%</div>
              <p className="text-gray-700 font-semibold">Satisfaction Rate</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Community Members Choose Us</h2>
            <p className="text-xl text-gray-600">
              What makes Engagement Experts the trusted choice
            </p>
          </div>

          <div className="space-y-6">
            <Card className="p-6 flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Transparent Operations</h3>
                <p className="text-gray-600">
                  We operate with complete transparency. You always know exactly what's expected,
                  how the platform works, and what benefits you'll receive.
                </p>
              </div>
            </Card>

            <Card className="p-6 flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Brands</h3>
                <p className="text-gray-600">
                  Every brand on our platform is verified and vetted. You can trust that you're
                  engaging with legitimate, reputable companies.
                </p>
              </div>
            </Card>

            <Card className="p-6 flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Responsive Support</h3>
                <p className="text-gray-600">
                  Our support team is always here to help. Whether you have questions or need
                  assistance, we're committed to providing excellent service.
                </p>
              </div>
            </Card>

            <Card className="p-6 flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fair & Ethical</h3>
                <p className="text-gray-600">
                  We believe in fairness and ethical practices. Our community guidelines ensure
                  everyone is treated with respect and dignity.
                </p>
              </div>
            </Card>

            <Card className="p-6 flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Regular Updates</h3>
                <p className="text-gray-600">
                  We continuously improve the platform based on community feedback, adding new
                  features and opportunities regularly.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Award className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">Join Our Growing Community</h2>
          <p className="text-xl text-blue-100 mb-8">
            Be part of a platform that values authentic engagement and community participation
          </p>
          <Button size="lg" onClick={onGetStarted} className="bg-white text-blue-600 hover:bg-gray-100">
            Become a Member Today
          </Button>
        </div>
      </section>
    </div>
  );
};
