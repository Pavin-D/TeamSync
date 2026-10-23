import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Inputs';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { MentorFeedbackData } from '@/services/api/mentorService';
import { Star, Send } from 'lucide-react';

export interface MentorFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorshipId: string;
  mentorId: string;
  mentorName: string;
  onSubmitFeedback: (data: MentorFeedbackData) => Promise<void>;
}

export const MentorFeedbackModal: React.FC<MentorFeedbackModalProps> = ({
  isOpen,
  onClose,
  mentorshipId,
  mentorId,
  mentorName,
  onSubmitFeedback,
}) => {
  const [overallRating, setOverallRating] = useState(5);
  const [technicalKnowledgeRating, setTechnicalKnowledgeRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [helpfulnessRating, setHelpfulnessRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitFeedback({
        mentorshipId,
        mentorId,
        overallRating,
        technicalKnowledgeRating,
        communicationRating,
        helpfulnessRating,
        reviewText,
      });
      onClose();
    } catch {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, setRating: (r: number) => void) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="p-1 text-amber-400 hover:scale-110 transition"
        >
          <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400' : 'text-slate-300'}`} />
        </button>
      ))}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Rate Mentorship Experience with ${mentorName}`}>
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <p className="text-xs text-slate-500">
          Your honest rating and review help improve our mentor matching quality and recognize top industry mentors.
        </p>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Overall Rating *</span>
            {renderStars(overallRating, setOverallRating)}
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Technical Knowledge</span>
            {renderStars(technicalKnowledgeRating, setTechnicalKnowledgeRating)}
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Communication & Clarity</span>
            {renderStars(communicationRating, setCommunicationRating)}
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Helpfulness & Guidance</span>
            {renderStars(helpfulnessRating, setHelpfulnessRating)}
          </div>
        </div>

        <Textarea
          label="Write Your Review & Feedback *"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Arun was incredibly helpful! He reviewed our FastAPI server architecture, provided clear code recommendations, and gave great pitch advice for the hackathon final..."
          rows={4}
          required
        />

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <Button type="submit" isLoading={isSubmitting} leftIcon={<Send className="w-4 h-4" />}>
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  );
};
