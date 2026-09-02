import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface LanguageSelectorProps {
  onLanguageSelected: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageSelected }) => {
  const { language, setLanguage, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi'>('en');

  const handleContinue = () => {
    setLanguage(selectedLang);
    localStorage.setItem('engagement_experts_language_selected', 'true');
    onLanguageSelected();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full">
        <div className="p-8 text-center">
          {/* Header */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('language.welcome')}
            </h2>
            <p className="text-gray-600">
              {t('language.choose')}
            </p>
          </div>

          {/* Language Options */}
          <div className="space-y-3 mb-8">
            <button
              onClick={() => setSelectedLang('en')}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${
                selectedLang === 'en'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🇺🇸</div>
                <span className="font-medium text-lg">English</span>
              </div>
              {selectedLang === 'en' && (
                <Check className="w-5 h-5 text-blue-600" />
              )}
            </button>

            <button
              onClick={() => setSelectedLang('hi')}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${
                selectedLang === 'hi'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🇮🇳</div>
                <span className="font-medium text-lg">हिंदी (Hindi)</span>
              </div>
              {selectedLang === 'hi' && (
                <Check className="w-5 h-5 text-blue-600" />
              )}
            </button>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            className="w-full"
            size="lg"
          >
            {selectedLang === 'en' ? 'Continue' : 'जारी रखें'}
          </Button>
        </div>
      </Card>
    </div>
  );
};