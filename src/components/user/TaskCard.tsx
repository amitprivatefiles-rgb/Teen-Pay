import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Star, ExternalLink, Copy, Check, Upload, Clock, MapPin, Instagram, Youtube, Smartphone, Heart, MessageCircle, UserPlus, Vote } from 'lucide-react';
import { TaskSubmissionForm } from './TaskSubmissionForm';
import { useLanguage } from '../../contexts/LanguageContext';

interface TaskCardProps {
  task: any;
  onComplete: () => void;
  userSubmission?: any;
}

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'google':
      return MapPin;
    case 'instagram':
      return Instagram;
    case 'youtube':
      return Youtube;
    case 'playstore':
      return Smartphone;
    case 'voting':
      return Vote;
    default:
      return MapPin;
  }
};

const getTaskTypeIcon = (taskType: string) => {
  switch (taskType) {
    case 'like':
      return Heart;
    case 'comment':
      return MessageCircle;
    case 'follow':
    case 'subscribe':
      return UserPlus;
    case 'vote':
      return Vote;
    default:
      return Star;
  }
};

const getTaskTypeLabel = (taskType: string) => {
  const labels: Record<string, string> = {
    review: 'Review',
    comment: 'Comment',
    like: 'Like',
    follow: 'Follow',
    subscribe: 'Subscribe',
    install_review: 'Install & Review',
    vote: 'Vote',
  };
  return labels[taskType] || taskType;
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, userSubmission }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  const PlatformIcon = getPlatformIcon(task.platform);
  const TaskTypeIcon = getTaskTypeIcon(task.taskType);
  const needsReviewText = task.platform === 'google' || task.platform === 'playstore' || task.taskType === 'comment';
  const needsStarRating = task.platform === 'google' || task.platform === 'playstore';

  const copyReview = async () => {
    try {
      const reviewText = task.reviewText || '';
      if (!reviewText) {
        alert('No review text available. Please try refreshing the page.');
        return;
      }
      await navigator.clipboard.writeText(reviewText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const remainingSlots = task.maxUsers - (task.completed_count || 0);

  const getSubmissionStatus = () => {
    if (!userSubmission) return null;
    
    switch (userSubmission.status) {
      case 'under_review':
        return (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-800 mb-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium">⏳ Submitted for Review</span>
            </div>
            <p className="text-blue-700 text-sm mb-2">
              Your task submission is being reviewed by our admin team. You will be notified once it's approved or rejected.
            </p>
          </div>
        );
      case 'pending':
        return (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <div className="flex items-center space-x-2 text-yellow-800">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Ready for Admin Review</span>
            </div>
            <p className="text-yellow-700 text-sm mt-1">
              Your task is waiting for admin review and approval.
            </p>
          </div>
        );
      case 'approved':
        return (
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <Check className="w-4 h-4" />
              <span className="font-medium">Task Approved! ₹{task.rewardAmount} credited to your account</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Your earnings have been added to your account balance.
            </p>
          </div>
        );
      case 'rejected':
        return (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
            <div className="flex items-center space-x-2 text-red-800">
              <span className="font-medium">Task Rejected</span>
            </div>
            <p className="text-red-700 text-sm mt-1">
              {userSubmission.adminNotes || 'Please try again with a valid screenshot.'}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const getLinkLabel = () => {
    switch (task.platform) {
      case 'google':
        return 'Google Business Profile';
      case 'instagram':
        return task.taskType === 'follow' ? 'Instagram Profile' : 'Instagram Post';
      case 'youtube':
        return task.taskType === 'subscribe' ? 'YouTube Channel' : 'YouTube Video';
      case 'playstore':
        return 'Play Store App';
      default:
        return 'Link';
    }
  };

  return (
    <Card className="p-3 sm:p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <PlatformIcon className="w-4 h-4 text-blue-600" />
              <TaskTypeIcon className="w-4 h-4 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{task.title}</h3>
            <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                {getTaskTypeLabel(task.taskType)}
              </span>
              {needsStarRating && task.starRating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{task.starRating} stars</span>
                </div>
              )}
            </div>
          </div>
          <div className="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex-shrink-0 ml-2">
            ₹{task.rewardAmount}
          </div>
        </div>

        {/* Review/Comment Text */}
        {needsReviewText && task.reviewText && (
          <div className="bg-gray-50 p-2 sm:p-4 rounded-lg sm:rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {task.taskType === 'comment' ? 'Comment Text' : 'Review Text'}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyReview}
                icon={copied ? Check : Copy}
                className="text-xs sm:text-sm px-2 py-1"
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <p className="text-xs sm:text-sm text-gray-800 italic">"{task.reviewText}"</p>
          </div>
        )}

        {/* Task Link */}
        <div className="space-y-1 sm:space-y-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700">{getLinkLabel()}</label>
          <a
            href={task.taskLink || task.googleProfileLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-xs sm:text-sm active:text-blue-800 p-2 -m-2 rounded-lg"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="truncate">Open {getLinkLabel()}</span>
          </a>
        </div>

        {/* Task Instructions */}
        <div className="bg-blue-50 border border-blue-200 p-2 sm:p-4 rounded-lg sm:rounded-xl">
          <h4 className="font-medium text-blue-900 mb-3 text-sm sm:text-base">Instructions</h4>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 text-xs sm:text-sm">
            {task.platform === 'voting' ? (
              <>
                <li>Click the voting link below to open the voting page</li>
                <li>{task.reviewText ? `Follow instructions: ${task.reviewText}` : 'Cast your vote for the specified contestant'}</li>
                <li>Take a screenshot of your vote confirmation</li>
                <li>Upload the screenshot as proof</li>
              </>
            ) : (
              <>
                <li>Click the link above to open the {getLinkLabel()}</li>
                {task.taskType === 'review' && (
                  <>
                    <li>Click on "Write a review" or similar option</li>
                    <li>Give a {task.starRating}-star rating</li>
                    <li>Copy and paste the provided review text</li>
                    <li>Submit your review</li>
                  </>
                )}
                {task.taskType === 'comment' && (
                  <>
                    <li>Find the comment section</li>
                    <li>Copy and paste the provided comment text</li>
                    <li>Submit your comment</li>
                  </>
                )}
                {task.taskType === 'like' && (
                  <li>Click the like button on the post/video</li>
                )}
                {task.taskType === 'follow' && (
                  <li>Click the follow button on the profile</li>
                )}
                {task.taskType === 'subscribe' && (
                  <li>Click the subscribe button on the channel</li>
                )}
                {task.taskType === 'install_review' && (
                  <>
                    <li>Install the app from Play Store</li>
                    <li>Open the app and use it briefly</li>
                    <li>Return to Play Store and give a {task.starRating}-star rating</li>
                    <li>Copy and paste the provided review text</li>
                    <li>Submit your review</li>
                  </>
                )}
                <li>Take a clear screenshot showing the completed task</li>
                <li>Upload the screenshot using the button below</li>
              </>
            )}
          </ol>
        </div>

        {/* Multiple Submissions Info for YouTube & Instagram */}
        {(task.platform === 'youtube' || task.platform === 'instagram') && !userSubmission && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <p className="text-green-800 text-xs sm:text-sm font-medium mb-1">
              ✓ Multiple Submissions Allowed
            </p>
            <p className="text-green-700 text-xs sm:text-sm">
              You can complete multiple {task.platform === 'youtube' ? 'YouTube' : 'Instagram'} tasks to earn more rewards.
            </p>
            {task.taskType === 'comment' && (
              <p className="text-orange-700 text-xs sm:text-sm mt-2">
                <strong>⚠️ Note:</strong> Only 1 comment per video/post will be paid. Multiple comments on the same content won't be accepted.
              </p>
            )}
          </div>
        )}

        {/* Submission Status or Submit Button */}
        {userSubmission ? (
          getSubmissionStatus()
        ) : showSubmissionForm ? (
          <TaskSubmissionForm
            task={task}
            onSubmit={() => {
              setShowSubmissionForm(false);
            }}
            onCancel={() => setShowSubmissionForm(false)}
          />
        ) : (
          <Button
            onClick={() => {
              setShowSubmissionForm(true);
            }}
            className="w-full"
            size={window.innerWidth < 640 ? "md" : "lg"}
            icon={Upload}
          >
            {t('task.submit', { amount: task.rewardAmount })}
          </Button>
        )}
      </div>
    </Card>
  );
};