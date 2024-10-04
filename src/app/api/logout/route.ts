import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

// Set a past expiry date to remove the token
function clearTokenCookie() {
  return serialize('auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1,  // Set a past expiry date
    path: '/',
  });
}

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });

  // Remove the token by clearing the cookie
  response.headers.set('Set-Cookie', clearTokenCookie());

  return response;
}
