'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function AuthPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const onChange = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'register') {
        const res = await api.post('/api/auth/register', {
          email: form.email,
          password: form.password,
          name: form.name,
        });
        if (!res.ok)
          throw new Error((await readMessage(res)) || '회원가입 실패');
        alert('회원가입 완료! 로그인해주세요.');
        setMode('login');
      } else {
        const res = await api.post('/api/auth/login', {
          email: form.email,
          password: form.password,
        });
        if (!res.ok) throw new Error((await readMessage(res)) || '로그인 실패');
        router.push('/');
      }
    } catch (err) {
      setError(err.message ?? '처리 중 오류가 발생했어요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="card auth-card">
        <h1 className="title">{mode === 'login' ? '로그인' : '회원가입'}</h1>
        <p className="subtitle">
          {mode === 'login' ? '계정에 접속하세요' : '3초 만에 시작해요'}
        </p>

        <form onSubmit={onSubmit}>
          {mode === 'register' && (
            <div className="field">
              <label htmlFor="name">이름</label>
              <input
                id="name"
                className="input"
                placeholder="홍길동"
                value={form.name}
                onChange={onChange('name')}
                required
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange('email')}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={form.password}
              onChange={onChange('password')}
              required
            />
          </div>

          {error && (
            <div className="alert" role="alert">
              {error}
            </div>
          )}

          <button className="btn-primary" disabled={loading}>
            {loading ? '처리중…' : mode === 'login' ? '로그인' : '회원가입'}
          </button>
        </form>

        <div className="divider">
          <span>또는</span>
        </div>

        <button
          type="button"
          className="btn-ghost"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? '회원가입으로' : '로그인으로'}
        </button>
      </div>
    </div>
  );
}

async function readMessage(res) {
  try {
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const j = await res.json();
      return j?.message || j?.error;
    }
    return await res.text();
  } catch {
    return '';
  }
}
