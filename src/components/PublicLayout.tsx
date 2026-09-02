import React from 'react';
import { Button } from './ui/Button';
import { Users } from 'lucide-react';

interface PublicLayoutProps {
  children: React.ReactNode;
  onGetStarted: () => void;
  onNavigate: (path: string) => void;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children, onGetStarted, onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('/')}>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Engagement Experts</span>
            </div>

            <div className="hidden md:flex space-x-8">
              <button onClick={() => onNavigate('/')} className="text-gray-600 hover:text-gray-900 transition font-medium">
                Home
              </button>
              <button onClick={() => onNavigate('/features')} className="text-gray-600 hover:text-gray-900 transition font-medium">
                Features
              </button>
              <button onClick={() => onNavigate('/how-it-works')} className="text-gray-600 hover:text-gray-900 transition font-medium">
                How It Works
              </button>
              <button onClick={() => onNavigate('/help')} className="text-gray-600 hover:text-gray-900 transition font-medium">
                Help
              </button>
              <button onClick={() => onNavigate('/contact')} className="text-gray-600 hover:text-gray-900 transition font-medium">
                Contact
              </button>
            </div>

            <Button onClick={onGetStarted} size="sm">
              <span className="md:hidden">Join</span>
              <span className="hidden md:inline">Join Community</span>
            </Button>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Engagement Experts</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting community members with authentic brand engagement opportunities.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => onNavigate('/')} className="hover:text-white transition text-left">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/features')} className="hover:text-white transition text-left">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/how-it-works')} className="hover:text-white transition text-left">
                    How It Works
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/about')} className="hover:text-white transition text-left">
                    About Us
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => onNavigate('/help')} className="hover:text-white transition text-left">
                    Help Center
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/contact')} className="hover:text-white transition text-left">
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => onNavigate('/privacy')} className="hover:text-white transition text-left">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('/terms')} className="hover:text-white transition text-left">
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Engagement Experts. All rights reserved. A community engagement platform for authentic brand interactions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
