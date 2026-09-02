import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../lib/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TaskCard } from './TaskCard';
import { Building, ChevronDown, ChevronUp, Star, MapPin, Instagram, Youtube, Smartphone, Vote } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface CompanyTaskSectionProps {
  company: any;
  onTaskComplete: () => void;
  taskSubmissions: any[];
}

const PLATFORM_TABS = [
  { value: 'google', label: 'Google', icon: MapPin },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'playstore', label: 'Play Store', icon: Smartphone },
  { value: 'voting', label: 'Voting', icon: Vote },
];

export const CompanyTaskSection: React.FC<CompanyTaskSectionProps> = ({
  company,
  onTaskComplete,
  taskSubmissions
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [taskCount, setTaskCount] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('google');

  useEffect(() => {
    fetchCompanyTasks();
  }, [company.id]);

  useEffect(() => {
    if (expanded) {
      fetchCompanyTasks();
    }
  }, [expanded, company.id]);

  // Set up real-time subscription when expanded with debouncing
  useEffect(() => {
    if (!expanded) return;

    let refreshTimeout: NodeJS.Timeout | null = null;
    const debouncedRefresh = () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        fetchCompanyTasks();
      }, 1000);
    };

    
    // Removed Supabase subscription
    const subscription = { unsubscribe: () => {} };
    // Polling fallback
    const pollInterval = setInterval(() => {
      fetchData && fetchData();
      fetchWithdrawals && fetchWithdrawals();
    }, 10000);
    

    return () => {
      if (refreshTimeout) clearTimeout(refreshTimeout);
      subscription.unsubscribe();
      clearInterval(pollInterval);
    };
  }, [expanded, company.id]);

  const fetchCompanyTasks = async () => {
    setLoading(true);
    try {
      if (!user) {
        console.log('[CompanyTaskSection] No user found');
        setTasks([]);
        return;
      }

      // Check if user is suspended
      const { user: userProfile } = await api.get('/auth/me');

      if (userProfile?.suspended) {
        console.log('[CompanyTaskSection] User is suspended');
        setTasks([]);
        return;
      }

      // Get all active tasks for this company
      const companyTasks = await api.get(`/tasks?companyId=${company._id || company.id}`);
      
      if (!companyTasks || companyTasks.length === 0) {
        setTasks([]);
        setTaskCount(0);
        return;
      }

      const userSubmissions = await api.get('/submissions');

      // Create a set of companyId+platform+taskType combinations user has already submitted for
      const submittedCombinations = new Set(
        (userSubmissions || []).map(sub => `${sub.companyId}:${sub.platform}:${sub.taskType}`)
      );

      console.log('[CompanyTaskSection] Submitted combinations:', Array.from(submittedCombinations));

      // Filter out tasks with companyId+platform+taskType combinations user has already submitted for
      const availableTasks = companyTasks.filter(task => {
        const combination = `${task.companyId}:${task.platform}:${task.taskType}`;
        return !submittedCombinations.has(combination);
      });

      console.log('[CompanyTaskSection] Available tasks after company+platform+taskType filter:', availableTasks.length);
      setTasks(availableTasks);
      setTaskCount(availableTasks.length);
    } catch (error) {
      console.error('[CompanyTaskSection] Error fetching company tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = () => {
    fetchCompanyTasks(); // Refresh this company's tasks
    onTaskComplete();
  };

  // Filter tasks by selected platform
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => task.platform === selectedPlatform);
  }, [tasks, selectedPlatform]);

  // Count tasks per platform
  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    PLATFORM_TABS.forEach(tab => {
      counts[tab.value] = tasks.filter(task => task.platform === tab.value).length;
    });
    return counts;
  }, [tasks]);

  // Calculate earnings per platform (max reward since user can only do one task per platform)
  const platformEarnings = useMemo(() => {
    const earnings: Record<string, number> = {};
    PLATFORM_TABS.forEach(tab => {
      const platformTasks = tasks.filter(task => task.platform === tab.value);
      earnings[tab.value] = platformTasks.length > 0
        ? Math.max(...platformTasks.map(task => task.rewardAmount || 0))
        : 0;
    });
    return earnings;
  }, [tasks]);

  // Calculate total estimated earnings (sum of max rewards per platform)
  const totalEstimatedEarnings = useMemo(() => {
    return Object.values(platformEarnings).reduce((total, earning) => total + earning, 0);
  }, [platformEarnings]);

  return (
    <Card className="mb-3 sm:mb-6 overflow-hidden">
      <div className="p-3 sm:p-6">
        {/* Company Header */}
        <div 
          className="flex items-center justify-between cursor-pointer active:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 ${company.logoUrl ? 'hidden' : 'flex'}`}
            >
              <Building className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-xl font-semibold text-gray-900 truncate">{company.name}</h3>
              {company.description && (
                <p className="text-gray-600 text-xs sm:text-sm line-clamp-1 hidden sm:block">{company.description}</p>
              )}
              <div className="flex items-center flex-wrap gap-2 mt-1">
                <div className="bg-blue-50 px-2 py-0.5 sm:py-1 rounded-full">
                  <span className="text-blue-700 text-xs sm:text-sm font-medium">
                    {loading ? '...' : t('companies.available', { count: taskCount })}
                  </span>
                </div>
                {!loading && totalEstimatedEarnings > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-green-200">
                    <span className="text-green-700 text-xs sm:text-sm font-semibold">
                      Earn up to ₹{totalEstimatedEarnings}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0 ml-2">
            {/* Mobile View Tasks button */}
            <Button
              variant={expanded ? "primary" : "outline"}
              size="sm"
              className="sm:hidden text-xs px-2 py-1 min-w-0"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              icon={expanded ? ChevronUp : ChevronDown}
            >
              {expanded ? t('companies.hide') : t('companies.view')}
            </Button>
            
            {/* Desktop button */}
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex min-w-0"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              icon={expanded ? ChevronUp : ChevronDown}
            >
              {expanded ? t('companies.hide') : t('companies.view')}
            </Button>
          </div>
        </div>

        {/* Tasks Section */}
        {expanded && (
          <div className="mt-3 sm:mt-6 pt-3 sm:pt-6 border-t border-gray-200">
            {/* Platform Tabs */}
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
              {PLATFORM_TABS.map((tab) => {
                const Icon = tab.icon;
                const count = platformCounts[tab.value] || 0;
                const earnings = platformEarnings[tab.value] || 0;
                const isActive = selectedPlatform === tab.value;

                return (
                  <button
                    key={tab.value}
                    onClick={() => setSelectedPlatform(tab.value)}
                    className={`flex flex-col items-start px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${count === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={count === 0}
                  >
                    <div className="flex items-center space-x-2 w-full">
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        isActive ? 'bg-blue-500' : 'bg-gray-200'
                      }`}>
                        {count}
                      </span>
                    </div>
                    {earnings > 0 && (
                      <span className={`text-xs mt-1 font-semibold ${
                        isActive ? 'text-green-200' : 'text-green-600'
                      }`}>
                        ₹{earnings} available
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 p-2 sm:p-4 rounded-lg mb-3 sm:mb-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-3 h-3 sm:w-5 sm:h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-yellow-800 mb-1">
                    {t('policy.title')}
                  </h4>
                  <p className="text-xs sm:text-sm text-yellow-700">
                    <strong>{t('policy.one')}</strong> {t('policy.description', { company: company.name })}
                  </p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-3 sm:p-6">
                    <div className="animate-pulse">
                      <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2 sm:mb-3"></div>
                      <div className="h-2 sm:h-3 bg-gray-200 rounded mb-1 sm:mb-2"></div>
                      <div className="h-2 sm:h-3 bg-gray-200 rounded mb-3 sm:mb-4"></div>
                      <div className="h-8 sm:h-10 bg-gray-200 rounded"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-6 sm:py-12">
                <div className="bg-gray-100 p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                  <Star className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No Tasks Available</h4>
                <p className="text-gray-600 text-sm sm:text-base px-4">
                  There are no tasks available for this platform at the moment. Check other platforms!
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 lg:gap-6">
                {filteredTasks.map((task) => {
                  const userSubmission = taskSubmissions.find(sub => sub.taskId === task.id);
                  return (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={handleTaskComplete}
                      userSubmission={userSubmission}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};