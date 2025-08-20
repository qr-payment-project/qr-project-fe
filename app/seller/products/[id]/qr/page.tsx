"use client";
import { useState } from "react";

export default function QrPage({ params }: { params: { id: string } }) {
    const [qrUrl, setQrUrl] = useState<string | null>(null);

    const issueQr = async () => {
        const res = await fetch(`http://localhost:8080/api/products/${params.id}/qr`, {
            method: "POST",
            credentials: "include", // 쿠키 포함
            headers: {
                "X-UID": "1"   // sellerId (임시)
            }
        });

        if (!res.ok) {
            alert("QR 발급 실패");
            return;
        }

        // ✅ 이미지 blob으로 받기
        const blob = await res.blob();
        const url = URL.createObjectURL(blob); // 브라우저에서 임시 url 생성
        setQrUrl(url);
    };

    return (
        <div style={{ textAlign: "center", marginTop: 50 }}>
            <h1>상품 {params.id} QR 발급</h1>
            <button onClick={issueQr} style={{ padding: 10, margin: 20 }}>
                QR 발급하기
            </button>

            {qrUrl && (
                <div>
                    <h3>QR 코드:</h3>
                    <img src={qrUrl} alt="QR Code" />
                </div>
            )}
        </div>
    );
}
