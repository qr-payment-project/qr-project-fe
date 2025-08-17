"use client";

import { useEffect, useState } from "react";
import { decodeJWT } from "../utils/decodeJWT";

export default function useServiceAuth() {
  const [message, setMessage] = useState("서비스 확인 중...");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      logout();
      return;
    }

    const payload = decodeJWT(token);
    if (!payload) {
      console.error("JWT 디코딩 실패");
      logout();
      return;
    }

    const expireAt = payload.exp * 1000;
    const now = Date.now();
    if (expireAt <= now) {
      alert("토큰이 만료되었습니다.");
      logout();
      return;
    }

    setUserEmail(payload.sub || "");

    const timeout = setTimeout(() => {
      alert("세션이 만료되어 로그아웃됩니다.");
      logout();
    }, expireAt - now);

    fetch("/service/test", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("토큰 유효성 실패");
        return res.text();
      })
      .then((text) => {
        setMessage(text);
        setIsAuthenticated(true);
      })
      .catch((err) => {
        console.error("인증 실패:", err);
        setIsAuthenticated(false);
      });

    return () => clearTimeout(timeout);
  }, []);

  return { message, isAuthenticated, userEmail, logout };
}
