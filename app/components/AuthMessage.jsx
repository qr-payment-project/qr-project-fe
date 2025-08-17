

export default function AuthMessage({ message, userEmail, onLogout }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-lg font-semibold">{message}</p>
      <p className="text-sm text-gray-700">
        로그인된 사용자: <strong>{userEmail}</strong>
      </p>
      <button
        onClick={onLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        로그아웃
      </button>
    </div>
  );
}
