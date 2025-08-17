"use client";

import { useState, useEffect } from "react";

export default function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/service";
    }
  }, []);

  const validateForm = () => {
    let valid = true;

    if (!email.includes("@")) {
      setEmailError("유효한 이메일 주소를 입력하세요.");
      valid = false;
    } else {
      setEmailError("");
    }

    const passwordRegex = /^\d{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError("비밀번호는 숫자만 포함하며 최소 8자리여야 합니다.");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await fetch("/auth/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const { token, serviceUrl } = await res.json();
        localStorage.setItem("token", token);
        window.location.href = serviceUrl;
      } else {
        const data = await res.json();
        setServerError(data.error || "로그인 실패");
      }
    } catch (err) {
      setServerError("서버와 통신 중 오류가 발생했습니다.");
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    emailError, passwordError, serverError,
    handleSubmit
  };
}
