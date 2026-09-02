import React from 'react';
import { Button } from '../components/ui/Button';
import { Home, Search, ArrowLeft, HelpCircle } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
            404
          </h1>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Search className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">Looking for something?</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Here are some helpful links to get you back on track:
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all"
            >
              <Home className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Home Page</span>
            </button>

            <button
              onClick={() => onNavigate('/features')}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-indigo-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all"
            >
              <Search className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-gray-900">Features</span>
            </button>

            <button
              onClick={() => onNavigate('/how-it-works')}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-green-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all"
            >
              <HelpCircle className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-900">How It Works</span>
            </button>

            <button
              onClick={() => onNavigate('/contact')}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all"
            >
              <HelpCircle className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">Contact Us</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => window.history.back()}
            variant="outline"
            icon={ArrowLeft}
            className="text-base px-8 py-4"
          >
            Go Back
          </Button>
          <Button
            size="lg"
            onClick={() => onNavigate('/')}
            icon={Home}
            className="text-base px-8 py-4"
          >
            Return Home
          </Button>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          If you believe this is an error, please{' '}
          <button
            onClick={() => onNavigate('/contact')}
            className="text-blue-600 hover:text-blue-700 underline font-semibold"
          >
            contact our support team
          </button>
        </p>
      </div>
    </div>
  );
};
