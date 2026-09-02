import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Users, Shield, TrendingUp, ArrowRight, Globe, CheckCircle, Star, Award, Heart, Zap, Target, Clock, MessageCircle, ThumbsUp, Sparkles, ChevronDown } from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted, onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Community Member",
      content: "Being part of Engagement Experts has been amazing! The platform is easy to use and I love contributing to brands I care about.",
      rating: 5
    },
    {
      name: "Rahul Verma",
      role: "Active Participant",
      content: "The community is incredibly supportive and the rewards system is transparent. Highly recommend joining!",
      rating: 5
    },
    {
      name: "Ananya Patel",
      role: "Premium Member",
      content: "I've been a member for 6 months and the experience keeps getting better. Great platform for authentic engagement.",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "How do I get started?",
      answer: "Simply click 'Join Community Now' to create your free account. It takes less than a minute and requires no credit card."
    },
    {
      question: "Is it really free to join?",
      answer: "Yes, joining Engagement Experts is completely free. There are no hidden fees or charges."
    },
    {
      question: "How do rewards work?",
      answer: "As you participate in authentic engagement activities, you earn rewards that can be withdrawn directly to your account."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard encryption and security measures to protect your personal information."
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-64 h-64 sm:w-96 sm:h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float"></div>
        <div className="absolute top-20 sm:top-40 right-5 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float-delay"></div>
        <div className="absolute -bottom-8 left-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-35 animate-float"></div>

        <div className="absolute top-10 right-1/4 w-16 h-16 sm:w-20 sm:h-20 bg-blue-500 rounded-lg opacity-20 transform rotate-12 animate-float"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-indigo-500 rounded-full opacity-20 animate-float-delay"></div>
        <div className="absolute top-1/2 right-10 w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg opacity-20 transform -rotate-12 animate-float"></div>
        <div className="absolute bottom-1/3 left-10 w-16 h-16 sm:w-24 sm:h-24 bg-blue-400 rounded-full opacity-20 animate-float-delay"></div>

        <div className="absolute top-1/4 left-1/3 w-8 h-8 sm:w-10 sm:h-10 bg-indigo-500 rounded-full opacity-15 animate-float"></div>
        <div className="absolute top-3/4 right-1/3 w-10 h-10 sm:w-14 sm:h-14 bg-blue-500 rounded-lg opacity-15 transform rotate-45 animate-float-delay"></div>
        <div className="absolute top-1/3 right-1/4 w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full opacity-15 animate-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-8 h-8 sm:w-12 sm:h-12 bg-indigo-500 rounded-lg opacity-15 transform -rotate-45 animate-float-delay"></div>
        <div className="absolute top-1/2 left-10 w-10 h-10 sm:w-16 sm:h-16 bg-blue-500 rounded-full opacity-15 animate-float"></div>
        <div className="absolute bottom-1/2 right-20 w-8 h-8 sm:w-12 sm:h-12 bg-purple-500 rounded-lg opacity-15 transform rotate-30 animate-float-delay"></div>

        <svg className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#3B82F6" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
        </svg>

        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,50 Q250,100 500,50 T1000,50 L1000,0 L0,0 Z" fill="url(#gradient1)" />
            <path d="M0,150 Q300,100 600,150 T1200,150 L1200,0 L0,0 Z" fill="url(#gradient2)" />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#6366F1" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.25" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto relative z-10 py-12 sm:py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full mb-6 sm:mb-8 animate-fade-in shadow-sm">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="text-blue-600 text-sm sm:text-base font-semibold">Join 10,000+ Community Members</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight animate-slide-up mb-4 sm:mb-6">
              Be Part of Something
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] mt-2 sm:mt-3">
                Bigger Than Yourself
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mt-6 sm:mt-8 mb-8 sm:mb-10 leading-relaxed animate-slide-up-delay px-4 max-w-3xl mx-auto">
              Join Engagement Experts and participate in meaningful brand activities. Share your voice,
              contribute authentic feedback, and become a valued member of our thriving community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-10 animate-slide-up-delay-2 px-4">
              <Button
                size="lg"
                onClick={onGetStarted}
                icon={ArrowRight}
                className="text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all font-semibold"
              >
                Join Community Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate('/how-it-works')}
                className="text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 border-2 font-semibold"
              >
                See How It Works
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 text-sm sm:text-base text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                <span className="font-medium">Free to Join</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                <span className="font-medium">No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                <span className="font-medium">Trusted & Secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Join Our Community?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Become part of a vibrant community making a real impact in the digital world
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-200">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:rotate-6 transition-transform">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Engaged Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with thousands of like-minded members who actively participate in authentic brand
                interactions and share valuable feedback.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-green-200">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:rotate-6 transition-transform">
                <Shield className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Safe & Trusted</h3>
              <p className="text-gray-600 leading-relaxed">
                Your privacy and security are our top priorities. Join a platform built on trust, transparency,
                and respect for every community member.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-indigo-200">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:rotate-6 transition-transform">
                <TrendingUp className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Exclusive Benefits</h3>
              <p className="text-gray-600 leading-relaxed">
                Access exclusive platform features, participate in special activities, and enjoy member-only
                benefits as part of our community.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full mb-6 shadow-sm">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700 font-semibold">What Makes Us Special</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Your Voice Matters Here
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                At Engagement Experts, every community member plays a vital role. Your authentic participation
                helps brands improve, and in return, you gain access to exclusive platform features and benefits.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-4 bg-white p-4 rounded-xl shadow-sm">
                  <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Authentic Participation</h4>
                    <p className="text-gray-600">Engage genuinely with brands and share your honest feedback</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 bg-white p-4 rounded-xl shadow-sm">
                  <div className="bg-green-100 p-2 rounded-lg flex-shrink-0">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Member Recognition</h4>
                    <p className="text-gray-600">Build your reputation and gain recognition within the community</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 bg-white p-4 rounded-xl shadow-sm">
                  <div className="bg-indigo-100 p-2 rounded-lg flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Exclusive Access</h4>
                    <p className="text-gray-600">Unlock special features available only to active community members</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-2xl border-2 border-blue-100">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-600 font-medium">Community Impact</span>
                      <span className="text-2xl font-bold text-blue-600">10,000+</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 w-4/5 rounded-full"></div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-600 font-medium">Active Participants</span>
                      <span className="text-2xl font-bold text-green-600">8,500+</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-600 to-emerald-600 w-3/4 rounded-full"></div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-600 font-medium">Brand Partnerships</span>
                      <span className="text-2xl font-bold text-indigo-600">500+</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 w-2/3 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-center text-gray-600">
                    <span className="font-bold text-gray-900">Growing daily</span> - Join our thriving community
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-6 rounded-2xl shadow-xl transform rotate-3 hidden lg:block">
                <p className="font-bold text-lg">Join Today!</p>
                <p className="text-sm opacity-90">Free & Easy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full mb-4">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 font-semibold">How It Works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Get Started in 3 Simple Steps</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our community and start making an impact in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/3 left-1/4 right-1/4 h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 transform -translate-y-1/2"></div>

            <div className="relative">
              <Card className="p-8 hover-lift border-2 border-transparent hover:border-blue-200 relative z-10 bg-white">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-blue-600 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl">
                  1
                </div>
                <div className="mt-4 text-center">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Create Account</h3>
                  <p className="text-gray-600">Sign up in seconds with just your email. No credit card required.</p>
                </div>
              </Card>
            </div>

            <div className="relative">
              <Card className="p-8 hover-lift border-2 border-transparent hover:border-indigo-200 relative z-10 bg-white">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl">
                  2
                </div>
                <div className="mt-4 text-center">
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Target className="w-10 h-10 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Browse Activities</h3>
                  <p className="text-gray-600">Explore available brand engagement opportunities that interest you.</p>
                </div>
              </Card>
            </div>

            <div className="relative">
              <Card className="p-8 hover-lift border-2 border-transparent hover:border-green-200 relative z-10 bg-white">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-green-600 to-emerald-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl">
                  3
                </div>
                <div className="mt-4 text-center">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Participate & Earn</h3>
                  <p className="text-gray-600">Complete activities and enjoy member benefits and rewards.</p>
                </div>
              </Card>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              onClick={onGetStarted}
              icon={ArrowRight}
              className="shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Start Your Journey Now
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full mb-4 shadow-sm">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700 font-semibold">Community Voices</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Our Members Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from our thriving community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 hover-lift bg-white border-2 border-transparent hover:border-blue-200">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">Platform Access</div>
            </div>

            <div className="p-6">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>

            <div className="p-6">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">10K+</div>
              <div className="text-gray-600">Active Members</div>
            </div>

            <div className="p-6">
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Brand Partners</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about joining our community</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-xl transition-all"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 pr-4">{faq.question}</h3>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-600 transition-transform flex-shrink-0 ${
                        openFaq === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>
                  {openFaq === index && (
                    <p className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        </div>

        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse-slow"></div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">Join Today</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of community members who are already making their voices heard.
            Start your journey today - it's free, easy, and takes less than a minute.
          </p>
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-4 shadow-2xl transform hover:scale-105 transition-all"
            icon={ArrowRight}
          >
            Join Community Free
          </Button>
          <p className="mt-6 text-blue-100 text-sm">
            No credit card required • Start participating immediately • Cancel anytime
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Instant Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Secure Platform</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
