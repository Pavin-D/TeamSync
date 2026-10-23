import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/event.service';
import { createEventSchema, updateEventSchema, eventQuerySchema } from '../validators/event.validator';

export async function getEventsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedQuery = eventQuerySchema.parse(req.query);
    const result = await EventService.getEvents(validatedQuery as any);

    return res.status(200).json({
      success: true,
      data: result.events,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getEventByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { eventId } = req.params;
    const event = await EventService.getEventById(eventId);

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createEventHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const validatedData = createEventSchema.parse(req.body);
    const newEvent = await EventService.createEvent(validatedData, req.user.id);

    return res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      data: newEvent,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateEventHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { eventId } = req.params;
    const validatedData = updateEventSchema.parse(req.body);
    const updatedEvent = await EventService.updateEvent(eventId, validatedData);

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      data: updatedEvent,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteEventHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const { eventId } = req.params;
    const result = await EventService.deleteEvent(eventId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}
