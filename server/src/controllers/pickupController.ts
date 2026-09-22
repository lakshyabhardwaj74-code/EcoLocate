import { Response } from 'express';
import prisma from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

// Base points calculation lookup
const POINT_RATES: Record<string, number> = {
  Smartphone: 100,
  Laptop: 250,
  Desktop: 200,
  Monitor: 150,
  Television: 180,
  Printer: 120,
  Keyboard: 40,
  Mouse: 30,
  Charger: 25,
  Battery: 50,
  Refrigerator: 300,
  WashingMachine: 350,
  Other: 50,
};

function calculateEstimatedPoints(category: string, quantity: number, weightKg: number): number {
  let base = 50;
  for (const [catName, pts] of Object.entries(POINT_RATES)) {
    if (category.toLowerCase().includes(catName.toLowerCase())) {
      base = pts;
      break;
    }
  }
  const weightBonus = Math.round(weightKg * 15);
  return base * Math.max(1, quantity) + weightBonus;
}

function generateTrackingCode(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `EC-${num}`;
}

export const createPickup = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required to schedule pickup.' });
    }

    const {
      name,
      phone,
      email,
      address,
      city,
      pincode,
      category,
      quantity,
      weightKg,
      preferredDate,
      preferredTimeSlot,
      notes,
      facilityId,
    } = req.body;

    if (!address || !city || !pincode || !category || !preferredDate || !preferredTimeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide address, city, pincode, category, date, and time slot.',
      });
    }

    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const weight = Math.max(0.1, parseFloat(weightKg) || 1.0);
    const estimatedPoints = calculateEstimatedPoints(category, qty, weight);
    const trackingCode = generateTrackingCode();

    const pickup = await prisma.pickupRequest.create({
      data: {
        trackingCode,
        userId: req.user.id,
        facilityId: facilityId || null,
        name: name ? String(name).trim() : req.user.name,
        phone: phone ? String(phone).trim() : '9999999999',
        email: email ? String(email).trim().toLowerCase() : req.user.email,
        address: String(address).trim(),
        city: String(city).trim(),
        pincode: String(pincode).trim(),
        category: String(category).trim(),
        quantity: qty,
        weightKg: weight,
        preferredDate: String(preferredDate).trim(),
        preferredTimeSlot: String(preferredTimeSlot).trim(),
        notes: notes ? String(notes).trim() : null,
        status: 'REQUESTED',
        estimatedPoints,
      },
      include: {
        facility: {
          select: { id: true, name: true, phone: true, address: true },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Pickup scheduled successfully! Tracking code generated.',
      data: pickup,
    });
  } catch (error) {
    console.error('Error scheduling pickup:', error);
    return res.status(500).json({ success: false, message: 'Failed to schedule pickup.' });
  }
};

