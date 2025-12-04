import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAdminAccess, isValidDesignation } from '@/config/admins';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Log the session info for debugging
    console.log('Session info:', {
      email: session?.user?.email,
      name: session?.user?.name
    });

    if (!session?.user?.email) {
      console.log('No session or email found');
      return NextResponse.json({ 
        isAdmin: false, 
        error: 'Not authenticated',
        details: 'No session or email found'
      }, { status: 401 });
    }

    const adminAccess = getAdminAccess(session.user.email);
    console.log('Admin access check:', {
      email: session.user.email,
      adminFound: !!adminAccess,
      designation: adminAccess?.designation
    });
    
    if (!adminAccess) {
      return NextResponse.json({ 
        isAdmin: false, 
        error: 'Not authorized',
        details: 'User not found in admin list'
      }, { status: 403 });
    }

    if (!isValidDesignation(adminAccess.designation)) {
      return NextResponse.json({ 
        isAdmin: false, 
        error: 'Invalid designation',
        details: `Invalid designation: ${adminAccess.designation}`
      }, { status: 403 });
    }

    return NextResponse.json({
      isAdmin: true,
      designation: adminAccess.designation,
      discordId: adminAccess.discordId,
      email: session.user.email
    });

  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json({ 
      isAdmin: false, 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 