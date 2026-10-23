import React, { useEffect, useState } from 'react';
import { eventService } from '@/services/api/eventService';
import { collegeService, DepartmentSummary } from '@/services/api/collegeService';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { X, Calendar, Globe, Building2, Building, ShieldAlert } from 'lucide-react';

interface PostHackathonModalProps {
  isOpen: boolean;
  onClose: () => void;
  collegeName?: string;
  collegeId?: string;
  onSuccess?: () => void;
}

export const PostHackathonModal: React.FC<PostHackathonModalProps> = ({
  isOpen,
  onClose,
  collegeName = 'Institutional Host',
  collegeId,
  onSuccess,
}) => {
  const [scope, setScope] = useState<'COLLEGE' | 'DEPARTMENT' | 'GLOBAL'>('COLLEGE');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [selectedDepartmentName, setSelectedDepartmentName] = useState('');
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState(collegeName);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [mode, setMode] = useState<'ONLINE' | 'OFFLINE' | 'HYBRID'>('ONLINE');
  const [location, setLocation] = useState('');
  const [minTeamSize, setMinTeamSize] = useState(1);
  const [maxTeamSize, setMaxTeamSize] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      collegeService.getDepartments().then((res) => {
        if (res.success && res.data) {
          setDepartments(res.data);
          if (res.data.length > 0) {
            setSelectedDepartmentId(res.data[0].departmentId);
            setSelectedDepartmentName(res.data[0].departmentName);
          }
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !startDate || !endDate || !registrationDeadline) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      let scopedDescription = description;
      if (scope === 'COLLEGE') {
        scopedDescription = `[INTRA_COLLEGE:${collegeId || ''}] ${description}`;
      } else if (scope === 'DEPARTMENT') {
        scopedDescription = `[DEPT_SCOPED:${collegeId || ''}:${selectedDepartmentId}:${selectedDepartmentName}] ${description}`;
      }

      const payload = {
        title,
        description: scopedDescription,
        organizer: organizer || collegeName,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        registrationDeadline: new Date(registrationDeadline).toISOString(),
        mode,
        location: mode !== 'ONLINE' ? location : 'Online Platform',
        minTeamSize: Number(minTeamSize),
        maxTeamSize: Number(maxTeamSize),
        scope: scope === 'DEPARTMENT' ? 'COLLEGE' : scope,
        collegeId: scope !== 'GLOBAL' ? collegeId : undefined,
        allowsCrossCollegeTeams: scope === 'GLOBAL',
        allowsStudents: true,
        allowsProfessionals: scope === 'GLOBAL',
      };

      const res = await eventService.createEvent(payload as any);
      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setErrorMsg((res as any).error?.message || (res as any).message || 'Failed to create hackathon event.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred while creating the hackathon.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8 text-left">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-extrabold block">
              Institutional Event Manager
            </span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" /> Post New Hackathon
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" /> {errorMsg}
            </div>
          )}

          {/* Scope Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Event Visibility Scope *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setScope('COLLEGE')}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                  scope === 'COLLEGE'
                    ? 'border-brand-600 bg-brand-50/70 text-brand-900 ring-2 ring-brand-500/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className={`p-2 rounded-xl ${scope === 'COLLEGE' ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">Whole College</h4>
                  <p className="text-[10px] text-slate-500">All departments in {collegeName}</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setScope('DEPARTMENT')}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                  scope === 'DEPARTMENT'
                    ? 'border-purple-600 bg-purple-50/70 text-purple-900 ring-2 ring-purple-500/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className={`p-2 rounded-xl ${scope === 'DEPARTMENT' ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">Specific Dept</h4>
                  <p className="text-[10px] text-slate-500">Scoped to one department</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setScope('GLOBAL')}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 ${
                  scope === 'GLOBAL'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className={`p-2 rounded-xl ${scope === 'GLOBAL' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold">Global Event</h4>
                  <p className="text-[10px] text-slate-500">Worldwide participants</p>
                </div>
              </button>
            </div>
          </div>

          {/* Department Selection if DEPARTMENT Scope */}
          {scope === 'DEPARTMENT' && (
            <div className="space-y-1.5 p-3.5 bg-purple-50/60 border border-purple-200 rounded-2xl">
              <label className="text-xs font-bold text-purple-900 block">Select Target Department *</label>
              <select
                value={selectedDepartmentId}
                onChange={(e) => {
                  const deptId = e.target.value;
                  setSelectedDepartmentId(deptId);
                  const found = departments.find((d) => d.departmentId === deptId);
                  if (found) setSelectedDepartmentName(found.departmentName);
                }}
                className="w-full px-3.5 py-2.5 bg-white border border-purple-300 rounded-xl text-xs font-bold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {departments.length === 0 ? (
                  <option value="">Computer Science & Engineering</option>
                ) : (
                  departments.map((d) => (
                    <option key={d.departmentId} value={d.departmentId}>
                      {d.departmentName}
                    </option>
                  ))
                )}
              </select>
              <p className="text-[10px] text-purple-700 font-medium">
                This hackathon will be exclusively visible to students enrolled in <strong>{selectedDepartmentName || 'the selected department'}</strong> of {collegeName}.
              </p>
            </div>
          )}

          {/* Title & Organizer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Hackathon Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI Innovation Challenge 2026"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Hosting Organizer *</label>
              <input
                type="text"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="e.g. Department of Computer Science"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Hackathon Overview & Rules *</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem statement, submission format, prizes, and guidelines..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Registration Deadline *</label>
              <input
                type="datetime-local"
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Start Date *</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">End Date *</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
          </div>

          {/* Mode & Team Sizes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Event Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="ONLINE">Virtual / Online</option>
                <option value="OFFLINE">On-Site / Offline</option>
                <option value="HYBRID">Hybrid Mode</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Min Team Size</label>
              <input
                type="number"
                min={1}
                max={10}
                value={minTeamSize}
                onChange={(e) => setMinTeamSize(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Max Team Size</label>
              <input
                type="number"
                min={1}
                max={10}
                value={maxTeamSize}
                onChange={(e) => setMaxTeamSize(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {mode !== 'ONLINE' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">On-Site Venue / Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Main Campus Auditorium, Block B"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <SecondaryButton type="button" onClick={onClose} size="sm">
              Cancel
            </SecondaryButton>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className={scope === 'COLLEGE' ? 'bg-brand-600 hover:bg-brand-700' : 'bg-indigo-600 hover:bg-indigo-700'}
            >
              {isSubmitting ? 'Publishing Event...' : scope === 'COLLEGE' ? 'Publish Intra-College Hackathon' : 'Publish Global Hackathon'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
