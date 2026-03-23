import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const oneDayInSeconds = 60 * 60 * 24;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = body?.password;

  if (typeof password !== 'string') {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const jwtSecret = process.env.JWT_SECRET;

  if (!passwordHash || !jwtSecret) {
    return NextResponse.json({ success: false }, { status: 500 });
  }

  const isMatch = await bcrypt.compare(password, passwordHash);

  if (!isMatch) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const secret = new TextEncoder().encode(jwtSecret);
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: oneDayInSeconds,
  });

  return response;
}
