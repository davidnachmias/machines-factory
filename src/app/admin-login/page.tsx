"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      Cookies.set("admin-auth", password, { path: "/" });

      // הוספת השהיה כדי לוודא שהעוגיה נשמרה לפני הניווט
      setTimeout(() => {
        router.push("/report");
      }, 100);
    } else {
      setError("סיסמה שגויה");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">כניסת מנהל</h2>
      <input
        type="password"
        placeholder="הכנס סיסמת אדמין"
        className="border p-2 mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        התחבר
      </button>
    </div>
  );
}
