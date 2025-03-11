"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const returnUrl = searchParams?.get("returnUrl") || "/report";

  const handleLogin = async () => {
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "";

    if (password === correctPassword) {
      // הגדרת העוגייה עם תוקף לחצי יום
      Cookies.set("admin-auth", password, { expires: 0.5, path: "/" });

      // הכרחת רענון כדי שהמידלוור יזהה את השינוי מיד
      window.location.href = returnUrl;
    } else {
      setError("סיסמה שגויה");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  // בדיקה אם המשתמש כבר מחובר
  useEffect(() => {
    const adminCookie = Cookies.get("admin-auth");
    if (adminCookie === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      router.replace(returnUrl);
    }
  }, [returnUrl, router]);

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            כניסת מנהל
          </h2>
          <p className="mt-2 text-sm text-gray-600">הזן את סיסמת המנהל</p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label htmlFor="password" className="sr-only">
              סיסמה
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              required
              className="w-full px-4 py-3 mt-1 text-right border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out"
              placeholder="הכנס סיסמה"
              dir="rtl"
            />
          </div>

          {error && (
            <div
              className="text-red-500 text-sm text-center font-medium"
              dir="rtl"
            >
              {error}
            </div>
          )}

          <div>
            <button
              onClick={handleLogin}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              התחבר
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
