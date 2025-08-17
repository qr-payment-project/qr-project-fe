'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthPage() {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const sp = useSearchParams();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            alert('이메일과 비밀번호를 입력해주세요.');
            return;
        }
        if (mode === 'register' && form.password.length < 8) {
            alert('비밀번호는 8자 이상이어야 합니다.');
            return;
        }

        setLoading(true);
        try {
            const url =
                mode === 'login'
                    ? 'http://localhost:8080/api/auth/login'
                    : 'http://localhost:8080/api/auth/register';

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
                credentials: 'include', // ✅ 쿠키 저장
            });

            if (!res.ok) {
                const text = await res.text();
                alert(text || (mode === 'login' ? '로그인 실패' : '회원가입 실패'));
                return;
            }

            if (mode === 'register') {
                alert('회원가입 성공! 로그인해주세요.');
                setMode('login');
                return;
            }

            alert('로그인 성공');
            const next = sp.get('next') || '/mypage'; // ✅ 로그인 후 마이페이지로 이동
            router.push(next);
        } catch (err) {
            console.error(err);
            alert('네트워크 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f9f9f9',
            }}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    width: '100%',
                    maxWidth: '380px',
                }}
            >
                <h1
                    style={{
                        fontSize: '1.8rem',
                        marginBottom: '1.5rem',
                        textAlign: 'center',
                        color: '#333',
                    }}
                >
                    {mode === 'login' ? '로그인' : '회원가입'}
                </h1>
                <form
                    onSubmit={onSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    {mode === 'register' && (
                        <input
                            placeholder="이름"
                            type="text"
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            required
                            style={inputStyle}
                        />
                    )}
                    <input
                        placeholder="이메일"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        style={inputStyle}
                    />
                    <input
                        placeholder="비밀번호"
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                        minLength={mode === 'register' ? 8 : undefined}
                        style={inputStyle}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#333',
                            color: '#fff',
                            fontSize: '1rem',
                            cursor: 'pointer',
                        }}
                    >
                        {loading ? '처리중...' : mode === 'login' ? '로그인' : '회원가입'}
                    </button>
                </form>
                <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <button
                        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#0070f3',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                        }}
                    >
                        {mode === 'login' ? '회원가입으로' : '로그인으로'}
                    </button>
                </p>
            </div>
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    padding: '0.8rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem',
};
