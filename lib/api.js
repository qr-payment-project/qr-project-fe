const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

async function request(path, options = {}) {
  try {
    const res = await fetch(API_BASE + path, {
      credentials: 'include', // 쿠키 포함
      headers: { 
        'Content-Type': 'application/json', 
        ...(options.headers || {}) 
      },
      ...options,
    });

    return res;
  } catch (err) {
    console.error(`API 요청 오류: ${path}`, err);
    throw err;
  }
}

async function login(email, password) {
  const res = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: email, password }) // username 사용
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || '로그인 실패');
  }

  return res.json();
}

export const api = {
  get: (url) => request(url, { method: 'GET' }),
  post: (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) }),
  login,
};
