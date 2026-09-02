import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Search, ChevronDown, ChevronUp, HelpCircle, BookOpen, DollarSign, Shield, CreditCard } from 'lucide-react';

interface HelpCenterPageProps {
  onGetStarted: () => void;
  onNavigate?: (path: string) => void;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ onGetStarted, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen },
    { id: 'getting-started', name: 'Getting Started', icon: HelpCircle },
    { id: 'tasks', name: 'Tasks & Earnings', icon: DollarSign },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'account', name: 'Account & Security', icon: Shield },
  ];

  const faqs: FAQ[] = [
    {
      category: 'getting-started',
      question: 'How do I get started with Engagement Experts?',
      answer: 'Getting started is simple! First, create a free account by clicking "Join Now". Once registered, you can browse available tasks from various companies. Select a company, view their available tasks, complete the task (usually a Google review), and submit your screenshot for verification. You\'ll be paid within 2-3 days once approved.'
    },
    {
      category: 'getting-started',
      question: 'Is Engagement Experts really free to join?',
      answer: 'Yes! Joining Engagement Experts is completely free. There are no registration fees, membership fees, or hidden charges. You simply sign up and start earning money by completing tasks.'
    },
    {
      category: 'getting-started',
      question: 'What do I need to participate?',
      answer: 'All you need is a valid email address, a Google account (for leaving reviews), and a device with internet access. A smartphone or computer works perfectly fine.'
    },
    {
      category: 'tasks',
      question: 'What types of tasks are available?',
      answer: 'Currently, our main tasks involve writing authentic Google reviews for businesses. You\'ll find tasks across multiple platforms including Google Reviews, Instagram, Facebook, and more. Each task clearly states the platform, requirements, and reward amount.'
    },
    {
      category: 'tasks',
      question: 'How much can I earn per task?',
      answer: 'Task rewards typically range from ₹5 to ₹20 per task, depending on the complexity and requirements. Each task clearly displays the reward amount before you start.'
    },
    {
      category: 'tasks',
      question: 'How many tasks can I complete per day?',
      answer: 'You can complete one task per company per platform. For example, if a company has tasks on Google, Instagram, and Facebook, you can complete one task on each platform. This ensures quality and prevents spam.'
    },
    {
      category: 'tasks',
      question: 'Can I complete multiple tasks from the same company?',
      answer: 'You can only complete one task per company per platform. For instance, you can do one Google review task and one Instagram task for the same company, but not two Google review tasks.'
    },
    {
      category: 'tasks',
      question: 'What should I include in my task submission?',
      answer: 'When submitting a task, you need to provide: 1) A clear screenshot showing your completed review/task, 2) Your profile link (if required), 3) Any additional information requested in the task description. Make sure your screenshot clearly shows the completed task and is not blurry or cropped.'
    },
    {
      category: 'tasks',
      question: 'How long does it take for my task to be approved?',
      answer: 'Tasks are typically reviewed and approved within 24-48 hours. You can track the status of your submissions in the "Pending Tasks" section of your dashboard. Once approved, the earnings are added to your balance.'
    },
    {
      category: 'tasks',
      question: 'Why was my task submission rejected?',
      answer: 'Tasks may be rejected for several reasons: 1) Screenshot does not clearly show the completed task, 2) Review content appears to be copied or spam, 3) Task requirements were not fully met, 4) Screenshot is blurry or edited, 5) You have already submitted a task for this company on this platform. Always read the task requirements carefully before submitting.'
    },
    {
      category: 'tasks',
      question: 'Can I edit my task submission after submitting?',
      answer: 'No, once a task is submitted, it cannot be edited. If your submission is rejected, you may be able to resubmit depending on the reason for rejection. Always double-check your submission before sending.'
    },
    {
      category: 'payments',
      question: 'When do I get paid?',
      answer: 'Once your task is approved, the earnings are added to your account balance. You can request a withdrawal once you reach the minimum withdrawal amount of ₹50. Withdrawal requests are typically processed within 2-3 business days.'
    },
    {
      category: 'payments',
      question: 'What is the minimum withdrawal amount?',
      answer: 'The minimum withdrawal amount is ₹50. This ensures efficient processing and reduces transaction fees for small amounts.'
    },
    {
      category: 'payments',
      question: 'What payment methods are available?',
      answer: 'We support payments through UPI, bank transfer, and Paytm. You can add your payment details in the withdrawal section of your dashboard. Make sure to enter correct payment information to avoid delays.'
    },
    {
      category: 'payments',
      question: 'How long does it take to receive my withdrawal?',
      answer: 'Withdrawal requests are processed within 2-3 business days. The exact time depends on your payment method and bank processing times. UPI transfers are typically faster than bank transfers.'
    },
    {
      category: 'payments',
      question: 'Is there a withdrawal fee?',
      answer: 'No, we do not charge any withdrawal fees. The amount you request is the amount you receive.'
    },
    {
      category: 'payments',
      question: 'What if my withdrawal is delayed or not received?',
      answer: 'If your withdrawal is delayed beyond 3 business days, please check: 1) Your payment details are correct, 2) Your bank account is active and accepting transfers, 3) You have not reached any daily limits on your account. If the issue persists, contact our support team with your withdrawal reference number.'
    },
    {
      category: 'account',
      question: 'How do I keep my account secure?',
      answer: 'To keep your account secure: 1) Use a strong, unique password, 2) Never share your password with anyone, 3) Log out when using shared devices, 4) Enable any available security features, 5) Keep your email address secure as it is used for account recovery.'
    },
    {
      category: 'account',
      question: 'Can I change my email address?',
      answer: 'Currently, email addresses cannot be changed after registration. This is a security measure to protect your account. If you need to use a different email, please contact our support team.'
    },
    {
      category: 'account',
      question: 'What happens if I forget my password?',
      answer: 'Click on "Forgot Password" on the login page. Enter your registered email address, and we\'ll send you a password reset link. Follow the link to create a new password.'
    },
    {
      category: 'account',
      question: 'Why was my account suspended?',
      answer: 'Accounts may be suspended for: 1) Submitting fake or fraudulent task submissions, 2) Using multiple accounts, 3) Violating our terms of service, 4) Submitting spam or low-quality content, 5) Suspicious activity. If you believe your suspension was in error, contact support with details.'
    },
    {
      category: 'account',
      question: 'Can I have multiple accounts?',
      answer: 'No, each person is allowed only one account on Engagement Experts. Creating multiple accounts is against our terms of service and will result in all accounts being suspended.'
    },
    {
      category: 'account',
      question: 'How do I delete my account?',
      answer: 'If you wish to delete your account, please contact our support team at support@engagementexperts.in. Please note that deleting your account is permanent and you will lose access to any pending earnings.'
    },
    {
      category: 'getting-started',
      question: 'Do I need to verify my identity?',
      answer: 'Currently, basic identity verification is not required for most users. However, for security purposes and to prevent fraud, we may request verification in certain cases, especially for larger withdrawals.'
    },
    {
      category: 'tasks',
      question: 'What makes a good review?',
      answer: 'A good review is: 1) Authentic and based on genuine experience or research, 2) Written in your own words (not copied), 3) Specific with details about the business, 4) Follows the task requirements, 5) Professional and helpful to others reading the review.'
    },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full mb-6">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-semibold">Knowledge Base</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">Help Center</h1>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-10">
            Find answers to all your questions about tasks, payments, and platform features
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedCategory === 'all' ? 'All Questions' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-gray-600">
              {filteredFAQs.length} {filteredFAQs.length === 1 ? 'article' : 'articles'} found
            </p>
          </div>

          {filteredFAQs.length === 0 ? (
            <Card className="p-12 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or browse different categories
              </p>
              <Button onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredFAQs.map((faq, index) => (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => toggleExpand(index)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-4">
                          {faq.question}
                        </h3>
                        {expandedIndex === index && (
                          <div className="mt-4 text-gray-600 leading-relaxed animate-fade-in">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                      <button
                        className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(index);
                        }}
                      >
                        {expandedIndex === index ? (
                          <ChevronUp className="w-5 h-5 text-blue-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <HelpCircle className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still need help?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => onNavigate?.('/contact')}
            >
              Contact Support
            </Button>
            <Button size="lg" variant="ghost" onClick={onGetStarted}>
              Join Community
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">{faqs.length}+</div>
              <div className="text-gray-600 font-medium">Help Articles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">24hrs</div>
              <div className="text-gray-600 font-medium">Average Response Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600 font-medium">Community Members</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
