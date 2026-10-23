import { Request, Response, NextFunction } from 'express';
import { LocationService } from '../services/location.service';
import { updateLocationSchema, nearbyDiscoveryQuerySchema } from '../validators/location.validator';

export async function updateUserLocationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const validatedData = updateLocationSchema.parse(req.body);
    const result = await LocationService.updateUserLocation(req.user.id, validatedData);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getUserLocationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const location = await LocationService.getUserLocation(req.user.id);

    return res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getNearbyDiscoveryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
      });
    }

    const validatedQuery = nearbyDiscoveryQuerySchema.parse(req.query);
    const result = await LocationService.getNearbyDiscovery(req.user.id, validatedQuery);

    return res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination,
      ...(result.message ? { message: result.message } : {}),
    });
  } catch (error) {
    return next(error);
  }
}
