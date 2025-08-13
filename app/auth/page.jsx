'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); 
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'register') {
      // 회원가입 요청
      // 회원가입 요청 부분
    const res = await api.post('/api/auth/register', {
  email: form.email, // username → email
  password: form.password,
  name: form.name
});


      if (res.ok) {
        alert('회원가입 성공! 로그인해주세요.');
        setMode('login');
      } else {
        const err = await res.text();
        alert(err || '회원가입 실패');
      }
    } 
    else {
      // 로그인 요청
      const res = await api.post('/api/auth/login', {
  email: form.email, // username → email
  password: form.password
});


      if (res.ok) {
        alert('로그인 성공');
        router.push('/'); // 로그인 후 메인 페이지로 이동
      } else {
        const err = await res.text();
        alert(err || '로그인 실패');
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h1>{mode === 'login' ? '로그인' : '회원가입'}</h1>
      <form onSubmit={onSubmit}>
        <input
          placeholder="이메일"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <br />
        <input
          placeholder="비밀번호"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <br />
        {mode === 'register' && (
          <>
            <input
              placeholder="이름"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <br />
          </>
        )}

        <button type="submit">
          {mode === 'login' ? '로그인' : '회원가입'}
        </button>
      </form>
      <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? '회원가입으로' : '로그인으로'}
      </button>
    </div>
  );
}
