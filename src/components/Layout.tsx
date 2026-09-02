import React from 'react';
import { Wallet, Users, TrendingUp, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Engagement Experts
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Community Engagement Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900"
                  title="Change Language"
                >
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">
                    {language === 'en' ? 'EN' : 'हिं'}
                  </span>
                </button>
              </div>
              
              <div className="hidden lg:flex items-center space-x-8">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm">{t('header.safe')}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">{t('header.earnings')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="text-center text-gray-500 text-xs sm:text-sm">
            <p>&copy; 2025 Engagement Experts. Community engagement platform for authentic brand interactions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};