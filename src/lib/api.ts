// API utility functions for connecting to backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to get auth headers
const getAuthHeaders = () => {
  if (typeof window === 'undefined') {
    // Server-side rendering - no token available
    return {
      'Content-Type': 'application/json',
    };
  }
  
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function for multipart form data (file uploads)
const getAuthHeadersMultipart = () => {
  if (typeof window === 'undefined') {
    // Server-side rendering - no token available
    return {};
  }
  
  const token = localStorage.getItem('token');
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic API call function
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Auth API calls
export const authAPI = {
  // Admin login
  login: async (username: string, password: string) => {
    return apiCall('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  // Customer registration
  register: async (username: string, password: string, email: string) => {
    return apiCall('/api/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email }),
    });
  },

  // Customer login
  customerLogin: async (username: string, password: string) => {
    return apiCall('/api/customer-login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
};

// Properties API calls
export const propertiesAPI = {
  // Get all properties (public)
  getAll: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    keyword?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
  } = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    return apiCall(`/api/properties?${searchParams.toString()}`);
  },

  // Get featured properties
  getFeatured: async () => {
    return apiCall('/api/properties/featured');
  },

  // Get single property (public)
  getById: async (id: string) => {
    return apiCall(`/api/properties/${id}`);
  },

  // Log search activity
  logSearch: async (searchParams: {
    status?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    keyword?: string;
  }) => {
    return apiCall('/api/log-search', {
      method: 'POST',
      body: JSON.stringify(searchParams),
    });
  },
};

// Admin API calls
export const adminAPI = {
  // Get dashboard stats
  getStats: async () => {
    return apiCall('/api/admin/stats');
  },

  // Get properties by type for charts
  getPropertiesByType: async () => {
    return apiCall('/api/admin/properties-by-type');
  },

  // Get search stats
  getSearchStats: async () => {
    return apiCall('/api/admin/search-stats');
  },

  // Get revenue stats
  getRevenueStats: async () => {
    return apiCall('/api/admin/revenue-stats');
  },

  // Get all amenities
  getAmenities: async () => {
    return apiCall('/api/admin/amenities');
  },

  // Properties management
  properties: {
    // Get all properties (admin)
    getAll: async (keyword?: string, status?: string) => {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (status) params.append('status', status);
      
      return apiCall(`/api/admin/properties?${params.toString()}`);
    },

    // Get single property (admin)
    getById: async (id: string) => {
      return apiCall(`/api/admin/properties/${id}`);
    },

    // Create new property
    create: async (propertyData: any) => {
      return apiCall('/api/admin/properties', {
        method: 'POST',
        body: JSON.stringify(propertyData),
      });
    },

    // Update property
    update: async (id: string, propertyData: any) => {
      return apiCall(`/api/admin/properties/${id}`, {
        method: 'PUT',
        body: JSON.stringify(propertyData),
      });
    },

    // Delete property
    delete: async (id: string) => {
      return apiCall(`/api/admin/properties/${id}`, {
        method: 'DELETE',
      });
    },

    // Close deal (sell/rent)
    closeDeal: async (id: string, dealData: {
      transaction_type: 'Sold' | 'Rented';
      final_price: number;
      user_id?: number;
    }) => {
      return apiCall(`/api/admin/properties/${id}/close-deal`, {
        method: 'POST',
        body: JSON.stringify(dealData),
      });
    },

    // Upload gallery images
    uploadImages: async (id: string, files: File[]) => {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      return fetch(`${API_BASE_URL}/api/admin/properties/${id}/images`, {
        method: 'POST',
        headers: getAuthHeadersMultipart(),
        body: formData,
      }).then(response => {
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        return response.json();
      });
    },

    // Delete gallery image
    deleteImage: async (imageId: string) => {
      return apiCall(`/api/admin/images/${imageId}`, {
        method: 'DELETE',
      });
    },
  },
};

// Customer API calls
export const customerAPI = {
  // Get user's favorites
  getFavorites: async () => {
    return apiCall('/api/customer/favorites');
  },

  // Add to favorites
  addFavorite: async (propertyId: number) => {
    return apiCall('/api/customer/favorites', {
      method: 'POST',
      body: JSON.stringify({ propertyId }),
    });
  },

  // Remove from favorites
  removeFavorite: async (propertyId: number) => {
    return apiCall(`/api/customer/favorites/${propertyId}`, {
      method: 'DELETE',
    });
  },
};

// File upload API
export const uploadAPI = {
  // Upload main image
  uploadMainImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    return fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: getAuthHeadersMultipart(),
      body: formData,
    }).then(response => {
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      return response.json();
    });
  },
};

// Contact form API
export const contactAPI = {
  sendMessage: async (contactData: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }) => {
    return apiCall('/api/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },
};

export default apiCall;