import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { ROLES } from '@/constants/roles';

// Landing Page (Module 0)
import { TeamSyncLandingPage } from '@/pages/landing/TeamSyncLandingPage';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { StudentOnboardingPage } from '@/pages/auth/StudentOnboardingPage';
import { ProfessionalOnboardingPage } from '@/pages/auth/ProfessionalOnboardingPage';
import { CollegeOnboardingPage } from '@/pages/auth/CollegeOnboardingPage';
import { RegistrationSuccessPage } from '@/pages/auth/RegistrationSuccessPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';

// Student Pages
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { StudentProfilePage } from '@/pages/student/StudentProfilePage';
import { EditStudentProfilePage } from '@/pages/student/EditStudentProfilePage';
import { StudentPlaceholderPage } from '@/pages/student/StudentPlaceholders';

// Event Pages (Module 4)
import { EventDiscoveryPage } from '@/pages/events/EventDiscoveryPage';
import { EventDetailPage } from '@/pages/events/EventDetailPage';
import { ProblemStatementDetailPage } from '@/pages/events/ProblemStatementDetailPage';
import { MyEventsPage } from '@/pages/events/MyEventsPage';
import { SavedEventsPage } from '@/pages/events/SavedEventsPage';

// Team Pages (Module 5 & 16 Workspace)
import { TeamDiscoveryPage } from '@/pages/teams/TeamDiscoveryPage';
import { CollegeTeamsPage } from '@/pages/teams/CollegeTeamsPage';
import { DepartmentTeamsPage } from '@/pages/teams/DepartmentTeamsPage';
import { AllCollegesTeamsPage } from '@/pages/teams/AllCollegesTeamsPage';
import { GlobalTeamsPage } from '@/pages/teams/GlobalTeamsPage';
import { CreateTeamPage } from '@/pages/teams/CreateTeamPage';
import { EditTeamPage } from '@/pages/teams/EditTeamPage';
import { TeamDetailPage } from '@/pages/teams/TeamDetailPage';
import { TeamRequestsPage } from '@/pages/teams/TeamRequestsPage';
import { TeamInvitePage } from '@/pages/teams/TeamInvitePage';
import { MyTeamsPage } from '@/pages/teams/MyTeamsPage';
import { TeamLeadDashboardPage } from '@/pages/teams/TeamLeadDashboardPage';
import { StudentRequestsPage } from '@/pages/teams/StudentRequestsPage';
import { StudentInvitationsPage } from '@/pages/teams/StudentInvitationsPage';

// GitHub Analysis & Recommendations Pages (Module 6)
import { GitHubConnectPage } from '@/pages/github/GitHubConnectPage';
import { GitHubAnalysisPage } from '@/pages/github/GitHubAnalysisPage';
import { RepositoryDetailPage } from '@/pages/github/RepositoryDetailPage';
import { TeammateRecommendationsPage } from '@/pages/recommendations/TeammateRecommendationsPage';
import { CandidateProfilePage } from '@/pages/recommendations/CandidateProfilePage';
import { SavedCandidatesPage } from '@/pages/recommendations/SavedCandidatesPage';

// Location & OpenStreetMap Pages (Module 7)
import { LocationDiscoveryPage } from '@/pages/location/LocationDiscoveryPage';
import { LocationSettingsPage } from '@/pages/settings/LocationSettingsPage';
import { TeamPreferencesPage } from '@/pages/settings/TeamPreferencesPage';

// Mentorship System Pages (Module 8)
import { MentorDiscoveryPage } from '@/pages/mentor/MentorDiscoveryPage';
import { StudentCollegeMentorsPage } from '@/pages/student/StudentCollegeMentorsPage';
import { MentorDetailPage } from '@/pages/mentor/MentorDetailPage';
import { MentorSetupPage } from '@/pages/mentor/MentorSetupPage';
import { MentorDashboardPage } from '@/pages/mentor/MentorDashboardPage';
import { ActiveMentorshipPage } from '@/pages/mentor/ActiveMentorshipPage';
import { MentorshipHistoryPage } from '@/pages/mentor/MentorshipHistoryPage';

