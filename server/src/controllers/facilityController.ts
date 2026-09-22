import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

// Haversine distance formula in KM
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

export const getFacilities = async (req: Request, res: Response) => {
  try {
    const { city, search, lat, lng, category, minRating, verifiedOnly } = req.query;

    const whereClause: any = { isActive: true };

    if (city && typeof city === 'string' && city.trim() !== '' && city !== 'All') {
      whereClause.city = { contains: city.trim() };
    }

    if (verifiedOnly === 'true') {
      whereClause.isVerified = true;
    }

    if (minRating) {
      const parsedRating = parseFloat(minRating as string);
      if (!isNaN(parsedRating)) {
        whereClause.rating = { gte: parsedRating };
      }
    }

    let facilities = await prisma.facility.findMany({
      where: whereClause,
      include: {
        reviews: {
          select: { rating: true },
        },
      },
      orderBy: { rating: 'desc' },
    });

    // Apply text search filter if provided
    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase();
      facilities = facilities.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.address.toLowerCase().includes(q) ||
          f.acceptedCategories.toLowerCase().includes(q) ||
          f.city.toLowerCase().includes(q)
      );
    }

    // Apply category filter if provided
    if (category && typeof category === 'string' && category.trim() !== '' && category !== 'All') {
      const cat = category.toLowerCase();
      facilities = facilities.filter((f) => f.acceptedCategories.toLowerCase().includes(cat));
    }

    // Calculate distance if lat/lng are provided
    let results = facilities.map((f) => {
      let distanceKm: number | null = null;
      if (lat && lng) {
        const userLat = parseFloat(lat as string);
        const userLng = parseFloat(lng as string);
        if (!isNaN(userLat) && !isNaN(userLng)) {
          distanceKm = calculateHaversineDistance(userLat, userLng, f.latitude, f.longitude);
        }
      }

      return {
        ...f,
        distanceKm,
        acceptedCategoriesList: f.acceptedCategories.split(',').map((c) => c.trim()),
      };
    });

    // If user provided coordinates, sort by distance
    if (lat && lng) {
      results.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
    }

    return res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve recycling facilities.' });
  }
};

export const getFacilityById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const facility = await prisma.facility.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: { select: { name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        manager: {
          select: { name: true, email: true, phone: true },
        },
      },
    });

    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found.' });
    }

    return res.json({
      success: true,
      data: {
        ...facility,
        acceptedCategoriesList: facility.acceptedCategories.split(',').map((c) => c.trim()),
      },
    });
  } catch (error) {
    console.error('Error fetching facility details:', error);
    return res.status(500).json({ success: false, message: 'Error retrieving facility.' });
  }
};

export const createFacility = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      phone,
      email,
      website,
      openingHours,
      acceptedCategories,
      recyclingServices,
      capacity,
    } = req.body;

    if (!name || !address || !city || !state || !latitude || !longitude || !phone || !acceptedCategories) {
      return res.status(400).json({ success: false, message: 'All required facility fields must be provided.' });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ success: false, message: 'Invalid latitude or longitude coordinates.' });
    }

    const facility = await prisma.facility.create({
      data: {
        name: String(name).trim(),
        address: String(address).trim(),
        city: String(city).trim(),
        state: String(state).trim(),
        pincode: pincode ? String(pincode).trim() : '000000',
        latitude: lat,
        longitude: lng,
        phone: String(phone).trim(),
        email: email ? String(email).trim().toLowerCase() : 'contact@facility.com',
        website: website ? String(website).trim() : null,
        openingHours: openingHours ? String(openingHours).trim() : 'Mon-Sat: 9:00 AM - 6:00 PM',
        acceptedCategories: Array.isArray(acceptedCategories) ? acceptedCategories.join(', ') : String(acceptedCategories).trim(),
        recyclingServices: recyclingServices ? String(recyclingServices).trim() : 'Collection & Recycling',
        capacity: capacity ? String(capacity).trim() : '10,000 kg/month',
        isVerified: true,
        managerId: req.user?.id || null,
      },
    });

    return res.status(201).json({ success: true, message: 'Facility added successfully.', data: facility });
  } catch (error) {
    console.error('Error creating facility:', error);
    return res.status(500).json({ success: false, message: 'Failed to create facility.' });
  }
};

