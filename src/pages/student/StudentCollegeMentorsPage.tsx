import React, { useEffect, useState } from 'react';
import { collegeService, StaffMember } from '@/services/api/collegeService';
import { mentorService, MentorshipRequest } from '@/services/api/mentorService';
import { teamService, Team } from '@/services/api/teamService';
import { Card, Avatar } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { Select, Textarea } from '@/components/ui/Inputs';
import { Modal } from '@/components/ui/Modal';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { UserCheck, Shield, Send, CheckCircle2, Clock, XCircle, GraduationCap, Search, Filter } from 'lucide-react';

export const StudentCollegeMentorsPage: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');

  // Request Modal State
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFilteredStaff = () => {
    let filtered = staffList;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || (s.jobTitle && s.jobTitle.toLowerCase().includes(q)));
    }
    if (filterDepartment !== 'ALL') {
      filtered = filtered.filter(s => (s.department && s.department.toLowerCase().includes(filterDepartment.toLowerCase())) || s.jobTitle?.toLowerCase().includes(filterDepartment.toLowerCase()));
    }
    return filtered;
  };

  const fetchCollegeStaff = async () => {
    setIsLoading(true);
    try {
      const [staffRes, requestsRes, teamsRes] = await Promise.all([
        collegeService.getCollegeStaff(),
        mentorService.getMentorshipRequests(),
        teamService.getMyTeams(),
      ]);

      if (staffRes.success && staffRes.data) {
        setStaffList(staffRes.data);
      }

      if (requestsRes.success && requestsRes.data) {
        setRequests(requestsRes.data);
      }

      if (teamsRes.success && teamsRes.data) {
        setUserTeams(teamsRes.data);
      }
    } catch {
      setStaffList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollegeStaff();
  }, []);

  const handleOpenRequestModal = (staff: StaffMember) => {
    setSelectedStaff(staff);
    if (userTeams.length > 0) {
      setSelectedTeamId(userTeams[0].id);
    }
    setRequestMessage('');
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaff || !selectedTeamId) return;
    setIsSubmitting(true);
    try {
      const res = await mentorService.sendMentorshipRequest({
        mentorId: selectedStaff.id,
        teamId: selectedTeamId,
        message: requestMessage || 'Student requested faculty guidance for project.',
      });

      if (res.success) {
        setSelectedStaff(null);
        fetchCollegeStaff();
        alert(`Mentorship request sent successfully to ${selectedStaff.name}!`);
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to send mentorship request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStaffRequestStatus = (staffId: string) => {
    const matched = requests.find((r) => r.mentorId === staffId);
    if (!matched) return null;
    return matched;
  };

  return (
    <div className="space-y-6 text-left pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <GraduationCap className="w-8 h-8 text-cyan-600 shrink-0" />
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Institution Faculty & Staff Mentors</h1>
          <p className="text-xs text-slate-500">Request project guidance and mentorship from faculty members belonging strictly to your college</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by mentor name or role..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 transition outline-none"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="bg-slate-50 border-none rounded-xl text-sm py-2 px-3 focus:ring-2 focus:ring-brand-500/20 text-slate-700 outline-none w-full sm:w-auto"
          >
            <option value="ALL">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">IT</option>
            <option value="Electronics">Electronics</option>
            <option value="Mechanical">Mechanical</option>
          </select>
        </div>
      </div>

      {/* Staff Members Roster */}
      {isLoading ? (
        <SkeletonLoader variant="card" count={3} />
      ) : getFilteredStaff().length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center my-4">
          <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Faculty Members Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search or filter criteria, or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getFilteredStaff().map((staff) => {
            const reqStatus = getStaffRequestStatus(staff.id);

            return (
              <Card key={staff.id} className="p-5 bg-white border-slate-200 flex flex-col justify-between space-y-4 hover:shadow-card transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={staff.name} size="md" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{staff.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{staff.jobTitle || 'Faculty Advisor'}</p>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{staff.email}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center gap-1 shrink-0">
                    <Shield className="w-3 h-3" /> {staff.role || 'Staff'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  {reqStatus ? (
                    reqStatus.status === 'ACCEPTED' ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Mentor Accepted
                      </span>
                    ) : reqStatus.status === 'REJECTED' ? (
                      <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-600" /> Request Declined
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-600 animate-spin" /> Pending Staff Review
                      </span>
                    )
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleOpenRequestModal(staff)}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold"
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                    >
                      Request Mentorship
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Request Mentorship Modal */}
      {selectedStaff && (
        <Modal isOpen={Boolean(selectedStaff)} onClose={() => setSelectedStaff(null)} title={`Request Mentorship from ${selectedStaff.name}`}>
          <form onSubmit={handleSendRequest} className="space-y-4 text-left p-1">
            <p className="text-xs text-slate-500">
              Select your team and write a note explaining your project architecture or guidance requirements.
            </p>

            <Select
              label="Select Your Team *"
              value={selectedTeamId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTeamId(e.target.value)}
              options={
                userTeams.length > 0
                  ? userTeams.map((t) => ({ value: t.id, label: `${t.name} (${t.eventName || 'Hackathon'})` }))
                  : [{ value: '', label: 'My Project Team' }]
              }
              required
            />

            <Textarea
              label="Mentorship Request Message"
              value={requestMessage}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRequestMessage(e.target.value)}
              placeholder="Explain how faculty guidance will support your hackathon project..."
              rows={4}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setSelectedStaff(null)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold">
                Send Mentorship Request
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
