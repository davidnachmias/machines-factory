"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import PasswordPopup from "./PasswordPopup";
import CloseFaultForm from "./CloseFaultForm";
import  { Fault } from "@/models/Machine";

export default function CloseFault() {
  const [faults, setFaults] = useState<Fault[]>([]);
  const [selectedFault, setSelectedFault] = useState<Fault | null>(null);
  const [isPasswordPopupOpen, setPasswordPopupOpen] = useState(false);
  const [isAuthorized, setAuthorized] = useState(false);

  useEffect(() => {
    const fetchFaults = async () => {
      try {
        const response = await axios.get<Fault[]>("/api/open-faults");
        setFaults(response.data);
      } catch (error) {
        console.error("Error fetching faults:", error);
      }
    };
    fetchFaults();
  }, []);

  const handleOpenPasswordPopup = (fault: Fault) => {
    setSelectedFault(fault);
    setPasswordPopupOpen(true);
  };

  const handleFaultClosed = (faultId: string) => {
    setFaults(faults.filter(fault => fault._id !== faultId));
    setAuthorized(false);
  };

  return (
    <div className="flex flex-col items-center max-h-screen p-8">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        סגירת תקלה
      </h1>
      <div className="w-full max-w-6xl">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">שם מכונה</th>
              <th className="py-2 px-4 border-b">סוג מכונה</th>
              <th className="py-2 px-4 border-b">סוג פעולה</th>
              <th className="py-2 px-4 border-b">תאריך פתיחה</th>
              <th className="py-2 px-4 border-b">תיאור התקלה</th>
              <th className="py-2 px-4 border-b">פעולה</th>
            </tr>
          </thead>
          <tbody>
            {faults.map((fault) => (
              <tr key={fault._id}>
                <td className="py-2 px-4 border-b">{fault.machineName}</td>
                <td className="py-2 px-4 border-b">{fault.machineType}</td>
                <td className="py-2 px-4 border-b">{fault.formType}</td>
                <td className="py-2 px-4 border-b">{fault.date}</td>
                <td className="py-2 px-4 border-b">{fault.description}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleOpenPasswordPopup(fault)}
                    className="py-1 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    סגור תקלה
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* פופאפ סיסמה */}
      {isPasswordPopupOpen && selectedFault && (
        <PasswordPopup
          onClose={() => setPasswordPopupOpen(false)}
          onAuthorized={() => {
            setAuthorized(true);
            setPasswordPopupOpen(false);
          }}
        />
      )}

      {/* טופס סגירת תקלה לאחר אימות סיסמה */}
      {isAuthorized && selectedFault && (
        <CloseFaultForm fault={selectedFault} onClose={() => handleFaultClosed(selectedFault._id)} />
      )}
    </div>
  );
}