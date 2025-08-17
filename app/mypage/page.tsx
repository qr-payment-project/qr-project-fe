'use client';
import { useEffect, useState } from 'react';

export default function MyPage() {
    const [user, setUser] = useState<{ username: string; email: string } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/auth/mypage", {
                    credentials: "include", // ✅ 쿠키 포함해서 요청
                });

                if (!res.ok) {
                    throw new Error("인증 실패");
                }

                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error(err);
                setUser(null);
            }
        };

        fetchData();
    }, []);

    if (!user) {
        return <h1 style={{ textAlign: 'center', marginTop: '100px' }}>로그인이 필요합니다</h1>;
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {user.username}님 반갑습니다 🎉
            </h1>
        </div>
    );
}