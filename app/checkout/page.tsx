'use client';
import { useEffect, useState } from 'react';

type Resolved = { productId: number; name: string; price: number; sellerId: number; token: string; exp: string };

export default function CheckoutPage({ searchParams }: { searchParams: { token?: string } }) {
    const token = searchParams.token;
    const [data, setData] = useState<Resolved | null>(null);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        (async () => {
            if (!token) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/qr/resolve?token=${token}`);
                if (!res.ok) throw new Error(await res.text());
                const d = await res.json();
                setData(d);
            } catch (e:any) { setMsg(e.message); }
        })();
    }, [token]);

    async function buy() {
        if (!data) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'X-UID': '1', // buyer id (데모용)
                },
                body: JSON.stringify({ token: data.token }),
            });
            if (!res.ok) throw new Error(await res.text());
            const r = await res.json(); // { orderId, status: PAID }
            setMsg(`결제 완료! 주문번호 #${r.orderId}`);
        } catch (e:any) { setMsg('결제 실패: ' + e.message); }
    }

    if (!token) return <div className="p-6">잘못된 접근입니다.</div>;
    if (!data) return <div className="p-6">상품 정보 불러오는 중… {msg}</div>;

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl font-bold">결제</h1>
            <div className="border rounded p-4">
                <div className="font-semibold">{data.name}</div>
                <div className="text-sm">가격: {data.price.toLocaleString()}원</div>
                <div className="text-xs text-gray-500">토큰 만료: {new Date(data.exp).toLocaleString()}</div>
            </div>
            <button onClick={buy} className="px-4 py-2 rounded bg-black text-white">구매하기</button>
            {msg && <div className="text-sm">{msg}</div>}
        </div>
    );
}
