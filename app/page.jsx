'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { api } from '@/lib/api';

export default function Home() {
  const { user, loading, refreshUser } = useUser();
  const [msg, setMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    // 페이지 로드 시 /api/auth/me 호출
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      credentials: 'include', // 세션 쿠키 사용 시 필요
    })
      .then((res) => res.json())
      .then((data) => console.log('백엔드 응답:', data))
      .catch((err) => console.error('API 요청 오류:', err));
  }, []);

  if (loading) return <div style={{ padding: 16 }}>로딩 중...</div>;

  const callProtected = async () => {
    const res = await api.get('/api/protected/hello');
    setMsg(res.ok ? await res.text() : `실패: ${res.status}`);
  };

  const callMeEndpoint = async () => {
    try {
      const res = await api.get('/api/auth/me');
      setMsg(res.ok ? JSON.stringify(await res.json()) : `실패: ${res.status}`);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    await api.post('/api/auth/logout');
    await refreshUser();
  };

  return (
    <div style={{ padding: 16 }}>
      {user ? (
        <>
          <div>
            안녕하세요, <b>{user.email}</b>
          </div>
          <div style={{ marginTop: 8 }}>
            <button onClick={callProtected}>보호 API 호출</button>
            <button onClick={callMeEndpoint} style={{ marginLeft: 8 }}>
              /api/auth/me 호출
            </button>
            <button onClick={logout} style={{ marginLeft: 8 }}>
              로그아웃
            </button>
          </div>
          {msg && <div style={{ marginTop: 8 }}>{msg}</div>}
        </>
      ) : (
        <>
          <div>로그인이 필요합니다.</div>
          <button onClick={() => router.push('/auth')}>로그인/회원가입</button>
        </>
      )}
    </div>
  );
}
