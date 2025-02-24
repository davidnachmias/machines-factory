// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // הנתיבים שלא דורשים אימות (whitelist)
  const publicPaths = ['/login', '/api', '/_next', '/images', '/favicon.ico'];
  
  // בדוק אם הנתיב הנוכחי הוא ציבורי (לא דורש אימות)
  const isPublicPath = publicPaths.some(path => 
    req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith(path + '/')
  );
  
  // אם זה נתיב ציבורי, אפשר גישה ללא אימות
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // בדוק אם יש קוקי אימות תקף
  const authCookie = req.cookies.get('auth');
  
  // אם אין קוקי תקף, הפנה ללוגין
  if (!authCookie || authCookie.value !== process.env.NEXT_PUBLIC_SITE_PASSWORD) {
    // שמור את הנתיב הנוכחי כדי לחזור אליו אחרי הלוגין
    const url = new URL('/login', req.url);
    url.searchParams.set('returnUrl', req.nextUrl.pathname);
    
    return NextResponse.redirect(url);
  }
  
  // אם יש קוקי תקף, המשך לדף המבוקש
  return NextResponse.next();
}

// עדכון ה-matcher כך שיפעל על כל הנתיבים
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};