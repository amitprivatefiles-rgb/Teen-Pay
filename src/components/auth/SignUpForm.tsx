import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { User, Mail, Lock, Calendar, Eye, EyeOff } from 'lucide-react';

export const SignUpForm: React.FC = () => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 1 || age > 100) {
      setError('Please enter a valid age');
      setLoading(false);
      return;
    }

    if (!formData.name.trim()) {
      setError('Please enter your full name');
      setLoading(false);
      return;
    }

    try {
      await signUp(formData.email, formData.password, {
        age: age,
      });
      
      // Success - the user will be automatically logged in and redirected
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'An error occurred during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Join Engagement Experts</h2>
        <p className="text-gray-600 mt-2">Create your account to get started</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <Input
        label="Full Name"
        name="name"
        type="text"
        required
        value={formData.name}
        onChange={handleChange}
        icon={<User className="w-4 h-4" />}
        placeholder="Enter your full name"
      />

      <Input
        label="Email Address"
        name="email"
        type="email"
        required
        value={formData.email}
        onChange={handleChange}
        icon={<Mail className="w-4 h-4" />}
        placeholder="Enter your email"
      />


      <Input
        label="Age"
        name="age"
        type="number"
        required
        min="1"
        max="100"
        value={formData.age}
        onChange={handleChange}
        icon={<Calendar className="w-4 h-4" />}
        placeholder="Enter your age"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="w-4 h-4 text-gray-400" />
          </div>
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={handleChange}
            className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors pl-10 pr-10 py-3"
            placeholder="Create a strong password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="w-4 h-4 text-gray-400" />
          </div>
          <input
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors pl-10 pr-10 py-3"
            placeholder="Confirm your password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            ) : (
              <Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
        <p className="text-sm text-blue-800">
          <strong>Welcome to Engagement Experts:</strong> Join our community to participate in authentic brand engagement activities and earn rewards.
        </p>
      </div>

      <Button
        type="submit"
        loading={loading}
        className="w-full"
        size="lg"
      >
        Create Account
      </Button>
    </form>
  );
};