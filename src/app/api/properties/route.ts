import { NextRequest, NextResponse } from 'next/server';
import { Property } from '@/lib/types';

// Mock properties data (same as featured but more items)
const mockProperties: Property[] = [
  {
    id: 1,
    title: 'Sea View Apartment in Patong',
    status: 'For Rent',
    price: 65000,
    price_period: 'monthly',
    bedrooms: 2,
    bathrooms: 2,
    area_sqm: 110,
    description: 'Beautiful sea view apartment with modern amenities and close to beach',
    main_image_url: '/img/property1.jpg',
    created_at: '2024-01-15T00:00:00Z',
    view_count: 125
  },
  {
    id: 2,
    title: 'Luxury Penthouse with Rooftop Pool',
    status: 'For Sale',
    price: 75000000,
    price_period: 'total',
    bedrooms: 3,
    bathrooms: 4,
    area_sqm: 300,
    description: 'Stunning luxury penthouse with private rooftop pool and panoramic ocean views',
    main_image_url: '/img/property2.jpg',
    created_at: '2024-01-10T00:00:00Z',
    view_count: 89
  },
  {
    id: 3,
    title: 'Modern Villa in Chalong',
    status: 'For Sale',
    price: 12000000,
    price_period: 'total',
    bedrooms: 2,
    bathrooms: 1,
    area_sqm: 150,
    description: 'Newly built modern villa in peaceful Chalong area with garden',
    main_image_url: '/img/property3.jpg',
    created_at: '2024-01-05T00:00:00Z',
    view_count: 67
  },
  {
    id: 4,
    title: 'Large Family House in Chalong',
    status: 'For Sale',
    price: 15500000,
    price_period: 'total',
    bedrooms: 5,
    bathrooms: 4,
    area_sqm: 380,
    description: 'Spacious family house perfect for large families with multiple bedrooms',
    main_image_url: '/img/property4.jpg',
    created_at: '2024-01-01T00:00:00Z',
    view_count: 234
  },
  {
    id: 5,
    title: 'Cozy Condo in Karon',
    status: 'For Rent',
    price: 45000,
    price_period: 'monthly',
    bedrooms: 1,
    bathrooms: 1,
    area_sqm: 65,
    description: 'Cozy condo perfect for couples with easy access to Karon Beach',
    main_image_url: '/img/property5.jpg',
    created_at: '2024-01-20T00:00:00Z',
    view_count: 78
  },
  {
    id: 6,
    title: 'Luxury Beachfront Villa',
    status: 'For Sale',
    price: 125000000,
    price_period: 'total',
    bedrooms: 6,
    bathrooms: 7,
    area_sqm: 650,
    description: 'Exclusive beachfront villa with direct beach access and private pool',
    main_image_url: '/img/property6.jpg',
    created_at: '2024-01-12T00:00:00Z',
    view_count: 345
  }
];

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    let filteredProperties = [...mockProperties];

    // Apply filters
    if (status && status !== 'All') {
      filteredProperties = filteredProperties.filter(
        property => property.status.toLowerCase().includes(status.toLowerCase())
      );
    }

    if (type && type !== 'All') {
      // For this mock, we'll assume the type is in the title
      filteredProperties = filteredProperties.filter(
        property => property.title.toLowerCase().includes(type.toLowerCase())
      );
    }

    if (minPrice) {
      filteredProperties = filteredProperties.filter(
        property => property.price >= parseInt(minPrice)
      );
    }

    if (maxPrice) {
      filteredProperties = filteredProperties.filter(
        property => property.price <= parseInt(maxPrice)
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

    const response = {
      properties: paginatedProperties,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredProperties.length / limit),
        totalItems: filteredProperties.length,
        hasNextPage: endIndex < filteredProperties.length,
        hasPrevPage: page > 1
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}