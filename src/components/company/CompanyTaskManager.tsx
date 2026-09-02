import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, Edit, Trash2, Eye, EyeOff, Copy, Check, Link, Share2 } from 'lucide-react';

interface CompanyTaskManagerProps {
  companyUser: any;
  onUpdate: () => void;
}

export const CompanyTaskManager: React.FC<CompanyTaskManagerProps> = ({ companyUser, onUpdate }) => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    platform: 'google',
    taskType: 'review',
    taskLink: '',
    googleProfileLink: '',
    reviewText: '',
    starRating: 5,
    rewardAmount: 10,
    maxUsers: 50,
    shareable: false,
  });

  useEffect(() => {
    loadTasks();
  }, [companyUser]);

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_submissions(count)
        `)
        .eq('companyId', companyUser.companyId)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const needsReviewFields = formData.platform === 'google' || formData.platform === 'playstore' || formData.taskType === 'comment';
      const needsStarRating = formData.platform === 'google' || formData.platform === 'playstore';

      const taskData: any = {
        title: formData.title,
        platform: formData.platform,
        taskType: formData.taskType,
        taskLink: formData.taskLink,
        googleProfileLink: formData.taskLink,
        rewardAmount: formData.rewardAmount,
        maxUsers: formData.maxUsers,
        shareable: formData.shareable,
      };

      if (needsReviewFields && formData.reviewText) {
        taskData.reviewText = formData.reviewText;
      }

      if (needsStarRating) {
        taskData.starRating = formData.starRating;
      }

      if (editingTask) {
        const { error } = await supabase
          .from('tasks')
          .update({
            ...taskData,
            updatedAt: new Date().toISOString(),
          })
          .eq('id', editingTask.id);

        if (error) throw error;
      } else {
        const { error } = await api.post('/tasks', {
            ...taskData,
            companyId: companyUser.companyId,
            created_by_company_user: companyUser.id,
            active: true,
            completed: false,
          });

        if (error) throw error;
      }

      resetForm();
      loadTasks();
      onUpdate();
    } catch (err: any) {
      console.error('Error saving task:', err);
      alert('Error saving task: ' + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      platform: 'google',
      taskType: 'review',
      taskLink: '',
      googleProfileLink: '',
      reviewText: '',
      starRating: 5,
      rewardAmount: 10,
      maxUsers: 50,
      shareable: false,
    });
    setShowForm(false);
    setEditingTask(null);
  };

  const handleEdit = (task: any) => {
    setFormData({
      title: task.title,
      platform: task.platform || 'google',
      taskType: task.taskType || 'review',
      taskLink: task.taskLink || task.googleProfileLink || '',
      googleProfileLink: task.googleProfileLink || '',
      reviewText: task.reviewText || '',
      starRating: task.starRating || 5,
      rewardAmount: task.rewardAmount,
      maxUsers: task.maxUsers,
      shareable: task.shareable || false,
    });
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const { error } = await api.delete(`/tasks/${taskId}`);

      if (error) throw error;
      loadTasks();
      onUpdate();
    } catch (err: any) {
      console.error('Error deleting task:', err);
      alert('Error deleting task: ' + err.message);
    }
  };

  const toggleActive = async (taskId: string, currentStatus: boolean) => {
    try {
      const { error } = await api.put(`/tasks/${taskId}`, { active: !currentStatus });

      if (error) throw error;
      loadTasks();
      onUpdate();
    } catch (err) {
      console.error('Error toggling task status:', err);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
        <Button icon={Plus} onClick={() => setShowForm(true)}>
          Create New Task
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h3>
            <Button variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Task Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  value={formData.platform}
                  onChange={(e) => {
                    const platform = e.target.value;
                    const typeMap: Record<string, string> = {
                      google: 'review', instagram: 'comment', youtube: 'comment',
                      playstore: 'install_review', voting: 'vote'
                    };
                    setFormData(prev => ({
                      ...prev,
                      platform,
                      taskType: typeMap[platform] || 'review',
                      shareable: platform === 'voting' ? true : prev.shareable,
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="google">Google Reviews</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="playstore">Play Store</option>
                  <option value="voting">Voting (Reality Shows)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Type</label>
                <select
                  value={formData.taskType}
                  onChange={(e) => setFormData(prev => ({ ...prev, taskType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {formData.platform === 'google' && <option value="review">Review</option>}
                  {formData.platform === 'instagram' && (
                    <>
                      <option value="comment">Comment on Post</option>
                      <option value="like">Like Post</option>
                      <option value="follow">Follow Account</option>
                    </>
                  )}
                  {formData.platform === 'youtube' && (
                    <>
                      <option value="comment">Comment on Video</option>
                      <option value="like">Like Video</option>
                      <option value="subscribe">Subscribe to Channel</option>
                    </>
                  )}
                  {formData.platform === 'playstore' && <option value="install_review">Install & Review App</option>}
                  {formData.platform === 'voting' && <option value="vote">Vote for Contestant</option>}
                </select>
              </div>
            </div>

            <Input
              label={formData.platform === 'google' ? 'Google Profile Link' : formData.platform === 'instagram' ? 'Instagram Profile/Post Link' : formData.platform === 'youtube' ? 'YouTube Video/Channel Link' : formData.platform === 'playstore' ? 'Play Store App Link' : 'Voting Link'}
              value={formData.taskLink || formData.googleProfileLink}
              onChange={(e) => setFormData(prev => ({ ...prev, taskLink: e.target.value, googleProfileLink: e.target.value }))}
              placeholder="https://..."
              required
            />

            {(formData.platform === 'google' || formData.platform === 'playstore' || formData.taskType === 'comment' || formData.platform === 'voting') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.platform === 'voting' ? 'Voting Instructions (Optional)' : 'Review/Comment Text'}
                </label>
                <textarea
                  value={formData.reviewText}
                  onChange={(e) => setFormData(prev => ({ ...prev, reviewText: e.target.value }))}
                  placeholder={formData.platform === 'voting' ? "Enter any specific voting instructions" : "Enter the text users should submit"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required={formData.platform !== 'voting'}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Star Rating"
                type="number"
                min="1"
                max="5"
                value={formData.starRating}
                onChange={(e) => setFormData(prev => ({ ...prev, starRating: parseInt(e.target.value) }))}
                required
              />

              <Input
                label="Reward Amount (₹)"
                type="number"
                min="1"
                value={formData.rewardAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, rewardAmount: parseFloat(e.target.value) }))}
                required
              />

              <Input
                label="Max Users"
                type="number"
                min="1"
                value={formData.maxUsers}
                onChange={(e) => setFormData(prev => ({ ...prev, maxUsers: parseInt(e.target.value) }))}
                required
              />
            </div>

            <div className="flex items-center space-x-2 py-2">
              <input
                type="checkbox"
                id="shareable"
                checked={formData.shareable}
                onChange={(e) => setFormData(prev => ({ ...prev, shareable: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="shareable" className="text-sm font-medium text-gray-700">
                Make this task shareable via link
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {editingTask ? 'Update Task' : 'Create Task'}
              </Button>
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 capitalize`}>
                    {task.platform}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    task.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.active ? 'Active' : 'Inactive'}
                  </span>
                  {task.shareable && (
                    <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                      Shareable
                    </span>
                  )}
                  {task.completed && (
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      Completed
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3">{task.reviewText || task.taskLink || task.googleProfileLink}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Rating:</span>
                    <span className="ml-2 font-medium text-gray-900">{task.starRating} ⭐</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Reward:</span>
                    <span className="ml-2 font-medium text-green-600">₹{task.rewardAmount}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Max Users:</span>
                    <span className="ml-2 font-medium text-gray-900">{task.maxUsers}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Submissions:</span>
                    <span className="ml-2 font-medium text-blue-600">
                      {task.task_submissions?.[0]?.count || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                {task.shareable && (
                  <Button
                    size="sm"
                    variant="outline"
                    icon={copied === task.id ? Check : Share2}
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/task/${task.id}`);
                      setCopied(task.id);
                      setTimeout(() => setCopied(null), 2000);
                    }}
                  >
                    {copied === task.id ? 'Copied!' : 'Share Link'}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleActive(task.id, task.active)}
                  icon={task.active ? EyeOff : Eye}
                >
                  {task.active ? 'Deactivate' : 'Activate'}
                </Button>
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

        {tasks.length === 0 && (
          <Card className="p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tasks Yet</h3>
            <p className="text-gray-600 mb-6">Create your first task to get started</p>
            <Button onClick={() => setShowForm(true)} icon={Plus}>
              Create First Task
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};
