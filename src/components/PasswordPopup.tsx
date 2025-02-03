import React, { useState } from "react";

interface PasswordPopupProps {
  onClose: () => void;
  onAuthorized: () => void;
}

export default function PasswordPopup({ onClose, onAuthorized }: PasswordPopupProps) {
  const [password, setPassword] = useState("");

  const handlePasswordSubmit = () => {
    if (password === "1234") {
      onAuthorized(); // עדכון `isAuthorized` ב-`CloseFault.tsx`
    } else {
      alert("סיסמה שגויה");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md text-center relative w-96">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
        >
          ❌
        </button>

        <h2 className="text-xl font-semibold mb-4">הזן סיסמה</h2>
        <input
          type="password"
          className="border p-2 mb-4 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handlePasswordSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
          אישור
        </button>
      </div>
    </div>
  );
}
