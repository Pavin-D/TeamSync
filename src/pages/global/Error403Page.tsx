import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const Error403Page: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 bg-rose-50 border border-rose-200 rounded-3xl flex items-center justify-center text-rose-600 shadow-subtle">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-1 max-w-md">
        <h1 className="text-3xl font-extrabold text-slate-900">403 — Access Restricted</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          You do not possess the necessary role authorization or permission gates to view this platform resource.
        </p>
      </div>

      <Button
        onClick={() => navigate('/')}
        leftIcon={<ArrowLeft className="w-4 h-4" />}
      >
        Return to Dashboard
      </Button>
    </div>
  );
};
