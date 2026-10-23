import React from 'react';
import { NearbyPerson } from '@/services/api/locationService';
import { Card, Avatar, Badge, SkillBadge } from '@/components/ui/Cards';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { MapPin, Sparkles, UserPlus, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface NearbyPersonCardProps {
  person: NearbyPerson;
  isSelected?: boolean;
  onSelect?: () => void;
  onInvite?: (userId: string) => void;
}

export const NearbyPersonCard: React.FC<NearbyPersonCardProps> = ({
  person,
  isSelected = false,
  onSelect,
  onInvite,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      onClick={onSelect}
      className={`p-5 flex flex-col justify-between text-left relative transition-all ${
        isSelected ? 'ring-2 ring-brand-500 bg-brand-50/20 border-brand-300' : ''
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <Avatar name={person.name} src={person.avatarUrl} size="lg" />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-slate-900">{person.name}</h4>
                <Badge variant={person.userType === 'STUDENT' ? 'primary' : 'default'}>
                  {person.userType}
                </Badge>
              </div>
              <p className="text-xs font-semibold text-brand-600">{person.role}</p>
              <p className="text-[11px] text-slate-500">{person.college}</p>
            </div>
          </div>

          {person.compatibilityScore && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {person.compatibilityScore}% Match
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 bg-slate-50 p-2 rounded-xl">
          <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span className="font-semibold text-slate-800">Approx. {person.distanceKm} km away</span>
          <span className="text-slate-400">• {person.approximateArea}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {person.skills.map((s) => (
            <SkillBadge key={s} skill={s} />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <Button
          size="sm"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            if (onInvite) onInvite(person.id);
          }}
          leftIcon={<UserPlus className="w-3.5 h-3.5" />}
        >
          Invite
        </Button>
        <SecondaryButton
          size="sm"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/recommendations/${person.userId}`);
          }}
          rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
        >
          View Profile
        </SecondaryButton>
      </div>
    </Card>
  );
};
