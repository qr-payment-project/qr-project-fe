'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // login or register
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'register') {
      const res = await api.post('/api/auth/register', form);
      if (res.ok) {
        alert('회원가입 성공! 로그인해주세요.');
        setMode('login');
      } else {
        alert(await res.text());
      }
    } else {
      const res = await api.post('/api/auth/login', {
        email: form.email,
        password: form.password,
      });
      if (res.ok) {
        alert('로그인 성공');
        router.push('/');
      } else {
        alert(await res.text());
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
        />
        <br />
        <input
          placeholder="비밀번호"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <br />
        {mode === 'register' && (
          <>
            <input
              placeholder="이름"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
