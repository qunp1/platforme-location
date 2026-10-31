export function createCookieWriter(secure) {
  return function cookies(res, session) {
    res.setHeader(
      'Set-Cookie',
      ['access_token', 'refresh_token'].map(
        (name) =>
          `${name}=${encodeURIComponent(session?.[name] || '')}; HttpOnly; SameSite=Lax; Path=/api; Max-Age=${session ? (name === 'access_token' ? session.expires_in || 3600 : 2592000) : 0}${secure ? '; Secure' : ''}`,
      ),
    );
  };
}

export function parseCookies(header) {
  return Object.fromEntries(
    (header || '')
      .split(';')
      .filter((x) => x.includes('='))
      .map((x) => {
        const i = x.indexOf('=');
        return [x.slice(0, i).trim(), decodeURIComponent(x.slice(i + 1))];
      }),
  );
}
