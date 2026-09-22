export type UserRole = 'USER' | 'FACILITY_MANAGER' | 'ADMIN' | 'FACILITY_MEMBER';

export type PickupStatus = 'REQUESTED' | 'ACCEPTED' | 'CONFIRMED' | 'ASSIGNED' | 'SCHEDULED' | 'PICKED_UP' | 'PROCESSING' | 'RECYCLED' | 'COMPLETED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  rewardPoints: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface Facility {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website?: string | null;
  openingHours: string;
  acceptedCategories: string;
  acceptedCategoriesList?: string[];
  recyclingServices: string;
  capacity: string;
  rating: number;
  isVerified: boolean;
  verificationStatus?: string;
  isActive: boolean;
  distanceKm?: number | null;
  managerId?: string | null;
  reviews?: Review[];
}

export interface PickupRequest {
  id: string;
  trackingCode: string;
  userId: string;
  user?: { name: string; email: string; phone?: string };
  facilityId?: string | null;
  facility?: { name: string; address?: string; phone?: string; city?: string } | null;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  category: string;
  quantity: number;
  weightKg: number;
  preferredDate: string;
  preferredTimeSlot: string;
  notes?: string | null;
  status: PickupStatus;
  estimatedPoints: number;
  earnedPoints?: number | null;
  createdAt: string;
}

export interface AIAnalysisResult {
  scanId?: string | null;
  imageUrl?: string;
  detectedItem: string;
  category: string;
  confidence: number;
  estimatedWeightKg: number;
  estimatedPoints: number;
  recyclableMaterials: {
    gold?: string;
    silver?: string;
    copper?: string;
    aluminum?: string;
    plastics?: string;
    hazardous?: string;
  };
  safetyNotes: string;
  disposalMethod: string;
  isDoorstepPickupRecommended?: boolean;
  isDemoMode: boolean;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  points: number;
  type: 'EARNED' | 'REDEEMED';
  title: string;
  description: string;
  createdAt: string;
}

export interface RewardCatalogItem {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  category: string;
  partnerName: string;
  imageUrl: string;
  code?: string | null;
  isActive: boolean;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  points: number;
  itemsRecycledCount: number;
}

export interface Review {
  id: string;
  userId: string;
  user?: { name: string };
  facilityId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalFacilities: number;
  totalPickups: number;
  totalRecycledWeightKg: number;
  totalPointsIssued: number;
  co2SavedKg: number;
}
