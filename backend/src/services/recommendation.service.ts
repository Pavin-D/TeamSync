import { prisma } from '../config/database';
import { calculateHaversineDistanceKm } from './location.service';

export interface SkillGapAnalysisResult {
  requiredSkills: string[];
  coveredSkills: string[];
  missingSkills: string[];
  coveragePercentage: number;
}

export interface RecommendationCandidateResult {
  candidateId: string;
  name: string;
  role: string;
  avatarUrl: string | null;
  college: string;
  department: string;
  company?: string | null;
  jobTitle?: string | null;
  compatibilityScore: number;
  skillMatchScore: number;
  teamComplementarityScore: number;
  githubEvidenceScore: number;
  locationScore: number;
  experienceScore: number;
  distanceKm: number | null;
  matchedSkills: string[];
  missingSkillsFilled: string[];
  githubEvidenceCount: number;
  category: 'BEST_MATCH' | 'SKILL_GAP_FILLER' | 'NEARBY_MATCH' | 'PROFESSIONAL_EXPERT' | 'MENTOR_MATCH';
  reason: string;
}

const WEIGHTS = {
  skillMatch: 0.45,
  teamComplementarity: 0.25,
  githubEvidence: 0.15,
  location: 0.10,
  experience: 0.05,
};

export class RecommendationService {
  public static async analyzeTeamSkillGap(teamId: string): Promise<SkillGapAnalysisResult> {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        event: true,
        members: {
          where: { status: 'ACTIVE' },
          include: {
            user: {
              include: {
                skills: { include: { skill: true } },
              },
            },
          },
        },
      },
    });

    if (!team) {
      const error: any = new Error('Team not found.');
      error.statusCode = 404;
      error.code = 'TEAM_NOT_FOUND';
      throw error;
    }

    const rawSkillsStr = team.requiredSkills || '';
    const eventSkillsStr = team.event.description || '';
    const requiredSkillsSet = new Set<string>();

    if (rawSkillsStr) {
      rawSkillsStr.split(',').forEach((s) => requiredSkillsSet.add(s.trim()));
    }

    if (requiredSkillsSet.size === 0) {
      const commonTechs = ['React', 'TypeScript', 'Node.js', 'Python', 'FastAPI', 'PyTorch', 'PostgreSQL', 'Docker', 'UI/UX'];
      commonTechs.forEach((tech) => {
        if (eventSkillsStr.toLowerCase().includes(tech.toLowerCase())) {
          requiredSkillsSet.add(tech);
        }
      });
    }

    if (requiredSkillsSet.size === 0) {
      requiredSkillsSet.add('Software Development');
    }

    const requiredSkills = Array.from(requiredSkillsSet);
    const coveredSkillsSet = new Set<string>();

    team.members.forEach((m) => {
      m.user.skills.forEach((us) => {
        requiredSkills.forEach((reqSkill) => {
          if (us.skill.name.toLowerCase() === reqSkill.toLowerCase()) {
            coveredSkillsSet.add(reqSkill);
          }
        });
      });
    });

    const coveredSkills = Array.from(coveredSkillsSet);
    const missingSkills = requiredSkills.filter((reqSkill) => !coveredSkillsSet.has(reqSkill));
    const coveragePercentage = Math.round((coveredSkills.length / (requiredSkills.length || 1)) * 100);

    return {
      requiredSkills,
      coveredSkills,
      missingSkills,
      coveragePercentage,
    };
  }

  public static async getTeammateRecommendations(
    currentUserId: string,
    options: { eventId?: string; teamId?: string; page?: number; limit?: number }
  ) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    let targetEvent: any = null;
    let targetTeam: any = null;
    let skillGap: SkillGapAnalysisResult = {
      requiredSkills: ['Software Development'],
      coveredSkills: [],
      missingSkills: ['Software Development'],
      coveragePercentage: 0,
    };

    if (options.teamId) {
      targetTeam = await prisma.team.findUnique({
        where: { id: options.teamId },
        include: {
          event: true,
          members: { where: { status: 'ACTIVE' } },
        },
      });

      if (targetTeam) {
        targetEvent = targetTeam.event;
        skillGap = await this.analyzeTeamSkillGap(options.teamId);

        if (targetTeam.members.length >= targetTeam.maxMembers) {
          return {
            event: targetEvent ? { id: targetEvent.id, title: targetEvent.title } : null,
            team: { id: targetTeam.id, name: targetTeam.name },
            skillGap,
            recommendations: [],
            message: 'Team capacity is full (4/4 members). Recruitment is closed.',
            pagination: { page, limit, total: 0, totalPages: 1 },
          };
        }
      }
    }

    if (!targetEvent && options.eventId) {
      targetEvent = await prisma.event.findUnique({ where: { id: options.eventId } });
    }

    const requestingUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      include: {
        studentProfile: { include: { location: true } },
        professionalProfile: { include: { location: true } },
      },
    });

    const userLoc = requestingUser?.studentProfile?.location || requestingUser?.professionalProfile?.location;
    const excludeUserIds = new Set<string>([currentUserId]);
    if (targetTeam) {
      targetTeam.members.forEach((m: any) => excludeUserIds.add(m.userId));
    }

    const candidates = await prisma.user.findMany({
      where: {
        id: { notIn: Array.from(excludeUserIds) },
        isActive: true,
        availableForTeamFormation: true,
        role: { in: ['STUDENT', 'PROFESSIONAL'] },
        ...(targetEvent && !targetEvent.allowsStudents ? { role: { not: 'STUDENT' } } : {}),
        ...(targetEvent && !targetEvent.allowsProfessionals ? { role: { not: 'PROFESSIONAL' } } : {}),
      },
      include: {
        studentProfile: { include: { college: true, department: true, location: true } },
        professionalProfile: { include: { location: true } },
        skills: { include: { skill: true } },
        githubAnalysis: { orderBy: { analyzedAt: 'desc' }, take: 1 },
        participations: true,
      },
    });

    // Exclude admins and college staff/faculty from teammate suggestions (only show students and work professionals)
    const eligibleCandidates = candidates.filter((c) => {
      if (c.role === 'COLLEGE_ADMIN' || c.role === 'PLATFORM_ADMIN') return false;
      if (c.role === 'PROFESSIONAL' && c.professionalProfile) {
        const title = (c.professionalProfile.jobTitle || '').toLowerCase();
        const staffKeywords = ['staff', 'professor', 'lecturer', 'faculty', 'teacher', 'instructor', 'academic'];
        if (staffKeywords.some((kw) => title.includes(kw))) {
          return false;
        }
      }
      return true;
    });

    const requiredSkills = skillGap.requiredSkills;
    const missingSkills = skillGap.missingSkills;

    const scoredCandidates: RecommendationCandidateResult[] = eligibleCandidates
      .map((c) => {
        const cLoc = c.studentProfile?.location || c.professionalProfile?.location;
        const candidateSkills = c.skills.map((us) => us.skill.name);

        const matchedSkills = requiredSkills.filter((reqSkill) =>
          candidateSkills.some((cs) => cs.toLowerCase() === reqSkill.toLowerCase())
        );
        const skillMatchNorm = matchedSkills.length / (requiredSkills.length || 1);

        const missingSkillsFilled = missingSkills.filter((missSkill) =>
          candidateSkills.some((cs) => cs.toLowerCase() === missSkill.toLowerCase())
        );
        const teamComplementarityNorm = missingSkillsFilled.length / (missingSkills.length || 1);

        const ghAnalysis = c.githubAnalysis[0];
        const githubConfidenceSum = c.skills
          .filter((us) => us.source === 'GITHUB')
          .reduce((acc, us) => acc + (us.confidence || 0.5), 0);
        const githubEvidenceNorm = Math.min(1.0, (ghAnalysis?.repositoriesAnalyzed || 0) * 0.1 + githubConfidenceSum * 0.2);

        let distanceKm: number | null = null;
        let locationNorm = 0.5;

        if (userLoc && cLoc) {
          distanceKm = calculateHaversineDistanceKm(
            userLoc.latitude,
            userLoc.longitude,
            cLoc.latitude,
            cLoc.longitude
          );
          locationNorm = Math.max(0, 1 - distanceKm / 100);
        }

        const experienceNorm = Math.min(1.0, c.participations.length * 0.25);

        const rawScore =
          skillMatchNorm * WEIGHTS.skillMatch +
          teamComplementarityNorm * WEIGHTS.teamComplementarity +
          githubEvidenceNorm * WEIGHTS.githubEvidence +
          locationNorm * WEIGHTS.location +
          experienceNorm * WEIGHTS.experience;

        const compatibilityScore = Math.round((0.72 + rawScore * 0.26) * 100);

        let category: RecommendationCandidateResult['category'] = 'BEST_MATCH';
        if (missingSkillsFilled.length > 0) category = 'SKILL_GAP_FILLER';
        else if (c.role === 'PROFESSIONAL') category = 'PROFESSIONAL_EXPERT';
        else if (distanceKm !== null && distanceKm <= 10) category = 'NEARBY_MATCH';

        const reasonParts: string[] = [];
        if (missingSkillsFilled.length > 0) {
          reasonParts.push(`Fills missing skill gap (${missingSkillsFilled.join(', ')})`);
        } else if (matchedSkills.length > 0) {
          reasonParts.push(`Matches required skills (${matchedSkills.join(', ')})`);
        }
        if (ghAnalysis && ghAnalysis.repositoriesAnalyzed > 0) {
          reasonParts.push(`Verified ${ghAnalysis.repositoriesAnalyzed} GitHub projects`);
        }
        if (distanceKm !== null) {
          reasonParts.push(`${distanceKm} km away in ${cLoc?.city || 'nearby area'}`);
        }
        if (reasonParts.length === 0) {
          reasonParts.push('Compatible student developer open for team formation');
        }

        return {
          candidateId: c.id,
          name: c.name,
          role: c.role,
          avatarUrl: c.profileImage || null,
          college: c.studentProfile?.college?.name || c.professionalProfile?.company || 'TeamSync Member',
          department: c.studentProfile?.department?.name || c.professionalProfile?.jobTitle || 'Developer',
          company: c.professionalProfile?.company || null,
          jobTitle: c.professionalProfile?.jobTitle || null,
          compatibilityScore: Math.max(50, compatibilityScore),
          skillMatchScore: Math.round(skillMatchNorm * 100),
          teamComplementarityScore: Math.round(teamComplementarityNorm * 100),
          githubEvidenceScore: Math.round(githubEvidenceNorm * 100),
          locationScore: Math.round(locationNorm * 100),
          experienceScore: Math.round(experienceNorm * 100),
          distanceKm,
          matchedSkills,
          missingSkillsFilled,
          githubEvidenceCount: ghAnalysis?.repositoriesAnalyzed || 0,
          category,
          reason: reasonParts.join('. ') + '.',
        };
      })
      .filter((c) => c.compatibilityScore >= 45);

    scoredCandidates.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    const total = scoredCandidates.length;
    const paginated = scoredCandidates.slice(skip, skip + limit);

    return {
      event: targetEvent ? { id: targetEvent.id, title: targetEvent.title } : null,
      team: targetTeam ? { id: targetTeam.id, name: targetTeam.name } : null,
      skillGap,
      recommendations: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public static async getRecommendedTeams(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { skills: { include: { skill: true } } },
    });

    const userSkills = user?.skills.map((us) => us.skill.name.toLowerCase()) || [];

    const teams = await prisma.team.findMany({
      where: {
        recruitmentOpen: true,
        status: 'RECRUITING',
      },
      include: {
        event: { select: { id: true, title: true } },
        teamLead: { select: { id: true, name: true, profileImage: true } },
        members: { where: { status: 'ACTIVE' } },
      },
    });

    const openTeams = teams.filter((t) => t.members.length < t.maxMembers);

    const scoredTeams = openTeams.map((t) => {
      const required = t.requiredSkills ? t.requiredSkills.split(',').map((s) => s.trim().toLowerCase()) : [];
      const matches = required.filter((r) => userSkills.includes(r));
      const score = Math.min(98, Math.max(65, 70 + matches.length * 15));

      return {
        id: t.id,
        teamId: t.id,
        name: t.name,
        teamName: t.name,
        eventName: t.event.title,
        teamLeadName: t.teamLead.name,
        membersCount: t.members.length,
        maxMembers: t.maxMembers,
        openSlots: t.maxMembers - t.members.length,
        requiredSkills: t.requiredSkills ? t.requiredSkills.split(',').map((s) => s.trim()) : [],
        compatibilityScore: score,
        reason: matches.length > 0 ? `Matches your ${matches.join(', ')} skills.` : 'Open recruiting team for upcoming event.',
      };
    });

    scoredTeams.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return scoredTeams;
  }

  public static async getRecommendedEvents(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { skills: { include: { skill: true } } },
    });

    const events = await prisma.event.findMany({
      where: {
        status: { in: ['UPCOMING', 'ONGOING'] },
      },
      orderBy: { startDate: 'asc' },
    });

    const userSkills = user?.skills.map((us) => us.skill.name.toLowerCase()) || [];

    const scoredEvents = events.map((evt) => {
      const desc = evt.description.toLowerCase();
      const matches = userSkills.filter((s) => desc.includes(s));
      const score = Math.min(99, Math.max(70, 75 + matches.length * 10));

      return {
        id: evt.id,
        eventId: evt.id,
        title: evt.title,
        eventName: evt.title,
        organizer: evt.organizer,
        startDate: evt.startDate.toISOString(),
        registrationDeadline: evt.registrationDeadline.toISOString(),
        mode: evt.mode,
        maxTeamSize: evt.maxTeamSize,
        compatibilityScore: score,
        reason: matches.length > 0 ? `Aligns with your ${matches.join(', ')} skills.` : 'Featured hackathon challenge.',
      };
    });

    scoredEvents.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return scoredEvents;
  }

  public static async getNearbyPeople(userId: string, radiusKm: number = 25) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: { include: { location: true } },
        professionalProfile: { include: { location: true } },
      },
    });

    const userLoc = user?.studentProfile?.location || user?.professionalProfile?.location;

    const people = await prisma.user.findMany({
      where: {
        id: { not: userId },
        isActive: true,
        showLocationForDiscovery: true,
      },
      include: {
        studentProfile: { include: { college: true, department: true, location: true } },
        professionalProfile: { include: { location: true } },
        skills: { include: { skill: true } },
      },
    });

    const nearby = people
      .map((p) => {
        const pLoc = p.studentProfile?.location || p.professionalProfile?.location;
        let distanceKm: number | null = null;
        if (userLoc && pLoc) {
          distanceKm = calculateHaversineDistanceKm(userLoc.latitude, userLoc.longitude, pLoc.latitude, pLoc.longitude);
        }

        return {
          id: p.id,
          userId: p.id,
          name: p.name,
          role: p.role,
          college: p.studentProfile?.college?.name || p.professionalProfile?.company || 'TeamSync Member',
          department: p.studentProfile?.department?.name || p.professionalProfile?.jobTitle || 'Developer',
          skills: p.skills.map((us) => us.skill.name),
          distanceKm,
          city: pLoc?.city || 'Nearby',
          state: pLoc?.state || '',
        };
      })
      .filter((p) => p.distanceKm !== null && p.distanceKm <= radiusKm);

    nearby.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

    return nearby;
  }

  public static async globalDiscoverySearch(query: string, type?: string) {
    const q = query.trim();
    if (!q) return { users: [], teams: [], events: [] };

    const filterType = (type || 'ALL').toUpperCase();

    const [users, teams, events] = await Promise.all([
      filterType === 'ALL' || filterType === 'USERS' || filterType === 'MENTORS'
        ? prisma.user.findMany({
            where: {
              isActive: true,
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
              ],
            },
            include: {
              studentProfile: { include: { college: true, department: true } },
              professionalProfile: true,
              skills: { include: { skill: true } },
            },
            take: 10,
          })
        : [],
      filterType === 'ALL' || filterType === 'TEAMS'
        ? prisma.team.findMany({
            where: {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { requiredSkills: { contains: q, mode: 'insensitive' } },
              ],
            },
            include: {
              event: { select: { title: true } },
              teamLead: { select: { name: true } },
              members: { where: { status: 'ACTIVE' } },
            },
            take: 10,
          })
        : [],
      filterType === 'ALL' || filterType === 'EVENTS'
        ? prisma.event.findMany({
            where: {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { organizer: { contains: q, mode: 'insensitive' } },
              ],
            },
            take: 10,
          })
        : [],
    ]);

    return {
      users: users.map((u) => ({
        id: u.id,
        name: u.name,
        role: u.role,
        college: u.studentProfile?.college?.name || u.professionalProfile?.company || 'TeamSync Member',
        skills: u.skills.map((us) => us.skill.name),
      })),
      teams: teams.map((t) => ({
        id: t.id,
        name: t.name,
        eventName: t.event.title,
        teamLeadName: t.teamLead.name,
        membersCount: t.members.length,
        maxMembers: t.maxMembers,
      })),
      events: events.map((e) => ({
        id: e.id,
        title: e.title,
        organizer: e.organizer,
        mode: e.mode,
      })),
    };
  }

  public static async getMentorRecommendations(currentUserId: string, _options: { eventId?: string }) {
    const requestingUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      include: {
        studentProfile: { include: { location: true } },
        professionalProfile: { include: { location: true } },
      },
    });

    const userLoc = requestingUser?.studentProfile?.location || requestingUser?.professionalProfile?.location;

    const mentors = await prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        role: 'PROFESSIONAL',
        isActive: true,
        availableAsMentor: true,
      },
      include: {
        professionalProfile: { include: { location: true } },
        skills: { include: { skill: true } },
        githubAnalysis: { orderBy: { analyzedAt: 'desc' }, take: 1 },
      },
    });

    const scoredMentors = mentors.map((m) => {
      const mLoc = m.professionalProfile?.location;
      let distanceKm: number | null = null;
      if (userLoc && mLoc) {
        distanceKm = calculateHaversineDistanceKm(
          userLoc.latitude,
          userLoc.longitude,
          mLoc.latitude,
          mLoc.longitude
        );
      }

      const skills = m.skills.map((us) => us.skill.name);

      return {
        candidateId: m.id,
        name: m.name,
        role: m.role,
        avatarUrl: m.profileImage || null,
        company: m.professionalProfile?.company || 'Industry Professional',
        jobTitle: m.professionalProfile?.jobTitle || 'Tech Leader',
        college: m.professionalProfile?.company || 'Industry Professional',
        department: m.professionalProfile?.jobTitle || 'Tech Mentor',
        compatibilityScore: Math.min(99, Math.max(70, 75 + skills.length * 4)),
        distanceKm,
        matchedSkills: skills,
        category: 'MENTOR_MATCH' as const,
        reason: `Verified industry professional at ${m.professionalProfile?.company || 'Company'} open for mentorship.${
          distanceKm !== null ? ` Located ${distanceKm} km away.` : ''
        }`,
      };
    });

    scoredMentors.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return {
      mentors: scoredMentors,
    };
  }
}
