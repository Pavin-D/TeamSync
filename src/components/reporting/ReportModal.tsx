import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Select, Textarea } from '@/components/ui/Inputs';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { reportService, ReportEntityType, ReportReason } from '@/services/api/reportService';
import { Flag, Upload, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: ReportEntityType;
  entityId: string;
  entityName: string;
  targetUserId?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  entityType,
  entityId,
  entityName,
  targetUserId,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [reason, setReason] = useState<ReportReason>('TEAM_ABANDONMENT');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    if (description.trim().length < 15) {
      setErrorMessage('Description must be at least 15 characters long.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await reportService.createReport({
        reportedUserId: targetUserId || entityId,
        teamId: entityType === 'TEAM' ? entityId : undefined,
        reportedEntityType: entityType,
        reportedEntityId: entityId,
        reportedEntityName: entityName,
        reason,
        description,
        evidenceFiles: selectedFiles,
      });

      if (res.success && res.data) {
        setSubmittedReportId(res.data.reportNumber || `#RPT-${res.data.id.slice(0, 6)}`);
        setStep(3);
      } else {
        setErrorMessage((res as any).error?.message || 'Failed to submit report.');
      }
    } catch {
      setErrorMessage('Unable to connect to reporting service. Please check input requirements.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Report ${entityType}: ${entityName}`}>
      {step === 3 && submittedReportId ? (
        <div className="space-y-4 text-center py-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold text-slate-900">Report Submitted</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Thank you for helping keep our platform safe. Your complaint has been queued for moderation review.
          </p>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 inline-block font-mono text-xs font-bold text-slate-800">
            Report Reference ID: {submittedReportId}
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Link
              to="/reports"
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
            >
              View My Reports
            </Link>
            <SecondaryButton onClick={onClose}>Close Window</SecondaryButton>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <p className="text-xs text-slate-500">
            Reports are confidential. The reported user or team will not be informed who filed this report.
          </p>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-800">
              {errorMessage}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Select
                label="Select Reason for Report *"
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportReason)}
                options={[
                  { value: 'TEAM_ABANDONMENT', label: 'Team Abandonment (Left project / Stopped responding)' },
                  { value: 'NON_PARTICIPATION', label: 'Non-Participation (Joined team but did not contribute)' },
                  { value: 'MISREPRESENTED_SKILLS', label: 'Misrepresented Skills (Claimed skills not possessed)' },
                  { value: 'HARASSMENT', label: 'Harassment or Bullying' },
                  { value: 'MISCONDUCT', label: 'Misconduct or Violation of Rules' },
                  { value: 'UNPROFESSIONAL_BEHAVIOUR', label: 'Unprofessional Conduct' },
                  { value: 'OTHER', label: 'Other Platform Violation' },
                ]}
              />

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-rose-900">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Important Notice</span>
                </div>
                <p>
                  Submitting false or malicious complaints violates our community guidelines and may result in restrictions on your account.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <SecondaryButton type="button" onClick={onClose}>
                  Cancel
                </SecondaryButton>
                <Button type="submit" leftIcon={<Flag className="w-4 h-4" />}>
                  Continue to Details →
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Textarea
                label="Provide Specific Details of the Incident (Min 15 chars) *"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened, relevant dates, missed team deliverables, or chat context..."
                rows={4}
                required
              />

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-900 block">Supporting Evidence (Optional)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:bg-slate-50 transition cursor-pointer">
                  <input
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="evidence-upload"
                  />
                  <label htmlFor="evidence-upload" className="cursor-pointer space-y-1 block">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                    <span className="text-xs font-semibold text-brand-600 block">Click to upload screenshots or PDFs</span>
                    <span className="text-[10px] text-slate-400 block">PNG, JPG, PDF up to 10MB</span>
                  </label>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="text-xs space-y-1 pt-1">
                    {selectedFiles.map((f, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl text-slate-700">
                        <span className="truncate max-w-[200px] font-semibold">{f.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{(f.size / 1024).toFixed(1)} KB</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-2 pt-2 border-t border-slate-100">
                <SecondaryButton type="button" onClick={() => setStep(1)} disabled={isSubmitting}>
                  ← Back
                </SecondaryButton>
                <Button type="submit" isLoading={isSubmitting} leftIcon={<Flag className="w-4 h-4" />}>
                  Submit Confidential Report
                </Button>
              </div>
            </div>
          )}
        </form>
      )}
    </Modal>
  );
};
