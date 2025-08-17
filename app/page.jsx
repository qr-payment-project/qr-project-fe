"use client";

import ErrorText from "./components/ErrorText";
import useLoginForm from "./hooks/useLoginForm";

import FormInput from "./components/FormInput";

export default function LoginPage() {
  const {
    email, setEmail,
    password, setPassword,
    emailError, passwordError, serverError,
    handleSubmit
  } = useLoginForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">로그인</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <FormInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
            />
            <ErrorText message={emailError} />
          </div>

          <div>
            <FormInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
            />
            <ErrorText message={passwordError} />
          </div>

          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            로그인
          </button>
          <ErrorText message={serverError} center />
        </form>
      </div>
    </div>
  );
}
