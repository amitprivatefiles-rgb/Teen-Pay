import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Layout } from './components/Layout';
import { PublicLayout } from './components/PublicLayout';
import { AuthPage } from './components/auth/AuthPage';
import { UserDashboard } from './components/user/UserDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CompanyLoginPage } from './components/company/CompanyLoginPage';
import { CompanyDashboard } from './components/company/CompanyDashboard';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { LanguageSelector } from './components/ui/LanguageSelector';
import { HomePage } from './pages/HomePage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { HelpCenterPage } from './pages/HelpCenterPage';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { updateMetaTags, setPageTitle, updatePageSEO } from './utils/seo';
import { NotFoundPage } from './pages/NotFoundPage';
import { GuestTaskPage } from './pages/GuestTaskPage';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { user, loading, refreshUser } = useAuth();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showAuthPage, setShowAuthPage] = useState(false);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      const hasSelectedLanguage = localStorage.getItem('engagement_experts_language_selected');
      if (!hasSelectedLanguage) {
        setShowLanguageSelector(true);
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (currentPath === '/company/login') {
    updateMetaTags(true);
    setPageTitle('Company Login', true);
    return (
      <LanguageProvider>
        <CompanyLoginPage />
      </LanguageProvider>
    );
  }

  if (currentPath === '/company/dashboard') {
    updateMetaTags(true);
    setPageTitle('Company Dashboard', true);
    return (
      <LanguageProvider>
        <CompanyDashboard />
      </LanguageProvider>
    );
  }

  // Shareable task page (works for both authenticated and unauthenticated users)
  if (currentPath.startsWith('/task/')) {
    const taskId = currentPath.split('/task/')[1];
    if (taskId) {
      updatePageSEO({
        title: 'Complete Task & Earn Rewards',
        description: 'Complete this task and earn rewards. Join our community engagement platform.',
      });
      return <GuestTaskPage taskId={taskId} onNavigate={navigate} />;
    }
  }

  if (!user && !showAuthPage) {
    updateMetaTags(false);

    if (currentPath === '/features') {
      updatePageSEO({
        title: 'Platform Features - Brand Engagement Benefits',
        description: 'Discover exclusive features for community members. Join 10,000+ users earning rewards through authentic brand engagement. Free access to premium tools.',
        keywords: 'platform features, community benefits, brand engagement tools, member rewards, engagement platform',
      });
      return (
        <PublicLayout onGetStarted={() => setShowAuthPage(true)} onNavigate={navigate}>
          <FeaturesPage onGetStarted={() => setShowAuthPage(true)} />
        </PublicLayout>
      );
    }

    if (currentPath === '/how-it-works') {
      updatePageSEO({
        title: 'How It Works - Simple 3-Step Process',
        description: 'Learn how to join our community in 3 easy steps. Sign up free, browse activities, and start earning. No credit card required. Join 10K+ members today!',
        keywords: 'how it works, getting started, join community, sign up process, earn rewards',
      });
      return (
        <PublicLayout onGetStarted={() => setShowAuthPage(true)} onNavigate={navigate}>
          <HowItWorksPage onGetStarted={() => setShowAuthPage(true)} />
        </PublicLayout>
      );
    }

    if (currentPath === '/about') {
      updatePageSEO({
        title: 'About Us - Community Engagement Leaders',
        description: 'Learn about Engagement Experts, the trusted platform connecting 10,000+ members with leading brands. Our mission is authentic community engagement.',
        keywords: 'about us, company mission, community platform, brand partnerships, engagement experts',
      });
      return (
        <PublicLayout onGetStarted={() => setShowAuthPage(true)} onNavigate={navigate}>
          <AboutPage onGetStarted={() => setShowAuthPage(true)} />
        </PublicLayout>
      );
    }

    if (currentPath === '/contact') {
      updatePageSEO({
        title: 'Contact Us - Get Help & Support 24/7',
        description: 'Need help? Contact our support team 24/7. Get answers to your questions about our community engagement platform. We\'re here to help!',
        keywords: 'contact us, customer support, help center, get in touch, support team',
      });
      return (
        <PublicLayout onGetStarted={() => setShowAuthPage(true)} onNavigate={navigate}>
          <ContactPage onGetStarted={() => setShowAuthPage(true)} />
        </PublicLayout>
      );
    }

    if (currentPath === '/help') {
      updatePageSEO({
        title: 'Help Center - FAQs & Knowledge Base',
        description: 'Find answers to common questions about our platform. Browse our comprehensive knowledge base for help with account setup, tasks, and rewards.',
        keywords: 'help center, faq, knowledge base, support articles, how to guides',
      });
      return (
        <PublicLayout onGetStarted={() => setShowAuthPage(true)} onNavigate={navigate}>
          <HelpCenterPage onGetStarted={() => setShowAuthPage(true)} onNavigate={navigate} />
        </PublicLayout>
      );
    }

    if (currentPath === '/privacy') {
      updatePageSEO({
        title: 'Privacy Policy - Data Protection & Security',
        description: 'Read our privacy policy to understand how we protect your data. Learn about our commitment to security and user privacy on our platform.',
        keywords: 'privacy policy, data protection, user privacy, security, gdpr compliance',
      });
      return (
        <PublicLayout onGetStarted={() => setShowAuthPage(true)} onNavigate={navigate}>
          <PrivacyPolicy onBack={() => navigate('/')} />
        </PublicLayout>
      );
    }

    if (currentPath === '/terms') {
      updatePageSEO({
        title: 'Terms of Service - User Agreement',
        description: 'Review our terms of service and user agreement. Understand your rights and responsibilities as a member of our community platform.',
        keywords: 'terms of service, user agreement, terms and conditions, platform rules',
      });
      return (
        <PublicLayout onGetStarted={() => setShowAuthPage(true)} onNavigate={navigate}>
          <TermsOfService onBack={() => navigate('/')} />
        </PublicLayout>
      );
    }

    if (currentPath === '/' || currentPath === '') {
      updatePageSEO({
        title: 'Brand Engagement Platform - Join 10K+ Members',
        description: 'Join 10,000+ members in our community engagement platform. Participate in authentic brand activities, share feedback, and earn rewards. Free to join - Start today!',
        keywords: 'community engagement, brand participation, earn rewards, join community, engagement platform',
      });
      return (
        <PublicLayout onGetStarted={() => setShowAuthPage(true)} onNavigate={navigate}>
          <HomePage onGetStarted={() => setShowAuthPage(true)} onNavigate={navigate} />
        </PublicLayout>
      );
    }

    updatePageSEO({
      title: 'Page Not Found - 404 Error',
      description: 'The page you are looking for could not be found. Return to our homepage to explore our community engagement platform.',
    });
    return <NotFoundPage onNavigate={navigate} />;
  }

  updateMetaTags(true);
  if (user?.role === 'admin') {
    setPageTitle('Admin Dashboard', true);
  } else if (user) {
    setPageTitle('Dashboard', true);
  } else {
    setPageTitle('Login', true);
  }

  return (
    <LanguageProvider>
      <Layout>
        {!user ? (
          <AuthPage onBack={() => setShowAuthPage(false)} />
        ) : user.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <>
            <UserDashboard userProfile={user} onProfileUpdate={refreshUser} />
            {showLanguageSelector && (
              <LanguageSelector onLanguageSelected={() => setShowLanguageSelector(false)} />
            )}
          </>
        )}
      </Layout>
    </LanguageProvider>
  );
}

export default App;
