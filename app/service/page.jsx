"use client";

import useServiceAuth from "../hooks/useServiceAuth";
import AuthMessage from "../components/AuthMessage";

export default function ServicePage() {
  const { message, isAuthenticated, userEmail, logout } = useServiceAuth();

  return isAuthenticated ? (
    <AuthMessage message={message} userEmail={userEmail} onLogout={logout} />
  ) : (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <p className="text-lg font-semibold">{message}</p>
    </div>
  );
}
