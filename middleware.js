/**
 * PURE WEB MIDDLEWARE FOR VERCEL
 * No Next.js dependencies. Works with pure HTML/JS projects.
 */

export const config = {
  // Only monitor the 'pg' (protected) folder
  matcher: ['/pg/:path*'],
};

export default function middleware(req) {
  const url = new URL(req.url);
  const cookie = req.headers.get('cookie') || '';
  const isAuthorized = cookie.includes('b_access=granted');

  // 1. ALLOW ASSETS (CSS, JS, Images)
  // We allow files with extensions (like .css or .js) to pass so the login page works.
  const isPublicAsset = 
    url.pathname.includes('.') && 
    !url.pathname.endsWith('.html');
  
  // 2. ALLOW API CALLS
  const isApi = url.pathname.startsWith('/api/');

  // If already logged in, or if it's a script/style/api, let it pass
  if (isAuthorized || isPublicAsset || isApi) {
    return new Response(null, {
      headers: { 'x-middleware-next': '1' },
    });
  }

  // 3. IDENTIFY TARGET FOLDER
  // Extracts 'b01' from /pg/b01/page.html
  const segments = url.pathname.split('/');
  const folder = segments[2]; 

  if (!folder) {
    return new Response(null, {
      headers: { 'x-middleware-next': '1' },
    });
  }

  // 4. THE SECURITY REWRITE
  // Instead of showing the secret page, show the gate (index.html)
  // This keeps the URL in the bar but swaps the content.
  const gatekeeperUrl = new URL(`/pg/${folder}/`, req.url);
  
  return new Response(null, {
    headers: {
      'x-middleware-rewrite': gatekeeperUrl.toString(),
    },
  });
}
