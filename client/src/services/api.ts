const API_BASE = '/api';

function getHeaders(token?: string | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const authToken = token || localStorage.getItem('ecocycle_token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
}

// Global response interceptor to handle token expiration & network errors
async function handleResponse(res: Response) {
  if (res.status === 401) {
    // If unauthorized / token expired and we are not on login/register endpoints
    const url = res.url || '';
    if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
      localStorage.removeItem('ecocycle_token');
    }
  }

  try {
    const data = await res.json();
    return data;
  } catch {
    return {
      success: res.ok,
      message: res.statusText || (res.ok ? 'Success' : 'Server error occurred'),
    };
  }
}

export const api = {
  // Auth
  async login(credentials: any) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  async adminLogin(credentials: any) {
    const res = await fetch(`${API_BASE}/auth/admin-login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  async facilityLogin(credentials: any) {
    const res = await fetch(`${API_BASE}/auth/facility-login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  async facilityRegister(data: any) {
    const res = await fetch(`${API_BASE}/auth/facility-register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async register(data: any) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Facilities
  async getFacilities(params: {
    city?: string;
    search?: string;
    lat?: number;
    lng?: number;
    category?: string;
    verifiedOnly?: boolean;
    minRating?: number;
  }) {
    const query = new URLSearchParams();
    if (params.city) query.append('city', params.city);
    if (params.search) query.append('search', params.search);
    if (params.lat !== undefined && params.lng !== undefined) {
      query.append('lat', params.lat.toString());
      query.append('lng', params.lng.toString());
    }
    if (params.category) query.append('category', params.category);
    if (params.verifiedOnly) query.append('verifiedOnly', 'true');
    if (params.minRating) query.append('minRating', params.minRating.toString());

    const res = await fetch(`${API_BASE}/facilities?${query.toString()}`);
    return handleResponse(res);
  },

  async getFacilityById(id: string) {
    const res = await fetch(`${API_BASE}/facilities/${id}`);
    return handleResponse(res);
  },

  async addReview(facilityId: string, rating: number, comment: string) {
    const res = await fetch(`${API_BASE}/facilities/${facilityId}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ rating, comment }),
    });
    return handleResponse(res);
  },

  async createFacility(data: any) {
    const res = await fetch(`${API_BASE}/facilities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateFacility(id: string, data: any) {
    const res = await fetch(`${API_BASE}/facilities/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getManagedFacilityStats() {
    const res = await fetch(`${API_BASE}/facilities/managed/stats`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Pickups
  async createPickup(data: any) {
    const res = await fetch(`${API_BASE}/pickups`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getPickups() {
    const res = await fetch(`${API_BASE}/pickups`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getPickupById(id: string) {
    const res = await fetch(`${API_BASE}/pickups/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async updatePickupStatus(id: string, status: string, facilityId?: string) {
    const res = await fetch(`${API_BASE}/pickups/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, facilityId }),
    });
    return handleResponse(res);
  },

  // AI Scanner
  async analyzeAIImage(formData: FormData) {
    const token = localStorage.getItem('ecocycle_token');
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/ai/analyze`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse(res);
  },

  async getAIScanHistory() {
    const res = await fetch(`${API_BASE}/ai/history`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Rewards
  async getRewardCatalog() {
    const res = await fetch(`${API_BASE}/rewards/catalog`);
    return handleResponse(res);
  },

  async getUserRewards() {
    const res = await fetch(`${API_BASE}/rewards/user`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async redeemReward(catalogId: string) {
    const res = await fetch(`${API_BASE}/rewards/redeem`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ catalogId }),
    });
    return handleResponse(res);
  },

  async getLeaderboard() {
    const res = await fetch(`${API_BASE}/rewards/leaderboard`);
    return handleResponse(res);
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getAdminUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getAdminFacilityMembers() {
    const res = await fetch(`${API_BASE}/admin/facility-members`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async toggleFacilityVerify(id: string, isVerified: boolean) {
    const res = await fetch(`${API_BASE}/admin/facilities/${id}/verify`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ isVerified }),
    });
    return handleResponse(res);
  },

  async updateFacilityStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/admin/facilities/${id}/verify`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  async toggleUserStatus(id: string, isActive: boolean) {
    const res = await fetch(`${API_BASE}/admin/users/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ isActive }),
    });
    return handleResponse(res);
  },

  async resetUserPassword(id: string, newPassword: string) {
    const res = await fetch(`${API_BASE}/admin/users/${id}/reset-password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ newPassword }),
    });
    return handleResponse(res);
  },

  async downloadAdminAuditCSV() {
    const token = localStorage.getItem('ecocycle_token');
    const res = await fetch(`${API_BASE}/admin/export-csv`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error('Failed to export audit report');
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CPCB_EPR_EWaste_Audit_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    return { success: true };
  },
};
