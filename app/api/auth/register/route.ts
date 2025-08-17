import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json(); // { email, password }

    const r = await fetch(`${process.env.BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!r.ok) {
        return new NextResponse(await r.text(), { status: r.status });
    }

    return NextResponse.json({ ok: true });
}
