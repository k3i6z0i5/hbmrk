import { NextResponse } from 'next/server';
import { generateToken } from '../../../lib/auth';
import { isAllowedAdminEmail } from '../../../lib/firebase';
import { rateLimit } from '../../../lib/rateLimit';

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

  const limitCheck = rateLimit(ip);
  if (!limitCheck.success) {
    return NextResponse.json(
      { error: 'Too many login attempts from this IP, please try again after 15 minutes.' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { email, idToken } = body;

    if (!email) {
      return NextResponse.json({ error: 'Gmail email address is required.' }, { status: 400 });
    }

    if (!isAllowedAdminEmail(email)) {
      return NextResponse.json(
        { error: `Access Denied: The Gmail account '${email}' is not authorized as an administrator.` },
        { status: 403 }
      );
    }

    const token = idToken || generateToken({ email });
    return NextResponse.json({ 
      token,
      email,
      message: 'Admin authenticated successfully via Firebase Gmail Auth.' 
    });
  } catch (err) {
    console.error('Login route error:', err);
    return NextResponse.json({ error: 'Authentication request failed.' }, { status: 400 });
  }
}
