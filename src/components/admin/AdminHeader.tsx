import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Shield, LogOut } from 'lucide-react';

interface AdminHeaderProps {
  onSignOut: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onSignOut }) => {
  return (
    <Card className="p-6 mb-8 bg-gradient-to-r from-purple-50 to-blue-50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-full">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard 🛡️
            </h1>
            <p className="text-gray-600">Manage tasks, users, and platform operations</p>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={onSignOut}
          icon={LogOut}
          size="sm"
        >
          Sign Out
        </Button>
      </div>
    </Card>
  );
};