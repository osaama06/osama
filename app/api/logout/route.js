import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully' })

  // حذف الكوكيز: ضبط maxAge=0 يعني تنتهي صلاحية الكوكيز فوراً
  response.cookies.set('token', '', {
    maxAge: 0,
    path: '/',       // لازم نفس path اللي ضبطته عند تسجيل الدخول
    httpOnly: true,  // نفس الخصائص الأصلية
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return response
}
