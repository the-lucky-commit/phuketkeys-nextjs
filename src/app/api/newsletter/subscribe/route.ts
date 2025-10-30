// src/app/api/newsletter/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { message: 'Valid email is required' },
        { status: 400 }
      );
    }
    
    // Here you can integrate with:
    // - Your database to store subscribers
    // - Email service like Mailchimp, SendGrid, etc.
    // - Your backend API
    
    console.log('📧 New newsletter subscriber:', email);
    
    // Example: Save to database or call external service
    // await saveSubscriberToDatabase(email);
    // await addToMailchimpList(email);
    
    // For now, just log and return success
    return NextResponse.json(
      { 
        message: 'Successfully subscribed to newsletter!',
        email: email 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET method to check subscription status
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const email = url.searchParams.get('email');
  
  if (!email) {
    return NextResponse.json(
      { message: 'Email parameter is required' },
      { status: 400 }
    );
  }
  
  // Check if email is already subscribed
  // const isSubscribed = await checkSubscriptionStatus(email);
  
  return NextResponse.json({
    email,
    subscribed: false, // Replace with actual check
    message: 'Subscription status checked'
  });
}