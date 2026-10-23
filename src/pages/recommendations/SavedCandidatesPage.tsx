import React, { useEffect, useState } from 'react';
import { recommendationService, CandidateProfile } from '@/services/api/recommendationService';
import { AIRecommendationCard } from '@/components/recommendations/AIRecommendationCard';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const SavedCandidatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      setIsLoading(true);
      try {
        const res = await recommendationService.getSavedCandidates();
        setCandidates(res.data || []);
      } catch {
        setCandidates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaved();
  }, []);

  const handleSaveToggle = async (candId: string, isSaved: boolean) => {
    if (!isSaved) {
      await recommendationService.removeSavedCandidate(candId);
      setCandidates((prev) => prev.filter((c) => c.id !== candId));
    }
  };

  return (
    <div className="space-y-6 text-left pb-16">
      <div className="flex items-center gap-2">
        <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Saved Candidate Shortlist</h1>
          <p className="text-xs text-slate-500">Candidates you have bookmarked for potential team invitations</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonLoader variant="card" count={2} />
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-4">
          <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Saved Candidates</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            You haven't bookmarked any candidate profiles yet. Save recommended profiles to review later.
          </p>
          <Button onClick={() => navigate('/recommendations')} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Explore Teammate Recommendations
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {candidates.map((cand) => (
            <AIRecommendationCard
              key={cand.id}
              candidate={{ ...cand, isSaved: true }}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};
