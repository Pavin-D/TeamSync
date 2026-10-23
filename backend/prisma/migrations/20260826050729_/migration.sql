-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'PROFESSIONAL', 'COLLEGE_ADMIN', 'PLATFORM_ADMIN');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EventMode" AS ENUM ('ONLINE', 'OFFLINE', 'HYBRID');

-- CreateEnum
CREATE TYPE "TeamStatus" AS ENUM ('RECRUITING', 'FULL', 'CLOSED', 'COMPLETED', 'DISBANDED');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('LEAD', 'MEMBER');

-- CreateEnum
CREATE TYPE "JoinRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SkillSource" AS ENUM ('GITHUB', 'USER', 'VERIFIED');

-- CreateEnum
CREATE TYPE "MentorshipStatus" AS ENUM ('REQUESTED', 'ACCEPTED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TO_DO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
    "phone" TEXT,
    "profileImage" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "availableForTeamFormation" BOOLEAN NOT NULL DEFAULT true,
    "availableAsMentor" BOOLEAN NOT NULL DEFAULT false,
    "showLocationForDiscovery" BOOLEAN NOT NULL DEFAULT true,
    "locationUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "githubUrl" TEXT,
    "linkedinUrl" TEXT,
    "bio" TEXT,
    "yearOfStudy" INTEGER NOT NULL DEFAULT 1,
    "locationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "githubUrl" TEXT,
    "linkedinUrl" TEXT,
    "employeeIdDocument" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "bio" TEXT,
    "locationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessionalProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emailDomain" TEXT,
    "locationId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "organizer" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "registrationDeadline" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "mode" "EventMode" NOT NULL DEFAULT 'ONLINE',
    "isOnline" BOOLEAN NOT NULL DEFAULT true,
    "maxTeamSize" INTEGER NOT NULL DEFAULT 4,
    "minTeamSize" INTEGER NOT NULL DEFAULT 2,
    "status" "EventStatus" NOT NULL DEFAULT 'UPCOMING',
    "registrationUrl" TEXT,
    "allowsStudents" BOOLEAN NOT NULL DEFAULT true,
    "allowsProfessionals" BOOLEAN NOT NULL DEFAULT true,
    "allowsCrossCollegeTeams" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "domainName" TEXT,
    "requiredSkills" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "eventId" TEXT NOT NULL,
    "teamLeadId" TEXT NOT NULL,
    "maxMembers" INTEGER NOT NULL DEFAULT 4,
    "recruitmentOpen" BOOLEAN NOT NULL DEFAULT true,
    "scope" TEXT NOT NULL DEFAULT 'ALL_COLLEGES',
    "requiredSkills" TEXT,
    "githubRepoUrl" TEXT,
    "status" "TeamStatus" NOT NULL DEFAULT 'RECRUITING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "MemberRole" NOT NULL DEFAULT 'MEMBER',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamJoinRequest" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT,
    "status" "JoinRequestStatus" NOT NULL DEFAULT 'PENDING',
    "respondedAt" TIMESTAMP(3),
    "respondedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamJoinRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamInvitation" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "invitedUserId" TEXT NOT NULL,
    "invitedByUserId" TEXT NOT NULL,
    "message" TEXT,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamTask" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assignedTo" TEXT,
    "createdBy" TEXT NOT NULL,
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TaskStatus" NOT NULL DEFAULT 'TO_DO',
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamAnnouncement" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamAnnouncement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamActivity" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT,
    "activityType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamLink" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSkill" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "proficiency" INTEGER NOT NULL DEFAULT 50,
    "source" "SkillSource" NOT NULL DEFAULT 'USER',
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "UserSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GitHubAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "githubUsername" TEXT NOT NULL,
    "repositoriesAnalyzed" INTEGER NOT NULL DEFAULT 0,
    "languagesDetected" TEXT,
    "frameworksDetected" TEXT,
    "skillsDetected" TEXT,
    "analysisData" TEXT,
    "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GitHubAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "result" TEXT,
    "rank" INTEGER,
    "participatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ranking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collegeId" TEXT,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "rank" INTEGER NOT NULL DEFAULT 1,
    "period" TEXT NOT NULL DEFAULT 'ALL_TIME',
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ranking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mentorship" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "menteeTeamId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" "MentorshipStatus" NOT NULL DEFAULT 'REQUESTED',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mentorship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reportedUserId" TEXT NOT NULL,
    "teamId" TEXT,
    "eventId" TEXT,
    "reason" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "resolution" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamNotifications" BOOLEAN NOT NULL DEFAULT true,
    "eventNotifications" BOOLEAN NOT NULL DEFAULT true,
    "mentorshipNotifications" BOOLEAN NOT NULL DEFAULT true,
    "rankingNotifications" BOOLEAN NOT NULL DEFAULT true,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "StudentProfile"("userId");

-- CreateIndex
CREATE INDEX "StudentProfile_collegeId_idx" ON "StudentProfile"("collegeId");

-- CreateIndex
CREATE INDEX "StudentProfile_departmentId_idx" ON "StudentProfile"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalProfile_userId_key" ON "ProfessionalProfile"("userId");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "Event_mode_idx" ON "Event"("mode");

-- CreateIndex
CREATE INDEX "Event_startDate_idx" ON "Event"("startDate");

-- CreateIndex
CREATE INDEX "Team_eventId_idx" ON "Team"("eventId");

-- CreateIndex
CREATE INDEX "Team_teamLeadId_idx" ON "Team"("teamLeadId");

-- CreateIndex
CREATE INDEX "TeamMember_teamId_idx" ON "TeamMember"("teamId");

-- CreateIndex
CREATE INDEX "TeamMember_userId_idx" ON "TeamMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_teamId_userId_key" ON "TeamMember"("teamId", "userId");

-- CreateIndex
CREATE INDEX "TeamJoinRequest_teamId_idx" ON "TeamJoinRequest"("teamId");

-- CreateIndex
CREATE INDEX "TeamJoinRequest_userId_idx" ON "TeamJoinRequest"("userId");

-- CreateIndex
CREATE INDEX "TeamTask_teamId_idx" ON "TeamTask"("teamId");

-- CreateIndex
CREATE INDEX "TeamTask_assignedTo_idx" ON "TeamTask"("assignedTo");

-- CreateIndex
CREATE INDEX "TeamTask_status_idx" ON "TeamTask"("status");

-- CreateIndex
CREATE INDEX "TeamAnnouncement_teamId_idx" ON "TeamAnnouncement"("teamId");

-- CreateIndex
CREATE INDEX "TeamActivity_teamId_idx" ON "TeamActivity"("teamId");

-- CreateIndex
CREATE INDEX "TeamActivity_createdAt_idx" ON "TeamActivity"("createdAt");

-- CreateIndex
CREATE INDEX "TeamLink_teamId_idx" ON "TeamLink"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserSkill_userId_skillId_key" ON "UserSkill"("userId", "skillId");

-- CreateIndex
CREATE INDEX "Participation_eventId_idx" ON "Participation"("eventId");

-- CreateIndex
CREATE INDEX "Participation_userId_idx" ON "Participation"("userId");

-- CreateIndex
CREATE INDEX "Report_reportedUserId_idx" ON "Report"("reportedUserId");

-- CreateIndex
CREATE INDEX "Report_reporterId_idx" ON "Report"("reporterId");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "Notification_recipientId_idx" ON "Notification"("recipientId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_userId_key" ON "NotificationPreference"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_adminId_idx" ON "audit_logs"("adminId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalProfile" ADD CONSTRAINT "ProfessionalProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalProfile" ADD CONSTRAINT "ProfessionalProfile_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "College" ADD CONSTRAINT "College_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_teamLeadId_fkey" FOREIGN KEY ("teamLeadId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamJoinRequest" ADD CONSTRAINT "TeamJoinRequest_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamJoinRequest" ADD CONSTRAINT "TeamJoinRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInvitation" ADD CONSTRAINT "TeamInvitation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInvitation" ADD CONSTRAINT "TeamInvitation_invitedUserId_fkey" FOREIGN KEY ("invitedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamInvitation" ADD CONSTRAINT "TeamInvitation_invitedByUserId_fkey" FOREIGN KEY ("invitedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTask" ADD CONSTRAINT "TeamTask_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTask" ADD CONSTRAINT "TeamTask_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTask" ADD CONSTRAINT "TeamTask_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamAnnouncement" ADD CONSTRAINT "TeamAnnouncement_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamAnnouncement" ADD CONSTRAINT "TeamAnnouncement_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamActivity" ADD CONSTRAINT "TeamActivity_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamActivity" ADD CONSTRAINT "TeamActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamLink" ADD CONSTRAINT "TeamLink_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitHubAnalysis" ADD CONSTRAINT "GitHubAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentorship" ADD CONSTRAINT "Mentorship_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentorship" ADD CONSTRAINT "Mentorship_menteeTeamId_fkey" FOREIGN KEY ("menteeTeamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentorship" ADD CONSTRAINT "Mentorship_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_reportedUserId_fkey" FOREIGN KEY ("reportedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
