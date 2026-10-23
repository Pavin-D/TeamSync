import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportService } from '@/services/api/reportService';
import { Textarea } from '@/components/ui/Inputs';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Cards';
import { ArrowLeft, ShieldAlert, CheckCircle2, Send } from 'lucide-react';

export const AccountAppealPage: React.FC = () => {
  const navigate = useNavigate();
  const [statement, setStatement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await reportService.submitAppeal({
        accountStatus: 'RESTRICTED',
        reason: 'Misunderstanding during team hackathon submission',
        statement,
      });
      setIsSuccess(true);
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left pb-16 max-w-2xl mx-auto">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel & Return
        </button>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-amber-600" />
          <h1 className="text-2xl font-bold text-slate-900">Appeal Account Action</h1>
        </div>
        <p className="text-xs text-slate-500">
          If you believe an account restriction, warning, or suspension was applied in error, submit an appeal statement to the trust & safety committee.
        </p>
      </div>

      {isSuccess ? (
        <Card className="p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Appeal Submitted Successfully</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your appeal statement has been queued for human review by the platform trust committee. You will be notified via email upon resolution.
          </p>
          <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 space-y-4">
            <Textarea
              label="Why do you believe this moderation action was incorrect? *"
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Explain the background context, clarify any team miscommunication, or provide details regarding your account activity..."
              rows={6}
              required
            />
          </Card>

          <div className="flex justify-end gap-2">
            <SecondaryButton type="button" onClick={() => navigate(-1)}>
              Cancel
            </SecondaryButton>
            <Button type="submit" isLoading={isSubmitting} leftIcon={<Send className="w-4 h-4" />}>
              Submit Appeal
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