export const updateFacility = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);

    const existing = await prisma.facility.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Facility not found.' });
    }

    // Authorization check: Only ADMIN or the assigned manager of this facility can update
    const isAdmin = req.user?.role === 'ADMIN';
    const isManager = req.user?.id && existing.managerId === req.user.id;

    if (!isAdmin && !isManager) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to manage this facility.' });
    }

    // Sanitize input: Only admin can change verification, status, or active flags
    const updateData = { ...req.body };
    if (!isAdmin) {
      delete updateData.isVerified;
      delete updateData.isActive;
      delete updateData.verificationStatus;
      delete updateData.managerId;
      delete updateData.rating;
    }

    const updated = await prisma.facility.update({
      where: { id },
      data: updateData,
    });

    return res.json({ success: true, message: 'Facility updated successfully.', data: updated });
  } catch (error) {
    console.error('Error updating facility:', error);
    return res.status(500).json({ success: false, message: 'Failed to update facility.' });
  }
};

export const addReview = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { rating, comment } = req.body;

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Login required to submit a review.' });
    }

    const numericRating = parseInt(rating, 10);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5 stars.' });
    }

    // Check if user already reviewed this facility (Upsert logic to prevent review spam)
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: req.user.id,
        facilityId: id,
      },
    });

    let review;
    if (existingReview) {
      review = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating: numericRating,
          comment: comment ? String(comment).trim() : existingReview.comment,
        },
      });
    } else {
      review = await prisma.review.create({
        data: {
          userId: req.user.id,
          facilityId: id,
          rating: numericRating,
          comment: comment ? String(comment).trim() : 'Verified e-waste disposal service.',
        },
      });
    }

    // Recalculate accurate average rating for facility
    const allReviews = await prisma.review.findMany({ where: { facilityId: id } });
    const avgRating = parseFloat(
      (allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length).toFixed(1)
    );

    await prisma.facility.update({
      where: { id },
      data: { rating: avgRating },
    });

    return res.status(201).json({
      success: true,
      message: existingReview ? 'Your review has been updated.' : 'Review added successfully.',
      data: review,
    });
  } catch (error) {
    console.error('Error adding review:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
};

// Fetch Stats for Managed Facility
export const getManagedFacilityStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const facility = await prisma.facility.findFirst({
      where: { managerId: userId },
    });

    if (!facility) {
      return res.status(404).json({ success: false, message: 'No facility found managed by this user.' });
    }

    // Fetch pickup request counts assigned to this facility
    const pickups = await prisma.pickupRequest.findMany({
      where: { facilityId: facility.id },
      select: {
        status: true,
        weightKg: true,
      },
    });

    const totalPickups = pickups.length;
    const pendingRequests = pickups.filter((p) => ['REQUESTED', 'ACCEPTED', 'SCHEDULED'].includes(p.status)).length;
    const activePickups = pickups.filter((p) => ['PICKED_UP', 'PROCESSING', 'RECYCLED'].includes(p.status)).length;
    const completedPickups = pickups.filter((p) => p.status === 'COMPLETED').length;

    const totalWeightKg = pickups
      .filter((p) => p.status === 'COMPLETED')
      .reduce((acc, curr) => acc + (curr.weightKg || 0), 0);

    // Fetch recent 5 requests
    const recentRequests = await prisma.pickupRequest.findMany({
      where: { facilityId: facility.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        trackingCode: true,
        name: true,
        category: true,
        quantity: true,
        weightKg: true,
        preferredDate: true,
        status: true,
        createdAt: true,
      },
    });

    return res.json({
      success: true,
      data: {
        facility,
        stats: {
          totalPickups,
          pendingRequests,
          activePickups,
          completedPickups,
          totalWeightKg: parseFloat(totalWeightKg.toFixed(2)),
        },
        recentRequests,
      },
    });
  } catch (error) {
    console.error('Error fetching managed facility stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve facility statistics.' });
  }
};
