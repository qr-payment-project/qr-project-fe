const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

async function request(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    credentials: 'include', // 쿠키 포함
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  // 401일 경우 토큰 재발급 시도
  if (res.status === 401) {
    const refreshRes = await fetch(API_BASE + '/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });
    if (refreshRes.ok) {
      return fetch(API_BASE + path, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        ...options,
      });
    }
  }

  return res;
}

export const api = {
  get: (url) => request(url, { method: 'GET' }),
  post: (url, body) =>
    request(url, { method: 'POST', body: JSON.stringify(body) }),
};