// Reporting, Trust & Safety Pages (Module 9)
import { MyReportsPage } from '@/pages/reporting/MyReportsPage';
import { ReportDetailPage } from '@/pages/reporting/ReportDetailPage';
import { AccountAppealPage } from '@/pages/reporting/AccountAppealPage';
import { CommunityGuidelinesPage } from '@/pages/reporting/CommunityGuidelinesPage';
import { AdminModerationDashboard } from '@/pages/admin/AdminModerationDashboard';
import { AdminReportDetailPage } from '@/pages/admin/AdminReportDetailPage';
import { AdminAuditLogsPage } from '@/pages/admin/AdminAuditLogsPage';

// Ranking, Participation & Analytics Pages (Module 10)
import { StudentRankingsPage } from '@/pages/rankings/StudentRankingsPage';
import { CollegeRankingsPage } from '@/pages/rankings/CollegeRankingsPage';
import { DepartmentRankingsPage } from '@/pages/rankings/DepartmentRankingsPage';
import { ParticipationHistoryPage } from '@/pages/rankings/ParticipationHistoryPage';
import { ParticipationDetailPage } from '@/pages/rankings/ParticipationDetailPage';
import { CollegeDetailPage } from '@/pages/rankings/CollegeDetailPage';

// College & Institutional Management Pages (Module 11)
import { CollegeDashboard } from '@/pages/college/CollegeDashboard';
import { CollegeStudentsPage } from '@/pages/college/CollegeStudentsPage';
import { CollegeStaffPage } from '@/pages/college/CollegeStaffPage';
import { StaffDashboardPage } from '@/pages/college/StaffDashboardPage';
import { CollegeStudentDetailPage } from '@/pages/college/CollegeStudentDetailPage';

import { CollegeDepartmentsPage } from '@/pages/college/CollegeDepartmentsPage';
import { CollegeDepartmentDetailPage } from '@/pages/college/CollegeDepartmentDetailPage';
import { CollegeEventsPage } from '@/pages/college/CollegeEventsPage';
import { CollegeTeamsPage as CollegeTeamsAdminPage } from '@/pages/college/CollegeTeamsPage';
import { CollegeMentorshipPage } from '@/pages/college/CollegeMentorshipPage';
import { CollegeInstitutionalRankingsPage } from '@/pages/college/CollegeInstitutionalRankingsPage';
import { CollegeAnalyticsPage } from '@/pages/college/CollegeAnalyticsPage';
import { CollegeAchievementsPage } from '@/pages/college/CollegeAchievementsPage';
import { CollegeProfilePage } from '@/pages/college/CollegeProfilePage';

// Master Platform Administration Pages (Module 12)
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminUserDetailPage } from '@/pages/admin/AdminUserDetailPage';
import { AdminInstitutionsPage } from '@/pages/admin/AdminInstitutionsPage';
import { AdminTeamsPage } from '@/pages/admin/AdminTeamsPage';
import { AdminEventsPage } from '@/pages/admin/AdminEventsPage';
import { AdminAnalyticsPage } from '@/pages/admin/AdminAnalyticsPage';
import { AdminMentorshipPage } from '@/pages/admin/AdminMentorshipPage';
import { AdminSystemActivityPage } from '@/pages/admin/AdminSystemActivityPage';
import { AdminProfilePage } from '@/pages/admin/AdminProfilePage';

// Global Search, Notification & UX Pages (Module 13)
import { NotificationsPage } from '@/pages/notifications/NotificationsPage';
import { NotificationSettingsPage } from '@/pages/settings/NotificationSettingsPage';
import { Error403Page } from '@/pages/global/Error403Page';

