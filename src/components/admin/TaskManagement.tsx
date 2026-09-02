import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TaskForm } from './TaskForm';
import { BulkTaskImport } from './BulkTaskImport';
import { Plus, Edit, Trash2, Star, Users, MapPin, Instagram, Youtube, Smartphone, Link, Copy, Check, Vote } from 'lucide-react';

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'google':
      return <MapPin className="w-4 h-4" />;
    case 'instagram':
      return <Instagram className="w-4 h-4" />;
    case 'youtube':
      return <Youtube className="w-4 h-4" />;
    case 'playstore':
      return <Smartphone className="w-4 h-4" />;
    case 'voting':
      return <Vote className="w-4 h-4" />;
    default:
      return <MapPin className="w-4 h-4" />;
  }
};

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'google':
      return 'bg-red-100 text-red-800';
    case 'instagram':
      return 'bg-pink-100 text-pink-800';
    case 'youtube':
      return 'bg-red-100 text-red-800';
    case 'playstore':
      return 'bg-green-100 text-green-800';
    case 'voting':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
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

interface TaskManagementProps {
  onStatsUpdate: () => void;
}

export const TaskManagement: React.FC<TaskManagementProps> = ({ onStatsUpdate }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    googleProfileLink: '',
    reviewText: '',
    starRating: 5,
    rewardAmount: 10,
    maxUsers: 50,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await api.get('/tasks');

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTask) {
        const { error } = await api.put(`/tasks/${editingTask.id}`, formData);
        if (error) throw error;
      } else {
        const { error } = await api.post('/tasks', { 
            ...formData, 
            active: true, // Tasks are immediately available to users
            rewardAmount: parseFloat(formData.rewardAmount.toString())
          });
        if (error) throw error;
      }

      setFormData({
        title: '',
        googleProfileLink: '',
        reviewText: '',
        starRating: 5,
        rewardAmount: 10,
        maxUsers: 50,
      });
      setShowForm(false);
      setEditingTask(null);
      fetchTasks();
      onStatsUpdate();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await api.delete(`/tasks/${taskId}`);

      if (error) throw error;
      fetchTasks();
      onStatsUpdate();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEdit = (task: any) => {
    setFormData({
      title: task.title,
      googleProfileLink: task.googleProfileLink,
      reviewText: task.reviewText,
      starRating: task.starRating,
      rewardAmount: task.rewardAmount,
      maxUsers: task.maxUsers,
    });
    setEditingTask(task);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            onClick={() => setShowBulkImport(true)}
          >
            Import Bulk Tasks
          </Button>
          <Button 
            icon={Plus}
            onClick={() => setShowForm(true)}
          >
            Add New Task
          </Button>
        </div>
      </div>

      {showForm && (
        <TaskForm
          onTaskCreated={() => {
            setShowForm(false);
            fetchTasks();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {showBulkImport && (
        <BulkTaskImport
          onTasksImported={() => {
            setShowBulkImport(false);
            fetchTasks();
            onStatsUpdate();
          }}
          onCancel={() => setShowBulkImport(false)}
        />
      )}

      <div className="grid gap-4">
        {tasks.map((task: any) => (
          <Card key={task.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getPlatformColor(task.platform)}`}>
                    {getPlatformIcon(task.platform)}
                    <span className="capitalize">{task.platform}</span>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {getTaskTypeLabel(task.taskType)}
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Company:</span> {task.companyId?.name || 'N/A'}
                </div>

                {task.reviewText && (
                  <p className="text-gray-600 text-sm mb-3">"{task.reviewText}"</p>
                )}

                <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600">
                  {task.starRating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{task.starRating} stars</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>Max {task.maxUsers} users</span>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    ₹{task.rewardAmount}
                  </div>
                  {task.active && (
                    <div className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                      Active
                    </div>
                  )}
                  {task.shareable && (
                    <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                      Shareable
                    </span>
                  )}
                  {task.completed && (
                    <div className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                      Completed
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                {task.shareable && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/task/${task.id}`);
                      setCopied(task.id);
                      setTimeout(() => setCopied(null), 2000);
                    }}
                  >
                    {copied === task.id ? '✓ Copied!' : 'Copy Link'}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(task)}
                  icon={Edit}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(task.id)}
                  icon={Trash2}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};