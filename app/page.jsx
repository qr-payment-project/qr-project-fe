'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { api } from '@/lib/api';

export default function Home() {
  const { user, loading, refreshUser } = useUser();
  const [msg, setMsg] = useState('');
  const router = useRouter();

  if (loading) return <div style={{ padding: 16 }}>로딩 중...</div>;

  const callProtected = async () => {
    const res = await api.get('/api/protected/hello'); // 백엔드에서 인증 필요 엔드포인트
    setMsg(res.ok ? await res.text() : `실패: ${res.status}`);
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
