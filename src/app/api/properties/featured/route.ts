import { NextRequest, NextResponse } from 'next/server';
import { Property } from '@/lib/types';

// Mock featured properties data
const mockFeaturedProperties: Property[] = [
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
    images: [
      { id: 1, image_url: '/img/property1.jpg' }
    ],
    amenities: [
      { id: 1, name: 'Pool', icon: '🏊‍♂️' },
      { id: 2, name: 'Gym', icon: '💪' },
      { id: 3, name: 'Security', icon: '🛡️' },
      { id: 4, name: 'Parking', icon: '🚗' }
    ],
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
    images: [
      { id: 2, image_url: '/img/property2.jpg' }
    ],
    amenities: [
      { id: 5, name: 'Private Pool', icon: '🏊‍♀️' },
      { id: 6, name: 'Ocean View', icon: '🌊' },
      { id: 7, name: 'Luxury Finishes', icon: '✨' },
      { id: 8, name: 'Rooftop Terrace', icon: '🏙️' }
    ],
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
    images: [
      { id: 3, image_url: '/img/property3.jpg' }
    ],
    amenities: [
      { id: 9, name: 'Garden', icon: '🌿' },
      { id: 10, name: 'Modern Design', icon: '🏗️' },
      { id: 11, name: 'Quiet Area', icon: '🤫' },
      { id: 12, name: 'Parking', icon: '🚗' }
    ],
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
    images: [
      { id: 4, image_url: '/img/property4.jpg' }
    ],
    amenities: [
      { id: 13, name: 'Large Bedrooms', icon: '🛏️' },
      { id: 14, name: 'Family Friendly', icon: '👨‍👩‍👧‍👦' },
      { id: 15, name: 'Big Garden', icon: '🌳' },
      { id: 16, name: 'Multiple Bathrooms', icon: '🚿' }
    ],
    created_at: '2024-01-01T00:00:00Z',
    view_count: 234
  }
];

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would fetch from database
    // const featuredProperties = await db.properties.findMany({
    //   where: { featured: true },
    //   orderBy: { createdAt: 'desc' },
    //   take: 4
    // });
    
    // Return mock data for now
    return NextResponse.json(mockFeaturedProperties);
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured properties' },
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