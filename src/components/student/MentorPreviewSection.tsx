import React from 'react';
import { MentorPreview } from '@/services/api/studentService';
import { Card, Avatar, Badge, SkillBadge } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { Award, Briefcase, MessageSquare, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface MentorPreviewSectionProps {
  mentors?: MentorPreview[];
}

export const MentorPreviewSection: React.FC<MentorPreviewSectionProps> = ({
  mentors = [
    {
      id: 'm_01',
      name: 'Priya Sharma',
      jobTitle: 'Senior Software Engineer',
      company: 'Google',
      experienceYears: 8,
      skills: ['React', 'Node.js', 'Cloud Architecture'],
      availableForMentorship: true,
      distanceKm: 5.8,
    },
    {
      id: 'm_02',
      name: 'Marcus Vance',
      jobTitle: 'Lead AI Researcher',
      company: 'OpenAI Startup Fellow',
      experienceYears: 6,
      skills: ['PyTorch', 'System Design', 'LLMs'],
      availableForMentorship: true,
      distanceKm: 12.0,
    },
  ],
}) => {
  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-violet-600">
            <Award className="w-4 h-4" />
            <h3 className="text-base font-bold text-slate-900">Professionals & Industry Mentors</h3>
          </div>
          <p className="text-xs text-slate-500">Connect with industry experts for code reviews and project guidance</p>
        </div>
        <Link
          to="/student/mentors"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 transition"
        >
          <span>Explore Mentors</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mentors.map((mentor) => (
          <Card key={mentor.id} hoverable className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <Avatar name={mentor.name} src={mentor.avatarUrl} size="lg" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{mentor.name}</h4>
                    <p className="text-xs font-semibold text-violet-600 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> {mentor.jobTitle}
                    </p>
                    <p className="text-[11px] text-slate-500">{mentor.company} • {mentor.experienceYears} yrs exp</p>
                  </div>
                </div>

                {mentor.availableForMentorship && (
                  <Badge variant="success">Available as Mentor</Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {mentor.skills.map((s) => (
                  <SkillBadge key={s} skill={s} />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <Button size="sm" fullWidth leftIcon={<MessageSquare className="w-3.5 h-3.5" />}>
                Request Mentorship
              </Button>
              <Button variant="outline" size="sm" fullWidth onClick={() => alert(`View mentor profile ${mentor.name}`)}>
                View Profile
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
