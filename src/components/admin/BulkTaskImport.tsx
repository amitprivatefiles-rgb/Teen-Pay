import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Upload, Download, Plus, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Company {
  id: string;
  name: string;
}

interface BulkTaskImportProps {
  onTasksImported: () => void;
  onCancel: () => void;
}

interface TaskRow {
  id: string;
  title: string;
  googleProfileLink: string;
  reviewText: string;
  starRating: number;
  task_price: number;
  maxUsers: number;
  status?: 'pending' | 'success' | 'error';
  error?: string;
}

export const BulkTaskImport: React.FC<BulkTaskImportProps> = ({ onTasksImported, onCancel }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tasks, setTasks] = useState<TaskRow[]>([
    {
      id: '1',
      title: '',
      googleProfileLink: '',
      reviewText: '',
      starRating: 5,
      task_price: 10,
      maxUsers: 1,
    }
  ]);
  const [importing, setImporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [importResults, setImportResults] = useState<TaskRow[]>([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data = await api.get('/companies'); const error = null;
setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const addRow = () => {
    const newRow: TaskRow = {
      id: Date.now().toString(),
      title: '',
      googleProfileLink: '',
      reviewText: '',
      starRating: 5,
      task_price: 10,
      maxUsers: 1,
    };
    setTasks([...tasks, newRow]);
  };

  const removeRow = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTask = (id: string, field: keyof TaskRow, value: any) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const validateTask = (task: TaskRow): string | null => {
    if (!selectedCompanyId) {
      return 'Please select a company';
    }
    if (!task.title.trim()) {
      return 'Task Title is required';
    }
    if (task.title.length < 5) {
      return 'Task Title must be at least 5 characters';
    }
    if (!task.googleProfileLink.trim()) {
      return 'Google Profile Link is required';
    }
    // Basic URL validation - allow any valid URL format
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(task.googleProfileLink)) {
      return 'Please enter a valid URL';
    }
    if (!task.reviewText.trim()) {
      return 'Review Text is required';
    }
    if (task.reviewText.length < 10) {
      return 'Review Text must be at least 10 characters';
    }
    if (task.starRating < 1 || task.starRating > 5) {
      return 'Star Rating must be between 1 and 5';
    }
    if (task.task_price < 1 || task.task_price > 1000) {
      return 'Task Price must be between ₹1 and ₹1000';
    }
    if (task.maxUsers < 1 || task.maxUsers > 100) {
      return 'Max Users must be between 1 and 100';
    }
    return null;
  };

  const handleImport = async () => {
    setImporting(true);
    const results: TaskRow[] = [];

    for (const task of tasks) {
      const validation = validateTask(task);
      if (validation) {
        results.push({ ...task, status: 'error', error: validation });
        continue;
      }

      try {
        const { data: createdTask, error: taskError } = await supabase
          .from('tasks')
          .insert({
            title: task.title,
            companyId: selectedCompanyId,
            platform: 'google',
            taskType: 'review',
            taskLink: task.googleProfileLink,
            googleProfileLink: task.googleProfileLink,
            reviewText: task.reviewText,
            starRating: task.starRating,
            rewardAmount: task.task_price,
            maxUsers: task.maxUsers,
            active: true,
            completed: false,
          })
          .select();

        if (taskError) throw taskError;

        results.push({ ...task, status: 'success' });
      } catch (error: any) {
        results.push({ ...task, status: 'error', error: error.message });
      }
    }

    setImportResults(results);
    setImporting(false);
    setShowPreview(true);
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const expectedHeaders = ['title', 'googleProfileLink', 'reviewText', 'starRating', 'task_price', 'maxUsers'];
      const isValidFormat = expectedHeaders.every(header => 
        headers.some(h => h.toLowerCase().includes(header.toLowerCase()))
      );

      if (!isValidFormat) {
        alert('Invalid CSV format. Please use the sample template.');
        return;
      }

      const newTasks: TaskRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= 6 && values[0]) {
          newTasks.push({
            id: Date.now().toString() + i,
            title: values[0] || '',
            googleProfileLink: values[1] || '',
            reviewText: values[2] || '',
            starRating: parseInt(values[3]) || 5,
            task_price: parseFloat(values[4]) || 10,
            maxUsers: parseInt(values[5]) || 1,
          });
        }
      }

      if (newTasks.length > 0) {
        setTasks(newTasks);
      }
    };
    reader.readAsText(file);
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      ['title', 'googleProfileLink', 'reviewText', 'starRating', 'task_price', 'maxUsers'],
      ['Review ABC Restaurant', 'https://maps.google.com/example', 'Great service and friendly staff!', '5', '10', '1'],
      ['Review XYZ Store', 'https://maps.google.com/example2', 'Outstanding customer service!', '5', '15', '1'],
      ['Review 123 Cafe', 'https://maps.google.com/example3', 'Amazing quality and fast delivery.', '4', '8', '1'],
    ];

    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_tasks_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const finishImport = () => {
    onTasksImported();
    setShowPreview(false);
    setImportResults([]);
    setSelectedCompanyId('');
    setTasks([{
      id: '1',
      title: '',
      googleProfileLink: '',
      reviewText: '',
      starRating: 5,
      task_price: 10,
      maxUsers: 1,
    }]);
  };

  if (showPreview) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Import Results</h2>
          <Button onClick={finishImport}>
            Done
          </Button>
        </div>

        <div className="space-y-4">
          {importResults.map((result, index) => (
            <Card key={result.id} className={`p-4 ${
              result.status === 'success' ? 'border-green-200 bg-green-50' :
              result.status === 'error' ? 'border-red-200 bg-red-50' : ''
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {result.status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium">
                      Row {index + 1}: Task Created
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {result.reviewText}
                  </p>
                  {result.error && (
                    <p className="text-sm text-red-600 mt-1">{result.error}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">₹{result.task_price}</div>
                  <div className="text-xs text-gray-500">{result.starRating} stars</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Import Summary</span>
          </div>
          <div className="mt-2 text-sm text-blue-700">
            <p>✅ Successful: {importResults.filter(r => r.status === 'success').length} rows</p>
            <p>❌ Failed: {importResults.filter(r => r.status === 'error').length} rows</p>
            <p>📊 Total Tasks Created: {importResults.filter(r => r.status === 'success').length}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Bulk Task Import</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={downloadSampleCSV}
            icon={Download}
            size="sm"
          >
            Download Template
          </Button>
          <Button
            variant="ghost"
            onClick={onCancel}
            size="sm"
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Company Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Company
        </label>
        <select
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Choose a company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      {/* CSV Upload */}
      <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 mb-2">Upload CSV file or add tasks manually</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVUpload}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Choose CSV File
          </label>
        </div>
      </div>

      {/* Manual Input Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                Task Title
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                Google Profile Link
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                Review Text
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                Stars
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                Price (₹)
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                Max Users
              </th>
              <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id}>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                    placeholder="Task title..."
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="url"
                    value={task.googleProfileLink}
                    onChange={(e) => updateTask(task.id, 'googleProfileLink', e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <textarea
                    value={task.reviewText}
                    onChange={(e) => updateTask(task.id, 'reviewText', e.target.value)}
                    placeholder="Review text..."
                    className="w-full px-2 py-1 border rounded text-sm resize-none"
                    rows={2}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <select
                    value={task.starRating}
                    onChange={(e) => updateTask(task.id, 'starRating', parseInt(e.target.value))}
                    className="w-full px-2 py-1 border rounded text-sm"
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    step="0.01"
                    value={task.task_price}
                    onChange={(e) => updateTask(task.id, 'task_price', parseFloat(e.target.value) || 1)}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={task.maxUsers}
                    onChange={(e) => updateTask(task.id, 'maxUsers', parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </td>
                <td className="border border-gray-300 px-2 py-1">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => removeRow(task.id)}
                    icon={Trash2}
                    disabled={tasks.length === 1}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={addRow}
          icon={Plus}
        >
          Add Row
        </Button>

        <div className="flex space-x-3">
          <div className="text-sm text-gray-600">
            Total Reviews: {tasks.length}
          </div>
          <Button
            onClick={handleImport}
            loading={importing}
            disabled={tasks.length === 0 || !selectedCompanyId}
          >
            {importing ? 'Importing...' : 'Import Tasks'}
          </Button>
        </div>
      </div>

      {/* Validation Info */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Validation Rules:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Company must be selected before importing</li>
          <li>• Task Title must be at least 5 characters</li>
          <li>• Google Profile Link must be a valid URL</li>
          <li>• Review Text must be at least 10 characters</li>
          <li>• Star Rating must be between 1-5</li>
          <li>• Task Price must be between ₹1-₹1000</li>
          <li>• Max Users must be between 1-100</li>
          <li>• Each row creates one individual task</li>
          <li>• Users can only submit one review per profile</li>
        </ul>
      </div>
    </Card>
  );
};