// Other Role Dashboards
import { ProfessionalDashboard } from '@/pages/professional/ProfessionalDashboard';
import { ComponentShowcase } from '@/pages/ComponentShowcase';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* TeamSync Public Landing Page (Module 0) */}
      <Route path="/" element={<TeamSyncLandingPage />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Navigate to="/signup/student" replace />} />
        <Route path="/signup/student" element={<StudentOnboardingPage />} />
        <Route path="/signup/professional" element={<ProfessionalOnboardingPage />} />
        <Route path="/signup/college" element={<CollegeOnboardingPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/registration-success" element={<RegistrationSuccessPage />} />
      </Route>

      {/* Main Layout Shell */}
      <Route element={<MainLayout />}>
        {/* Public Showcase & Error Pages */}
        <Route path="/showcase" element={<ComponentShowcase />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/403" element={<Error403Page />} />
        <Route path="/guidelines" element={<CommunityGuidelinesPage />} />

        {/* Global Notifications & Settings Routes (Module 13) */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.PROFESSIONAL, ROLES.COLLEGE, ROLES.ADMIN]} />}>
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
        </Route>

        {/* Master Platform Administration Routes (Module 12) */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/users/:userId" element={<AdminUserDetailPage />} />
          <Route path="/admin/students" element={<AdminUsersPage />} />
          <Route path="/admin/professionals" element={<AdminUsersPage />} />
          <Route path="/admin/colleges" element={<AdminInstitutionsPage />} />
          <Route path="/admin/colleges/:institutionId" element={<AdminInstitutionsPage />} />
          <Route path="/admin/institutions" element={<AdminInstitutionsPage />} />
          <Route path="/admin/institutions/:institutionId" element={<AdminInstitutionsPage />} />
          <Route path="/admin/teams" element={<AdminTeamsPage />} />
          <Route path="/admin/teams/:teamId" element={<AdminTeamsPage />} />
          <Route path="/admin/events" element={<AdminEventsPage />} />
          <Route path="/admin/events/:eventId" element={<AdminEventsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/reports" element={<AdminModerationDashboard />} />
          <Route path="/admin/reports/:reportId" element={<AdminReportDetailPage />} />
          <Route path="/admin/moderation" element={<AdminModerationDashboard />} />
          <Route path="/admin/moderation/reports/:reportId" element={<AdminReportDetailPage />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
          <Route path="/admin/mentorship" element={<AdminMentorshipPage />} />
          <Route path="/admin/activity" element={<AdminSystemActivityPage />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
        </Route>

        {/* College & Institutional Management Routes (Module 11) */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.COLLEGE, ROLES.ADMIN]} />}>
          <Route path="/college/dashboard" element={<CollegeDashboard />} />
          <Route path="/staff/dashboard" element={<StaffDashboardPage />} />
          <Route path="/college/students" element={<CollegeStudentsPage />} />
          <Route path="/college/staff" element={<CollegeStaffPage />} />
          <Route path="/college/students/:studentId" element={<CollegeStudentDetailPage />} />
          <Route path="/college/departments" element={<CollegeDepartmentsPage />} />
          <Route path="/college/departments/:departmentId" element={<CollegeDepartmentDetailPage />} />
          <Route path="/college/events" element={<CollegeEventsPage />} />
          <Route path="/college/teams" element={<CollegeTeamsAdminPage />} />
          <Route path="/college/mentorship" element={<CollegeMentorshipPage />} />
          <Route path="/college/ranking" element={<CollegeInstitutionalRankingsPage />} />
          <Route path="/college/rankings/students" element={<CollegeInstitutionalRankingsPage />} />
          <Route path="/college/rankings/departments" element={<CollegeDepartmentsPage />} />
          <Route path="/college/analytics" element={<CollegeAnalyticsPage />} />
          <Route path="/college/achievements" element={<CollegeAchievementsPage />} />
          <Route path="/college/profile" element={<CollegeProfilePage />} />
        </Route>

        {/* Ranking, Participation & Analytics Routes (Module 10) */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.PROFESSIONAL, ROLES.COLLEGE, ROLES.ADMIN]} />}>
          <Route path="/rankings/students" element={<StudentRankingsPage />} />
          <Route path="/student/rankings" element={<StudentRankingsPage />} />
          <Route path="/rankings/colleges" element={<CollegeRankingsPage />} />
          <Route path="/rankings/departments" element={<DepartmentRankingsPage />} />
          <Route path="/participation" element={<ParticipationHistoryPage />} />
          <Route path="/profile/participation" element={<ParticipationHistoryPage />} />
          <Route path="/participation/:participationId" element={<ParticipationDetailPage />} />
          <Route path="/colleges/:collegeId" element={<CollegeDetailPage />} />
        </Route>

        {/* User Reporting & Safety Routes (Module 9) */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.PROFESSIONAL, ROLES.COLLEGE, ROLES.ADMIN]} />}>
          <Route path="/reports" element={<MyReportsPage />} />
          <Route path="/reports/:reportId" element={<ReportDetailPage />} />
          <Route path="/appeals" element={<AccountAppealPage />} />
        </Route>

        {/* Admin Moderation Routes (Module 9) */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/admin/moderation" element={<AdminModerationDashboard />} />
          <Route path="/admin/moderation/reports/:reportId" element={<AdminReportDetailPage />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
        </Route>

        {/* Mentorship Routes (Module 8) */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.PROFESSIONAL, ROLES.COLLEGE, ROLES.ADMIN]} />}>
          <Route path="/student/college-mentors" element={<StudentCollegeMentorsPage />} />
          <Route path="/mentors" element={<MentorDiscoveryPage />} />
          <Route path="/student/mentors" element={<MentorDiscoveryPage />} />
          <Route path="/events/:eventId/mentors" element={<MentorDiscoveryPage />} />
          <Route path="/teams/:teamId/mentors" element={<MentorDiscoveryPage />} />
          <Route path="/mentors/:mentorId" element={<MentorDetailPage />} />
          <Route path="/mentor/setup" element={<MentorSetupPage />} />
          <Route path="/mentor/dashboard" element={<MentorDashboardPage />} />
          <Route path="/professional/mentor-dashboard" element={<MentorDashboardPage />} />
          <Route path="/mentorship/:mentorshipId" element={<ActiveMentorshipPage />} />
          <Route path="/mentorship/history" element={<MentorshipHistoryPage />} />
        </Route>

        {/* Location & Radius Search Routes (Module 7) */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.PROFESSIONAL, ROLES.COLLEGE, ROLES.ADMIN]} />}>
          <Route path="/nearby" element={<LocationDiscoveryPage />} />
          <Route path="/discover/nearby" element={<LocationDiscoveryPage />} />
          <Route path="/events/:eventId/nearby" element={<LocationDiscoveryPage />} />
          <Route path="/teams/:teamId/nearby" element={<LocationDiscoveryPage />} />
          <Route path="/settings" element={<LocationSettingsPage />} />
          <Route path="/student/settings" element={<LocationSettingsPage />} />
          <Route path="/settings/location" element={<LocationSettingsPage />} />
          <Route path="/profile/location" element={<LocationSettingsPage />} />
          <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
          <Route path="/settings/team-preferences" element={<TeamPreferencesPage />} />
        </Route>

        {/* GitHub & AI Recommendation Routes (Module 6) */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.PROFESSIONAL, ROLES.COLLEGE, ROLES.ADMIN]} />}>
          <Route path="/profile" element={<Navigate to="/student/profile" replace />} />
          <Route path="/profile/edit" element={<Navigate to="/student/profile/edit" replace />} />
          <Route path="/profile/github" element={<GitHubConnectPage />} />
          <Route path="/profile/skill-analysis" element={<GitHubAnalysisPage />} />
          <Route path="/github-analysis" element={<GitHubAnalysisPage />} />
          <Route path="/github-analysis/repository/:repositoryId" element={<RepositoryDetailPage />} />
          <Route path="/recommendations" element={<TeammateRecommendationsPage />} />
          <Route path="/events/:eventId/recommendations" element={<TeammateRecommendationsPage />} />
          <Route path="/events/:eventId/problems/:problemId/recommendations" element={<TeammateRecommendationsPage />} />
          <Route path="/teams/:teamId/recommendations" element={<TeammateRecommendationsPage />} />
          <Route path="/recommendations/:userId" element={<CandidateProfilePage />} />
          <Route path="/candidates/:userId" element={<CandidateProfilePage />} />
          <Route path="/candidates/:candidateId" element={<CandidateProfilePage />} />
          <Route path="/students/:userId" element={<CandidateProfilePage />} />
          <Route path="/saved-candidates" element={<SavedCandidatesPage />} />
        </Route>

        {/* Reusable Event Routes (Module 4) */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.PROFESSIONAL, ROLES.COLLEGE, ROLES.ADMIN]} />}>
          <Route path="/events" element={<EventDiscoveryPage />} />
          <Route path="/events/my-events" element={<MyEventsPage />} />
          <Route path="/events/saved" element={<SavedEventsPage />} />
          <Route path="/events/:eventId" element={<EventDetailPage />} />
          <Route path="/events/:eventId/problems/:problemId" element={<ProblemStatementDetailPage />} />
          <Route path="/events/:eventId/find-team" element={<TeamDiscoveryPage />} />
          <Route path="/events/:eventId/create-team" element={<CreateTeamPage />} />
          <Route path="/events/:eventId/join-team" element={<TeamDiscoveryPage />} />
        </Route>

        {/* Reusable Team Routes (Module 5 & Module 16 Workspace) */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.PROFESSIONAL, ROLES.COLLEGE, ROLES.ADMIN]} />}>
          <Route path="/teams" element={<TeamDiscoveryPage />} />
          <Route path="/teams/create" element={<CreateTeamPage />} />
          <Route path="/teams/college" element={<CollegeTeamsPage />} />
          <Route path="/teams/department" element={<DepartmentTeamsPage />} />
          <Route path="/teams/all-colleges" element={<AllCollegesTeamsPage />} />
          <Route path="/teams/global" element={<GlobalTeamsPage />} />
          <Route path="/teams/invite" element={<TeamInvitePage />} />
          <Route path="/teams/:teamId/edit" element={<EditTeamPage />} />
          <Route path="/teams/:teamId/requests" element={<TeamRequestsPage />} />
          <Route path="/teams/:teamId/invite" element={<TeamInvitePage />} />
          <Route path="/teams/:teamId" element={<TeamDetailPage />} />
          <Route path="/team/:teamId" element={<TeamDetailPage />} />
        </Route>

        {/* Protected Student Routes (STUDENT role only) */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />
          <Route path="/student/profile/edit" element={<EditStudentProfilePage />} />
          <Route path="/student/teams" element={<MyTeamsPage />} />
          <Route path="/student/team-lead" element={<TeamLeadDashboardPage />} />
          <Route path="/student/requests" element={<StudentRequestsPage />} />
          <Route path="/student/invitations" element={<StudentInvitationsPage />} />
          <Route path="/student/recommendations" element={<TeammateRecommendationsPage />} />
          <Route path="/student/nearby" element={<LocationDiscoveryPage />} />

          {/* Student Sub-route Placeholders */}
          <Route
            path="/student/college"
            element={<StudentPlaceholderPage title="My College Info" description="View student roster, college leaderboards, and institutional hackathon achievements." />}
          />
          <Route
            path="/student/department"
            element={<StudentPlaceholderPage title="My Department" description="Discover departmental peers, project showcases, and course projects." />}
          />
          <Route
            path="/student/all-colleges"
            element={<StudentPlaceholderPage title="All Colleges Directory" description="Explore participating universities, inter-college events, and institutional rankings." />}
          />
          <Route
            path="/student/teammates"
            element={<StudentPlaceholderPage title="Find Teammates" description="Search student talent by tech stack, availability, and hackathon experience." />}
          />
        </Route>

        {/* Protected Professional Routes */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.PROFESSIONAL]} />}>
          <Route path="/professional/dashboard" element={<ProfessionalDashboard />} />
          <Route path="/professional/teams" element={<MyTeamsPage />} />
          <Route path="/professional/team-lead" element={<TeamLeadDashboardPage />} />
          <Route path="/professional/requests" element={<StudentRequestsPage />} />
          <Route path="/professional/invitations" element={<StudentInvitationsPage />} />
          <Route path="/professional/recommendations" element={<TeammateRecommendationsPage />} />
          <Route path="/professional/nearby" element={<LocationDiscoveryPage />} />
          <Route path="/professional/*" element={<ProfessionalDashboard />} />
        </Route>

        {/* Catch-All 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
