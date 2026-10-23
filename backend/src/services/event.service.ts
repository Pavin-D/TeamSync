import { prisma } from '../config/database';
import { EventStatus, EventMode } from '@prisma/client';
import { TECH_CANONICAL_MAP } from './github.service';

export interface EventQueryParams {
  search?: string;
  mode?: EventMode;
  status?: EventStatus;
  allowsStudents?: boolean;
  allowsProfessionals?: boolean;
  allowsCrossCollegeTeams?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class EventService {
  public static calculateStatus(event: { startDate: Date; endDate: Date; status: EventStatus }): EventStatus {
    if (event.status === 'CANCELLED') {
      return 'CANCELLED';
    }

    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (now < start) return 'UPCOMING';
    if (now >= start && now <= end) return 'ONGOING';
    return 'COMPLETED';
  }

  public static async getEvents(params: EventQueryParams) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
        { organizer: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.mode) where.mode = params.mode;
    if (params.allowsStudents !== undefined) where.allowsStudents = params.allowsStudents;
    if (params.allowsProfessionals !== undefined) where.allowsProfessionals = params.allowsProfessionals;
    if (params.allowsCrossCollegeTeams !== undefined) where.allowsCrossCollegeTeams = params.allowsCrossCollegeTeams;

    const [total, events] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [params.sortBy === 'createdAt' || params.sortBy === 'NEWEST' ? 'createdAt' : params.sortBy === 'registrationDeadline' || params.sortBy === 'DEADLINE' ? 'registrationDeadline' : 'startDate']: params.sortOrder === 'desc' ? 'desc' : 'asc',
        },
        include: {
          _count: {
            select: {
              teams: true,
              participations: true,
            },
          },
        },
      }),
    ]);

    const formattedEvents = events.map((event) => {
      const computedStatus = this.calculateStatus(event);
      return {
        id: event.id,
        title: event.title,
        description: event.description,
        organizer: event.organizer,
        startDate: event.startDate.toISOString(),
        endDate: event.endDate.toISOString(),
        registrationDeadline: event.registrationDeadline.toISOString(),
        location: event.location || (event.mode === 'ONLINE' ? 'Online' : 'TBD'),
        mode: event.mode,
        isOnline: event.mode === 'ONLINE',
        minTeamSize: event.minTeamSize,
        maxTeamSize: event.maxTeamSize,
        registrationUrl: event.registrationUrl,
        allowsStudents: event.allowsStudents,
        allowsProfessionals: event.allowsProfessionals,
        allowsCrossCollegeTeams: event.allowsCrossCollegeTeams,
        status: computedStatus,
        domainName: event.domainName,
        requiredSkills: event.requiredSkills ? event.requiredSkills.split(',').map(s => s.trim()) : [],
        teamsCount: event._count.teams,
        participantsCount: event._count.participations,
        createdAt: event.createdAt.toISOString(),
      };
    });

    return {
      events: formattedEvents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  public static async getEventById(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: {
            teams: true,
            participations: true,
            mentorships: true,
          },
        },
      },
    });

    if (!event) {
      const error: any = new Error('Event record not found.');
      error.statusCode = 404;
      error.code = 'EVENT_NOT_FOUND';
      throw error;
    }

    const computedStatus = this.calculateStatus(event);

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      organizer: event.organizer,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      registrationDeadline: event.registrationDeadline.toISOString(),
      location: event.location || (event.mode === 'ONLINE' ? 'Online' : 'TBD'),
      mode: event.mode,
      isOnline: event.mode === 'ONLINE',
      minTeamSize: event.minTeamSize,
      maxTeamSize: event.maxTeamSize,
      registrationUrl: event.registrationUrl,
      allowsStudents: event.allowsStudents,
      allowsProfessionals: event.allowsProfessionals,
      allowsCrossCollegeTeams: event.allowsCrossCollegeTeams,
      status: computedStatus,
      domainName: event.domainName,
      requiredSkills: event.requiredSkills ? event.requiredSkills.split(',').map(s => s.trim()) : [],
      teamsCount: event._count.teams,
      participantsCount: event._count.participations,
      mentorsCount: event._count.mentorships,
      createdAt: event.createdAt.toISOString(),
    };
  }

  public static async createEvent(data: any, creatorUserId: string) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const deadline = new Date(data.registrationDeadline);

    if (start >= end) {
      const error: any = new Error('Event end date must be after the start date.');
      error.statusCode = 400;
      error.code = 'INVALID_EVENT_DATES';
      throw error;
    }

    if (deadline > start) {
      const error: any = new Error('Registration deadline must be on or before the event start date.');
      error.statusCode = 400;
      error.code = 'INVALID_REGISTRATION_DEADLINE';
      throw error;
    }

    if (data.minTeamSize > data.maxTeamSize) {
      const error: any = new Error('Minimum team size cannot be greater than maximum team size.');
      error.statusCode = 400;
      error.code = 'INVALID_TEAM_BOUNDARIES';
      throw error;
    }

    const textToScan = `${data.title} ${data.description}`.toLowerCase();
    const detectedSkills = new Set<string>();
    let deducedDomain = 'General';

    Object.keys(TECH_CANONICAL_MAP).forEach((key) => {
      // Use regex to match whole words to avoid partial matches
      const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(textToScan)) {
        detectedSkills.add(TECH_CANONICAL_MAP[key].name);
        if (deducedDomain === 'General' || deducedDomain === 'General Technology') {
          deducedDomain = TECH_CANONICAL_MAP[key].category;
        }
      }
    });

    const requiredSkillsStr = Array.from(detectedSkills).join(', ');

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        organizer: data.organizer,
        startDate: start,
        endDate: end,
        registrationDeadline: deadline,
        location: data.location || null,
        mode: data.mode || 'ONLINE',
        isOnline: (data.mode || 'ONLINE') === 'ONLINE',
        minTeamSize: data.minTeamSize || 2,
        maxTeamSize: data.maxTeamSize || 4,
        registrationUrl: data.registrationUrl || null,
        allowsStudents: data.allowsStudents !== undefined ? data.allowsStudents : true,
        allowsProfessionals: data.allowsProfessionals !== undefined ? data.allowsProfessionals : true,
        allowsCrossCollegeTeams: data.allowsCrossCollegeTeams !== undefined ? data.allowsCrossCollegeTeams : true,
        createdBy: creatorUserId,
        status: 'UPCOMING',
        domainName: deducedDomain,
        requiredSkills: requiredSkillsStr.length > 0 ? requiredSkillsStr : null,
      },
    });

    return this.getEventById(event.id);
  }

  public static async updateEvent(eventId: string, data: any) {
    const existing = await prisma.event.findUnique({ where: { id: eventId } });
    if (!existing) {
      const error: any = new Error('Event not found.');
      error.statusCode = 404;
      error.code = 'EVENT_NOT_FOUND';
      throw error;
    }

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: data.title || existing.title,
        description: data.description || existing.description,
        organizer: data.organizer || existing.organizer,
        startDate: data.startDate ? new Date(data.startDate) : existing.startDate,
        endDate: data.endDate ? new Date(data.endDate) : existing.endDate,
        registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : existing.registrationDeadline,
        location: data.location !== undefined ? data.location : existing.location,
        mode: data.mode || existing.mode,
        isOnline: data.mode ? data.mode === 'ONLINE' : existing.isOnline,
        minTeamSize: data.minTeamSize || existing.minTeamSize,
        maxTeamSize: data.maxTeamSize || existing.maxTeamSize,
        registrationUrl: data.registrationUrl !== undefined ? data.registrationUrl : existing.registrationUrl,
        allowsStudents: data.allowsStudents !== undefined ? data.allowsStudents : existing.allowsStudents,
        allowsProfessionals: data.allowsProfessionals !== undefined ? data.allowsProfessionals : existing.allowsProfessionals,
        allowsCrossCollegeTeams: data.allowsCrossCollegeTeams !== undefined ? data.allowsCrossCollegeTeams : existing.allowsCrossCollegeTeams,
        status: data.status || existing.status,
      },
    });

    return this.getEventById(updated.id);
  }

  public static async deleteEvent(eventId: string) {
    const existing = await prisma.event.findUnique({ where: { id: eventId } });
    if (!existing) {
      const error: any = new Error('Event not found.');
      error.statusCode = 404;
      error.code = 'EVENT_NOT_FOUND';
      throw error;
    }

    await prisma.event.update({
      where: { id: eventId },
      data: { status: 'CANCELLED' },
    });

    return { message: 'Event status updated to CANCELLED successfully.' };
  }
}
