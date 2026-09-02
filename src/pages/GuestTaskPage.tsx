import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  Users, ArrowLeft, Mail, Upload, CheckCircle, AlertCircle,
  Star, ExternalLink, Copy, Check, Vote, Tv, Image, X, Trophy
} from 'lucide-react';

interface GuestTaskPageProps {
  taskId: string;
  onNavigate: (path: string) => void;
}

export const GuestTaskPage: React.FC<GuestTaskPageProps> = ({ taskId, onNavigate }) => {
  const [task, setTask] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [existingStatus, setExistingStatus] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState('');
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    setLoading(true);
    setError('');
    try {
      const taskData = await api.get(`/tasks/${taskId}`);
      setTask(taskData);
      setCompany(taskData.companyId); // Mongoose populate returns the company object
    } catch (err) {
      console.error('Error fetching task:', err);
      setError('This task is not available or the link has expired.');
    } finally {
      setLoading(false);
    }
  };

  const checkExistingSubmission = async (emailToCheck: string) => {
    try {
      const data = await api.get(`/guest-submissions/check?taskId=${taskId}&email=${encodeURIComponent(emailToCheck.toLowerCase().trim())}`);

      if (data.exists) {
        setAlreadySubmitted(true);
        setExistingStatus(data.status);
        return true;
      }
      setAlreadySubmitted(false);
      setExistingStatus(null);
      return false;
    } catch {
      return false;
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setSubmitError('Please select an image file (JPG, PNG, etc.)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setSubmitError('File size must be less than 5 MB');
      return;
    }
    setScreenshotFile(file);
    setSubmitError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      setScreenshotPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);

    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setSubmitError('Please enter a valid email address.');
      setSubmitting(false);
      return;
    }

    if (!screenshotPreview) {
      setSubmitError('Please upload a screenshot as proof.');
      setSubmitting(false);
      return;
    }

    // Check for existing submission
    const exists = await checkExistingSubmission(normalizedEmail);
    if (exists) {
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/guest-submissions', {
        taskId,
        guestEmail: normalizedEmail,
        screenshotUrl: screenshotPreview
      });

      setSubmitted(true);
    } catch (err: any) {
      if (err.message && err.message.includes('Duplicate')) {
        setAlreadySubmitted(true);
        setExistingStatus('pending');
      } else {
        console.error('Error submitting:', err);
        setSubmitError(err.message || 'Failed to submit. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const getPlatformInfo = () => {
    switch (task?.platform) {
      case 'voting':
        return { label: 'Voting', icon: Vote, color: 'bg-purple-100 text-purple-800', gradient: 'from-purple-600 to-pink-600' };
      case 'google':
        return { label: 'Google', icon: Star, color: 'bg-blue-100 text-blue-800', gradient: 'from-blue-600 to-blue-800' };
      case 'instagram':
        return { label: 'Instagram', icon: Image, color: 'bg-pink-100 text-pink-800', gradient: 'from-pink-500 to-purple-600' };
      case 'youtube':
        return { label: 'YouTube', icon: Tv, color: 'bg-red-100 text-red-800', gradient: 'from-red-600 to-red-800' };
      default:
        return { label: task?.platform || 'Task', icon: Star, color: 'bg-gray-100 text-gray-800', gradient: 'from-gray-600 to-gray-800' };
    }
  };

  const getVotingInstructions = () => {
    return [
      'Click the voting link below to open the voting page',
      task?.reviewText ? `Vote as instructed: ${task.reviewText}` : 'Cast your vote for the specified contestant',
      'Take a screenshot showing your vote confirmation',
      'Enter your email and upload the screenshot below',
      'Submit to claim your reward!'
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Task Not Available</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => onNavigate('/')} icon={ArrowLeft}>
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Submission Received!</h2>
          <p className="text-gray-600 mb-2">Your proof has been submitted for review.</p>
          <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-6">
            <p className="text-green-800 font-medium">Reward: ₹{task.rewardAmount}</p>
            <p className="text-green-700 text-sm mt-1">Will be credited after approval</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6">
            <Trophy className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-blue-800 font-medium text-sm">Create an account with <strong>{email}</strong> to track and withdraw your rewards!</p>
          </div>
          <div className="space-y-3">
            <Button onClick={() => onNavigate('/')} className="w-full">
              Create Account & Claim Rewards
            </Button>
            <button
              onClick={() => {
                setSubmitted(false);
                setEmail('');
                setScreenshotFile(null);
                setScreenshotPreview(null);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Submit another entry
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const platformInfo = getPlatformInfo();
  const PlatformIcon = platformInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('/')}>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Engagement Experts
              </h1>
            </div>
            <Button variant="outline" size="sm" onClick={() => onNavigate('/')}>
              Sign Up / Login
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Task Hero */}
        <div className={`bg-gradient-to-r ${platformInfo.gradient} rounded-2xl p-6 sm:p-8 text-white mb-6 sm:mb-8`}>
          <div className="flex items-start space-x-4">
            {company?.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover bg-white/20 p-1"
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <PlatformIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
            )}
            <div className="flex-1">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/20 mb-2`}>
                {platformInfo.label} Task
              </span>
              <h1 className="text-xl sm:text-2xl font-bold mb-1">{task.title}</h1>
              <p className="text-white/80 text-sm">{company?.name}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
              <span className="text-lg sm:text-2xl font-bold">₹{task.rewardAmount}</span>
              <span className="text-white/80 text-sm ml-1">reward</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left: Instructions */}
          <div className="space-y-6">
            {/* Steps */}
            <Card className="p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span>How to Complete</span>
              </h2>
              <ol className="space-y-3">
                {getVotingInstructions().map((step, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </Card>

            {/* Task Link */}
            {task.taskLink && (
              <Card className="p-5 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Task Link</h3>
                <a
                  href={task.taskLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center space-x-2 w-full py-3 px-4 bg-gradient-to-r ${platformInfo.gradient} text-white rounded-xl hover:opacity-90 transition font-medium`}
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Open {platformInfo.label} Page</span>
                </a>
              </Card>
            )}

            {/* Review/Comment text to copy */}
            {task.reviewText && task.platform !== 'voting' && (
              <Card className="p-5 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Text to Post</h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{task.reviewText}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  icon={copied ? Check : Copy}
                  onClick={() => handleCopyText(task.reviewText)}
                >
                  {copied ? 'Copied!' : 'Copy Text'}
                </Button>
              </Card>
            )}

            {/* Voting Instructions */}
            {task.reviewText && task.platform === 'voting' && (
              <Card className="p-5 sm:p-6 border-purple-200 bg-purple-50/50">
                <h3 className="font-semibold text-purple-900 mb-2">Voting Instructions</h3>
                <p className="text-purple-800 text-sm">{task.reviewText}</p>
              </Card>
            )}
          </div>

          {/* Right: Submission Form */}
          <div>
            {alreadySubmitted ? (
              <Card className="p-5 sm:p-6">
                <div className="text-center py-4">
                  <div className="bg-yellow-100 p-3 rounded-full w-14 h-14 mx-auto mb-4 flex items-center justify-center">
                    <AlertCircle className="w-7 h-7 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Already Submitted</h3>
                  <p className="text-gray-600 mb-3">
                    You've already submitted for this task with this email.
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    existingStatus === 'approved' ? 'bg-green-100 text-green-800' :
                    existingStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    Status: {existingStatus === 'approved' ? 'Approved ✓' : existingStatus === 'rejected' ? 'Rejected' : 'Under Review'}
                  </span>
                  <div className="mt-6">
                    <Button variant="outline" onClick={() => onNavigate('/')} className="w-full">
                      Create Account to Track Rewards
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Submit Your Proof</h2>
                <p className="text-gray-500 text-sm mb-5">Enter your email and upload a screenshot</p>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setAlreadySubmitted(false);
                    }}
                    onBlur={() => email && checkExistingSubmission(email)}
                    icon={<Mail className="w-4 h-4" />}
                    placeholder="your@email.com"
                    required
                  />
                  <p className="text-xs text-gray-500 -mt-2">
                    Use the same email when creating your account to claim rewards
                  </p>

                  {/* Screenshot Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proof Screenshot
                    </label>
                    {screenshotPreview ? (
                      <div className="relative">
                        <img
                          src={screenshotPreview}
                          alt="Screenshot preview"
                          className="w-full h-48 object-cover rounded-xl border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setScreenshotFile(null);
                            setScreenshotPreview(null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-gray-500 mt-1">{screenshotFile?.name}</p>
                      </div>
                    ) : (
                      <div
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                          dragActive
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                        }`}
                        onClick={() => document.getElementById('guest-screenshot-input')?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={handleDrop}
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click or drag to upload screenshot</p>
                        <p className="text-xs text-gray-400 mt-1">Max 5 MB • JPG, PNG</p>
                      </div>
                    )}
                    <input
                      id="guest-screenshot-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    />
                  </div>

                  <Button
                    type="submit"
                    loading={submitting}
                    className="w-full"
                    size="lg"
                  >
                    Submit & Claim ₹{task.rewardAmount}
                  </Button>

                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
                    <p className="text-xs text-blue-700">
                      <strong>Tip:</strong> Create an account with the same email to track your submissions and withdraw your earnings.
                    </p>
                  </div>
                </form>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-xs sm:text-sm">
            <p>&copy; 2025 Engagement Experts. Community engagement platform for authentic brand interactions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
