import React, { useState } from 'react';
import { SignUpForm } from './SignUpForm';
import { SignInForm } from './SignInForm';
import { ResetPasswordForm } from './ResetPasswordForm';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Users, Star, Shield, TrendingUp, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  onBack?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold">Engagement Experts</h1>
            </div>
            <h2 className="text-3xl font-bold mb-4">Join Our Community Today!</h2>
            <p className="text-xl text-blue-100 mb-8">Connect with leading brands and participate in authentic engagement activities.</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Authentic Engagement</h3>
                <p className="text-blue-100">Participate in genuine brand activities and earn rewards</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Safe & Secure</h3>
                <p className="text-blue-100">Trusted platform with secure transactions</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Quick Rewards</h3>
                <p className="text-blue-100">Earn and withdraw your rewards easily</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-300/20 rounded-full blur-xl"></div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              icon={ArrowLeft}
              className="mb-4"
            >
              Back to Home
            </Button>
          )}
          <Card className="p-8">
            <div className="text-center mb-8 lg:hidden">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Engagement Experts
                </h1>
              </div>
              <p className="text-gray-600">Community Engagement Platform</p>
            </div>

            {mode === 'signin' && <SignInForm />}
            {mode === 'signup' && <SignUpForm />}
            {mode === 'reset' && <ResetPasswordForm />}

            <div className="mt-6 text-center space-y-3">
              {mode === 'signin' && (
                <>
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setMode('signup')}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Sign up here
                    </button>
                  </p>
                  <button
                    onClick={() => setMode('reset')}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Forgot your password?
                  </button>
                </>
              )}
              
              {mode === 'signup' && (
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('signin')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              )}
              
              {mode === 'reset' && (
                <p className="text-gray-600">
                  Remember your password?{' '}
                  <button
                    onClick={() => setMode('signin')}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};