import React, { useState } from 'react';
import { RecommendedTeammate } from '@/services/api/studentService';
import { Card, Avatar, SkillBadge } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { Sparkles, MapPin, ChevronDown, ChevronUp, UserPlus, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface AiRecommendationsPreviewProps {
  recommendations?: RecommendedTeammate[];
}

export const AiRecommendationsPreview: React.FC<AiRecommendationsPreviewProps> = ({
  recommendations = [
    {
      id: 'rec_01',
      name: 'Aarav Kumar',
      role: 'Frontend Developer',
      college: 'Stanford University',
      department: 'Computer Science',
      skills: ['React', 'JavaScript', 'UI/UX'],
      matchScore: 92,
      distanceKm: 2.4,
      availability: 'AVAILABLE',
      hackathonsCount: 4,
      explanation: {
        title: 'Why this person?',
        points: [
          'Strong React & frontend skills match your backend focus',
          'Complementary skill set for upcoming AI Innovation Hackathon',
          'Located within 2.4 km for in-person collaboration',
          'Completed 4 previous hackathons with high ratings',
        ],
      },
    },
    {
      id: 'rec_02',
      name: 'Sophia Lin',
      role: 'ML & Data Engineer',
      college: 'MIT',
      department: 'AI & Data Science',
      skills: ['PyTorch', 'FastAPI', 'Python'],
      matchScore: 88,
      distanceKm: 5.1,
      availability: 'AVAILABLE',
      hackathonsCount: 6,
      explanation: {
        title: 'Why this person?',
        points: [
          'High machine learning model optimization experience',
          'FastAPI experience pairs directly with your frontend architecture',
          'Available for upcoming team events',
        ],
      },
    },
  ],
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-brand-600">
            <Sparkles className="w-4 h-4" />
            <h3 className="text-base font-bold text-slate-900">AI Teammate Recommendations</h3>
          </div>
          <p className="text-xs text-slate-500">
            Candidates recommended based on skills, project requirements, and complementary technical strengths
          </p>
        </div>
        <Link
          to="/student/recommendations"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 transition"
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((person) => {
          const isExpanded = expandedId === person.id;

          return (
            <Card key={person.id} hoverable className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={person.name} src={person.avatarUrl} size="lg" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{person.name}</h4>
                      <p className="text-xs font-semibold text-brand-600">{person.role}</p>
                      <p className="text-[11px] text-slate-500">{person.college}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      {person.matchScore}% Match
                    </span>
                    {person.distanceKm && (
                      <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" /> {person.distanceKm} km away
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {person.skills.map((s) => (
                    <SkillBadge key={s} skill={s} />
                  ))}
                </div>

                {/* Expandable Why This Person AI Explanation */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleExpand(person.id)}
                    className="flex items-center justify-between w-full text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl border border-slate-200 transition"
                  >
                    <span className="flex items-center gap-1.5 text-brand-700">
                      <Sparkles className="w-3.5 h-3.5" /> Why this person?
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 p-3 bg-brand-50/40 border border-brand-100 rounded-xl space-y-1 text-xs text-slate-700 animate-in fade-in">
                      {person.explanation.points.map((pt, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <Button size="sm" fullWidth leftIcon={<UserPlus className="w-3.5 h-3.5" />}>
                  Invite to Team
                </Button>
                <Button variant="outline" size="sm" fullWidth onClick={() => alert(`Viewing profile for ${person.name}`)}>
                  View Profile
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
