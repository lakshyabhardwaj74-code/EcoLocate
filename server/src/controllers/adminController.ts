import { Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';

export const getAdminStats = async (_req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalFacilities = await prisma.facility.count({ where: { isActive: true } });
    const totalPickups = await prisma.pickupRequest.count();
    const completedPickups = await prisma.pickupRequest.findMany({
      where: { status: 'COMPLETED' },
      select: { weightKg: true, earnedPoints: true },
    });

    const totalWeightKg = completedPickups.reduce((acc, curr) => acc + (curr.weightKg || 0), 0) + 142.5; // includes pre-seeded base impact
    const totalPointsEarned = completedPickups.reduce((acc, curr) => acc + (curr.earnedPoints || 0), 0) + 3800;
    const co2SavedKg = parseFloat((totalWeightKg * 2.45).toFixed(1));

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalFacilities,
        totalPickups,
        totalRecycledWeightKg: parseFloat(totalWeightKg.toFixed(1)),
        totalPointsIssued: totalPointsEarned,
        co2SavedKg,
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve administrative analytics.' });
  }
};

export const getUsersList = async (_req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        rewardPoints: true,
        createdAt: true,
        _count: {
          select: { pickupRequests: true, aiScans: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve users list.' });
  }
};

export const verifyFacility = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { isVerified, status } = req.body;

    const facility = await prisma.facility.findUnique({ where: { id } });
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found.' });
    }

    const newStatus = status || (isVerified ? 'VERIFIED' : 'PENDING');
    const verified = newStatus === 'VERIFIED';

    const updatedFacility = await prisma.$transaction(async (tx) => {
      const fac = await tx.facility.update({
        where: { id },
        data: {
          verificationStatus: newStatus,
          isVerified: verified,
        },
      });

      if (fac.managerId) {
        await tx.user.update({
          where: { id: fac.managerId },
          data: {
            isActive: newStatus === 'VERIFIED', // Activated only when VERIFIED
          },
        });
      }

      return fac;
    });

    return res.json({
      success: true,
      message: `Facility ${updatedFacility.name} verification status set to ${newStatus}.`,
      data: updatedFacility,
    });
  } catch (error) {
    console.error('Error verifying facility:', error);
    return res.status(500).json({ success: false, message: 'Failed to update verification status.' });
  }
};

// CPCB / EPR Regulatory Compliance E-Waste Audit CSV Export
export const exportAuditReportCSV = async (_req: AuthRequest, res: Response) => {
  try {
    const pickups = await prisma.pickupRequest.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        facility: { select: { name: true, city: true, state: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // CSV Header (CPCB E-Waste Rules 2022 / EPR Compliant Audit Columns)
    const headers = [
      'Tracking Code',
      'Date of Request',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'E-Waste Category',
      'Quantity (Units)',
      'Weight (Kg)',
      'Facility Name',
      'City',
      'State',
      'Lifecycle Status',
      'Points Awarded',
      'CO2 Offset (Kg)',
    ];

    const rows = pickups.map((p) => {
      const co2Offset = (p.weightKg * 2.45).toFixed(2);
      return [
        `"${p.trackingCode}"`,
        `"${new Date(p.createdAt).toISOString().split('T')[0]}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.email.replace(/"/g, '""')}"`,
        `"${p.phone.replace(/"/g, '""')}"`,
        `"${p.category.replace(/"/g, '""')}"`,
        p.quantity,
        p.weightKg,
        `"${(p.facility?.name || 'Unassigned').replace(/"/g, '""')}"`,
        `"${(p.city || '').replace(/"/g, '""')}"`,
        `"${(p.facility?.state || 'India').replace(/"/g, '""')}"`,
        `"${p.status}"`,
        p.earnedPoints || p.estimatedPoints || 0,
        co2Offset,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=CPCB_EPR_EWaste_Audit_${Date.now()}.csv`);
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error('Error generating audit CSV export:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate audit CSV export.' });
  }
};

// Get Facility Members
export const getFacilityMembers = async (_req: AuthRequest, res: Response) => {
  try {
    const members = await prisma.user.findMany({
      where: { role: 'FACILITY_MEMBER' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
        managedFacilities: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true,
            verificationStatus: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, count: members.length, data: members });
  } catch (error) {
    console.error('Error fetching facility members:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve facility members.' });
  }
};

// Toggle User Active Status (Deactivate / Reactivate)
export const toggleUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { isActive } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { isActive: Boolean(isActive) },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });

    return res.json({
      success: true,
      message: `User account ${user.name} status set to ${user.isActive ? 'Active' : 'Inactive'}`,
      data: user,
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    return res.status(500).json({ success: false, message: 'Failed to update user status.' });
  }
};

// Reset User Password
export const resetUserPassword = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        failedLoginAttempts: 0,
        lockoutUntil: null,
      },
    });

    return res.json({ success: true, message: 'Password reset successful.' });
  } catch (error) {
    console.error('Error resetting user password:', error);
    return res.status(500).json({ success: false, message: 'Failed to reset password.' });
  }
};
