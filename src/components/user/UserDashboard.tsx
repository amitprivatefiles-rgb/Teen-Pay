import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { DashboardHeader } from './DashboardHeader';
import { EarningsCard } from './EarningsCard';
import { CompanyTaskSection } from './CompanyTaskSection';
import { TaskHistory } from './TaskHistory';
import { WithdrawalForm } from './WithdrawalForm';
import { WithdrawalHistory } from './WithdrawalHistory';
import { PendingTasks } from './PendingTasks';
import { History, DollarSign, LogOut, Clock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface UserDashboardProps {
  userProfile: any;
  onProfileUpdate?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ userProfile, onProfileUpdate }) => {
  const { signOut } = useAuth();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'tasks' | 'pending' | 'history' | 'withdraw'>('tasks');
  const [companies, setCompanies] = useState([]);
  const [taskHistory, setTaskHistory] = useState([]);
  const [taskSubmissions, setTaskSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
    fetchTaskHistory();
    fetchTaskSubmissions();
  }, []);

  const fetchTaskSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('task_submissions')
        .select('*')
        .eq('userId', userProfile.id);

      if (error) throw error;
      setTaskSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      // Get all active companies
      const { data: activeCompanies, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .eq('active', true)
        .order('name', { ascending: true });

      if (companiesError) throw companiesError;
      
      // Show all active companies - let individual sections handle task filtering
      setCompanies(activeCompanies || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('task_submissions')
        .select(`
          *,
          tasks(title, rewardAmount)
        `)
        .eq('userId', userProfile.id)
        .eq('status', 'approved')
        .order('submittedAt', { ascending: false });

      if (error) throw error;
      setTaskHistory(data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleTaskSubmit = async () => {
    // Refresh data after submission
    await fetchTaskSubmissions();
    await fetchTaskHistory();
    await fetchCompanies();
    
    // Refresh user profile to get updated earnings
    if (onProfileUpdate) {
      onProfileUpdate();
    }
  };

  // Check if user is suspended
  if (userProfile.suspended) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <DashboardHeader 
          user={userProfile} 
          onSignOut={signOut}
        />
        
        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-4">Account Suspended</h2>
            <p className="text-red-700 mb-6">
              Your account has been suspended by TeenPay. You cannot access tasks or earn money while your account is suspended.
            </p>
            
            {userProfile.suspensionReason && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-red-800 mb-2">Suspension Reason:</h4>
                <p className="text-red-700 text-sm">{userProfile.suspensionReason}</p>
              </div>
            )}
            
            {userProfile.suspendedAt && (
              <p className="text-red-600 text-sm mb-6">
                Suspended on: {new Date(userProfile.suspendedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            )}
            
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-yellow-800 text-sm">
                If you believe this suspension was made in error, please contact TeenPay support for assistance.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Check if user is suspended
  if (userProfile.suspended) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <DashboardHeader 
          user={userProfile} 
          onSignOut={signOut}
        />
        
        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-800 mb-4">Account Suspended</h2>
            <p className="text-red-700 mb-6">
              Your account has been suspended by TeenPay. You cannot access tasks or earn money while your account is suspended.
            </p>
            
            {userProfile.suspensionReason && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-red-800 mb-2">Suspension Reason:</h4>
                <p className="text-red-700 text-sm">{userProfile.suspensionReason}</p>
              </div>
            )}
            
            {userProfile.suspendedAt && (
              <p className="text-red-600 text-sm mb-6">
                Suspended on: {new Date(userProfile.suspendedAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            )}
            
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-yellow-800 text-sm">
                If you believe this suspension was made in error, please contact TeenPay support for assistance.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <DashboardHeader 
        user={userProfile} 
        onSignOut={signOut}
      />

      <EarningsCard 
        dailyEarnings={userProfile.dailyEarnings || 0}
        totalEarnings={userProfile.totalEarnings || 0}
      />

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-6 sm:mb-8">
        <Button
          variant={activeTab === 'tasks' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('tasks')}
          icon={DollarSign}
          size="sm"
          className="text-xs sm:text-sm"
        >
          {t('nav.available')}
        </Button>
        <Button
          variant={activeTab === 'pending' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('pending')}
          icon={Clock}
          size="sm"
          className="text-xs sm:text-sm"
        >
          {t('nav.pending')}
        </Button>
        <Button
          variant={activeTab === 'history' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('history')}
          icon={History}
          size="sm"
          className="text-xs sm:text-sm"
        >
          {t('nav.completed')}
        </Button>
        <Button
          variant={activeTab === 'withdraw' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('withdraw')}
          icon={LogOut}
          size="sm"
          className="text-xs sm:text-sm"
        >
          {t('nav.withdraw')}
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          {/* Instruction Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 sm:p-4 shadow-sm">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-full flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-blue-900 text-sm sm:text-base">
                  {language === 'en' ? 'How to Start Earning' : 'कमाई कैसे शुरू करें'}
                </h4>
              </div>
              
              {/* Steps */}
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <p className="text-blue-800 text-xs sm:text-sm leading-relaxed">
                    {language === 'en'
                      ? 'Click "View Tasks" below each company to see available tasks'
                      : 'प्रत्येक कंपनी के नीचे "कार्य देखें" पर क्लिक करें'
                    }
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <p className="text-blue-800 text-xs sm:text-sm leading-relaxed">
                    {language === 'en'
                      ? 'Choose a task from available platforms (Google, Instagram, Facebook, etc.)'
                      : 'उपलब्ध प्लेटफार्मों (गूगल, इंस्टाग्राम, फेसबुक, आदि) से एक कार्य चुनें'
                    }
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <p className="text-blue-800 text-xs sm:text-sm leading-relaxed">
                    {language === 'en'
                      ? 'Complete the task (review, follow, like, etc.) and take a clear screenshot'
                      : 'कार्य पूरा करें (समीक्षा, फॉलो, लाइक, आदि) और स्पष्ट स्क्रीनशॉट लें'
                    }
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <p className="text-blue-800 text-xs sm:text-sm leading-relaxed">
                    {language === 'en'
                      ? 'Submit your screenshot with required details for verification'
                      : 'सत्यापन के लिए आवश्यक विवरण के साथ अपना स्क्रीनशॉट जमा करें'
                    }
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    ₹
                  </div>
                  <p className="text-blue-800 text-xs sm:text-sm leading-relaxed font-medium">
                    {language === 'en'
                      ? 'Earn ₹5-₹20 per task • Get paid within 2-3 days after approval'
                      : 'प्रति कार्य ₹5-₹20 कमाएं • स्वीकृति के 2-3 दिन बाद भुगतान पाएं'
                    }
                  </p>
                </div>
              </div>

              {/* Quick tip */}
              <div className="bg-white/60 rounded-lg p-2 border border-blue-100">
                <p className="text-blue-700 text-xs flex items-center space-x-1">
                  <span>💡</span>
                  <span className="font-medium">
                    {language === 'en'
                      ? 'Tip: You can complete one task per platform for each company'
                      : 'सुझाव: आप प्रत्येक कंपनी के लिए प्रति प्लेटफ़ॉर्म एक कार्य पूरा कर सकते हैं'
                    }
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-2xl font-bold text-gray-900">{t('nav.available')} by Company</h2>
            <div className="bg-blue-50 px-3 py-1 rounded-full">
              <span className="text-blue-700 text-xs sm:text-sm font-medium">{t('companies.available', { count: companies.length })}</span>
            </div>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-3 sm:p-6">
                  <div className="animate-pulse">
                    <div className="h-4 sm:h-6 bg-gray-200 rounded mb-2 sm:mb-3"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded mb-1 sm:mb-2"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : companies.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="bg-gray-100 p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{t('companies.none')}</h3>
                <p className="text-gray-600 text-sm sm:text-base px-4">
                  {t('companies.check')}
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3 sm:space-y-6">
              {companies.map((company) => (
                <CompanyTaskSection
                  key={company.id}
                  company={company}
                  onTaskComplete={handleTaskSubmit}
                  taskSubmissions={taskSubmissions}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'pending' && (
        <PendingTasks 
          userProfile={userProfile}
          onUpdate={handleTaskSubmit}
        />
      )}

      {activeTab === 'history' && (
        <TaskHistory history={taskHistory} />
      )}

      {activeTab === 'withdraw' && (
        <div className="space-y-6">
          <WithdrawalForm
            userProfile={userProfile}
            minAmount={50}
            onWithdrawalSuccess={onProfileUpdate}
          />
          <WithdrawalHistory userId={userProfile.id} />
        </div>
      )}

    </div>
  );
};