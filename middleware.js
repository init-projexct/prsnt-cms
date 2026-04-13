export const config = {
  matcher: ['/pg/:path*'],
};

export default function middleware(req) {
  const url = new URL(req.url);
  const cookie = req.headers.get('cookie') || '';
  const isAuthorized = cookie.includes('b_access=granted');

  // Allow the login process to happen
  const isPublicPath = 
    url.pathname.includes('index') || 
    url.pathname.startsWith('/api/');

  if (isAuthorized || isPublicPath) {
    return new Response(null, { headers: { 'x-middleware-next': '1' } });
  }

  const segments = url.pathname.split('/');
  const folder = segments[2]; // e.g., 'b02'

  if (!folder) return new Response(null, { headers: { 'x-middleware-next': '1' } });

  // REWRITE to the folder root. Vercel will automatically find index.html
  const gatekeeperUrl = new URL(`/pg/${folder}/`, req.url);
  
  return new Response(null, {
    headers: { 'x-middleware-rewrite': gatekeeperUrl.toString() },
  });
}
