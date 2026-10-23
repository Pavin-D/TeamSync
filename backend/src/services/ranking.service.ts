import { prisma } from '../config/database';

export interface RankingWeights {
  winner: number;
  runnerUp: number;
  finalist: number;
  participation: number;
  leadership: number;
}

export const DEFAULT_RANKING_WEIGHTS: RankingWeights = {
  winner: 50,
  runnerUp: 35,
  finalist: 25,
  participation: 15,
  leadership: 5,
};

export class RankingService {
  public static async getStudentRankings(queryParams: any) {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 20;
    const skip = (page - 1) * limit;

    const collegeId = queryParams.collegeId || null;
    const departmentId = queryParams.departmentId || null;
    const period = queryParams.period || 'ALL_TIME'; // 'ALL_TIME', 'YEAR', 'MONTH'

    // Build date filter if period is specified
    let dateFilter: any = {};
    const now = new Date();
    if (period === 'YEAR') {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      dateFilter = { participatedAt: { gte: yearStart } };
    } else if (period === 'MONTH') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = { participatedAt: { gte: monthStart } };
    }

    // Build user filter for student role and optional college/department
    const studentWhere: any = {
      role: 'STUDENT',
      isActive: true,
      ...(collegeId || departmentId
        ? {
            studentProfile: {
              ...(collegeId ? { collegeId } : {}),
              ...(departmentId ? { departmentId } : {}),
            },
          }
        : {}),
    };

    const students = await prisma.user.findMany({
      where: studentWhere,
      include: {
        studentProfile: {
          include: {
            college: { select: { id: true, name: true } },
            department: { select: { id: true, name: true } },
          },
        },
        participations: {
          where: dateFilter,
        },
        teamLeadTeams: true,
      },
    });

    // Compute score for each student based on real participation records
    const scoredStudents = students.map((s) => {
      let score = 0;
      let wins = 0;
      let runnerUps = 0;
      let finalistCount = 0;
      let participationsCount = s.participations.length;

      s.participations.forEach((p) => {
        const res = p.result ? p.result.toUpperCase() : 'PARTICIPATED';
        if (res === 'WINNER' || res === 'WIN') {
          score += DEFAULT_RANKING_WEIGHTS.winner;
          wins += 1;
        } else if (res === 'RUNNER_UP' || res === 'RUNNER-UP' || res === 'SECOND') {
          score += DEFAULT_RANKING_WEIGHTS.runnerUp;
          runnerUps += 1;
        } else if (res === 'FINALIST') {
          score += DEFAULT_RANKING_WEIGHTS.finalist;
          finalistCount += 1;
        } else {
          score += DEFAULT_RANKING_WEIGHTS.participation;
        }
      });

      // Leadership bonus
      score += s.teamLeadTeams.length * DEFAULT_RANKING_WEIGHTS.leadership;

      return {
        studentId: s.id,
        name: s.name,
        email: s.email,
        profileImage: s.profileImage,
        college: s.studentProfile?.college?.name || 'N/A',
        collegeId: s.studentProfile?.college?.id || null,
        department: s.studentProfile?.department?.name || 'N/A',
        departmentId: s.studentProfile?.department?.id || null,
        score,
        participationsCount,
        wins,
        runnerUps,
        finalistCount,
        teamsLedCount: s.teamLeadTeams.length,
      };
    });

    // Sort deterministically: score DESC, wins DESC, finalistCount DESC, participationsCount DESC, name ASC
    scoredStudents.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.finalistCount !== a.finalistCount) return b.finalistCount - a.finalistCount;
      if (b.participationsCount !== a.participationsCount) return b.participationsCount - a.participationsCount;
      return a.name.localeCompare(b.name);
    });

    // Assign rank indices (1-indexed)
    const rankedStudents = scoredStudents.map((s, index) => ({
      rank: index + 1,
      ...s,
    }));

    const paginated = rankedStudents.slice(skip, skip + limit);

    return {
      rankings: paginated,
      pagination: {
        page,
        limit,
        total: rankedStudents.length,
        totalPages: Math.ceil(rankedStudents.length / limit) || 1,
      },
    };
  }

  public static async getCollegeRankings(queryParams: any) {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 20;
    const skip = (page - 1) * limit;

    const colleges = await prisma.college.findMany({
      include: {
        students: {
          include: {
            user: {
              include: {
                participations: true,
                teamLeadTeams: true,
              },
            },
          },
        },
      },
    });

    const scoredColleges = colleges.map((c) => {
      let totalStudents = c.students.length;
      let activeParticipantsCount = 0;
      let totalEventsCount = 0;
      let totalWins = 0;
      let totalRunnerUps = 0;
      let totalFinalists = 0;
      let totalScore = 0;

      c.students.forEach((sp) => {
        if (!sp.user) return;

        const pCount = sp.user.participations.length;
        if (pCount > 0) activeParticipantsCount += 1;
        totalEventsCount += pCount;

        sp.user.participations.forEach((p) => {
          const res = p.result ? p.result.toUpperCase() : 'PARTICIPATED';
          if (res === 'WINNER' || res === 'WIN') {
            totalScore += DEFAULT_RANKING_WEIGHTS.winner;
            totalWins += 1;
          } else if (res === 'RUNNER_UP' || res === 'RUNNER-UP' || res === 'SECOND') {
            totalScore += DEFAULT_RANKING_WEIGHTS.runnerUp;
            totalRunnerUps += 1;
          } else if (res === 'FINALIST') {
            totalScore += DEFAULT_RANKING_WEIGHTS.finalist;
            totalFinalists += 1;
          } else {
            totalScore += DEFAULT_RANKING_WEIGHTS.participation;
          }
        });
      });

      const avgStudentScore = totalStudents > 0 ? Math.round(totalScore / totalStudents) : 0;
      const completionRate = totalEventsCount > 0 ? Math.min(100, Math.round(((totalWins + totalRunnerUps + totalFinalists) / totalEventsCount) * 100)) : 0;

      return {
        collegeId: c.id,
        collegeName: c.name,
        totalStudents,
        activeParticipantsCount,
        totalEventsCount,
        totalWins,
        totalRunnerUps,
        totalFinalists,
        totalScore,
        avgStudentScore,
        completionRate,
      };
    });

    // Sort deterministically: totalScore DESC, totalWins DESC, totalFinalists DESC, collegeName ASC
    scoredColleges.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (b.totalWins !== a.totalWins) return b.totalWins - a.totalWins;
      if (b.totalFinalists !== a.totalFinalists) return b.totalFinalists - a.totalFinalists;
      return a.collegeName.localeCompare(b.collegeName);
    });

    const rankedColleges = scoredColleges.map((c, index) => ({
      rank: index + 1,
      ...c,
    }));

    const paginated = rankedColleges.slice(skip, skip + limit);

    return {
      rankings: paginated,
      pagination: {
        page,
        limit,
        total: rankedColleges.length,
        totalPages: Math.ceil(rankedColleges.length / limit) || 1,
      },
    };
  }
}
