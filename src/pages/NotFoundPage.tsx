import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { FileQuestion, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-1">404 - Page Not Found</h1>
      <p className="text-xs text-slate-500 max-w-sm mb-6">
        The page or route you are looking for does not exist or has been moved.
      </p>
      <Button onClick={() => navigate('/')} leftIcon={<Home className="w-4 h-4" />}>
        Return to Home
      </Button>
    </div>
  );
};