export const getPickups = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    let pickups;

    if (req.user.role === 'ADMIN') {
      pickups = await prisma.pickupRequest.findMany({
        include: {
          user: { select: { name: true, email: true, phone: true } },
          facility: { select: { name: true, city: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else if (req.user.role === 'FACILITY_MEMBER') {
      const managedFacilities = await prisma.facility.findMany({
        where: { managerId: req.user.id },
        select: { id: true },
      });
      const facilityIds = managedFacilities.map((f) => f.id);

      pickups = await prisma.pickupRequest.findMany({
        where: {
          facilityId: { in: facilityIds },
        },
        include: {
          user: { select: { name: true, email: true, phone: true } },
          facility: { select: { name: true, city: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      pickups = await prisma.pickupRequest.findMany({
        where: { userId: req.user.id },
        include: {
          facility: { select: { name: true, phone: true, address: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return res.json({ success: true, count: pickups.length, data: pickups });
  } catch (error) {
    console.error('Error fetching pickups:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve pickups.' });
  }
};

// Protected / Sanitized Pickup Details with IDOR Defense
export const getPickupById = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);

    const pickup = await prisma.pickupRequest.findFirst({
      where: {
        OR: [{ id }, { trackingCode: id }],
      },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        facility: { select: { name: true, address: true, phone: true, email: true } },
      },
    });

    if (!pickup) {
      return res.status(404).json({ success: false, message: 'Pickup request not found.' });
    }

    // Check authorization: Is current user the owner, admin, or facility manager?
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;
    const isOwner = currentUserId && currentUserId === pickup.userId;
    const isAdmin = currentUserRole === 'ADMIN';
    let isManager = false;
    if (currentUserRole === 'FACILITY_MEMBER') {
      const managedFacility = await prisma.facility.findFirst({
        where: { managerId: currentUserId },
        select: { id: true },
      });
      isManager = !!(managedFacility && managedFacility.id === pickup.facilityId);
    }

    if (isOwner || isAdmin || isManager) {
      return res.json({ success: true, data: pickup });
    }

    // Unauthenticated or third-party query: Return public redacted tracking info only (PII protected)
    const redactedData = {
      id: pickup.id,
      trackingCode: pickup.trackingCode,
      category: pickup.category,
      quantity: pickup.quantity,
      status: pickup.status,
      preferredDate: pickup.preferredDate,
      preferredTimeSlot: pickup.preferredTimeSlot,
      estimatedPoints: pickup.estimatedPoints,
      earnedPoints: pickup.earnedPoints,
      createdAt: pickup.createdAt,
      updatedAt: pickup.updatedAt,
      facility: pickup.facility ? { name: pickup.facility.name } : null,
      isRedacted: true,
    };

    return res.json({ success: true, data: redactedData });
  } catch (error) {
    console.error('Error fetching pickup:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch pickup details.' });
  }
};

// Status update with Atomic Database Transaction
export const updatePickupStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status, facilityId } = req.body;

    const validStatuses = ['REQUESTED', 'ACCEPTED', 'CONFIRMED', 'ASSIGNED', 'SCHEDULED', 'PICKED_UP', 'PROCESSING', 'RECYCLED', 'COMPLETED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const existing = await prisma.pickupRequest.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Pickup request not found.' });
    }

    // Authorization & verification checks for facility member
    if (req.user?.role === 'FACILITY_MEMBER') {
      const managedFacility = await prisma.facility.findFirst({
        where: { managerId: req.user.id },
      });
      if (!managedFacility || existing.facilityId !== managedFacility.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You do not have permission to manage this pickup request.',
        });
      }
      if (managedFacility.verificationStatus !== 'VERIFIED') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Your facility operational functionality is restricted (currently PENDING, REJECTED, or SUSPENDED).',
        });
      }
    }

    const updateData: any = { status };
    if (facilityId) {
      updateData.facilityId = facilityId;
    }

    // Atomic transaction if status is marked COMPLETED
    if (status === 'COMPLETED' && existing.status !== 'COMPLETED') {
      const pointsToCredit = existing.estimatedPoints || 100;
      updateData.earnedPoints = pointsToCredit;

      const [updatedPickup] = await prisma.$transaction([
        prisma.pickupRequest.update({
          where: { id },
          data: updateData,
          include: { facility: { select: { name: true } } },
        }),
        prisma.user.update({
          where: { id: existing.userId },
          data: { rewardPoints: { increment: pointsToCredit } },
        }),
        prisma.rewardTransaction.create({
          data: {
            userId: existing.userId,
            points: pointsToCredit,
            type: 'EARNED',
            title: 'Disposal Reward Credited',
            description: `Disposed ${existing.category} (${existing.quantity} pcs, ${existing.weightKg} kg) via Pickup ${existing.trackingCode}`,
          },
        }),
      ]);

      return res.json({
        success: true,
        message: `Pickup status updated to ${status} and ${pointsToCredit} reward points credited atomically.`,
        data: updatedPickup,
      });
    }

    const updated = await prisma.pickupRequest.update({
      where: { id },
      data: updateData,
      include: {
        facility: { select: { name: true } },
      },
    });

    return res.json({ success: true, message: `Pickup status updated to ${status}.`, data: updated });
  } catch (error) {
    console.error('Error updating pickup status:', error);
    return res.status(500).json({ success: false, message: 'Failed to update pickup status.' });
  }
};
