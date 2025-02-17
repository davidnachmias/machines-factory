"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import PasswordPopup from "./PasswordPopup";
import CloseFaultForm from "./CloseFaultForm";
import { Fault } from "@/models/Machine";

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

  const handleFaultClosed = (faultId: string, status:string) => {
    setAuthorized(false);
    if (status === "cancelled") return
    setFaults(faults.map(fault =>
      fault._id === faultId ? { ...fault, status: 'closed' } : fault
    ));
  };

  return (
    <div className="flex flex-col items-center max-h-screen p-4 sm:p-8 mt-6">
      <h1 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-6">
        סגירת תקלה
      </h1>

      {/* טבלה במסכים גדולים */}
      <div className="hidden sm:block w-full max-w-6xl overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md">
          <thead className="bg-gray-100">
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
              <tr key={fault._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{fault.machineName}</td>
                <td className="py-2 px-4 border-b">{fault.machineType}</td>
                <td className="py-2 px-4 border-b">{fault.formType}</td>
                <td className="py-2 px-4 border-b">{fault.date}</td>
                <td className="py-2 px-4 border-b">{fault.description}</td>
                <td className="py-2 px-4 border-b text-center">
                  {fault.status === "closed" ? (
                    <span className="py-1 px-3 bg-blue-200 text-blue-800 rounded-md text-sm">
                      נסגר
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenPasswordPopup(fault)}
                      className="py-1 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm"
                    >
                      סגור תקלה
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* תצוגת כרטיסים בטלפונים */}
      <div className="sm:hidden w-full space-y-4">
        {faults.map((fault) => (
          <div
            key={fault._id}
            className="bg-white p-4 shadow-md rounded-md border border-gray-200"
          >
            <p className="text-lg font-semibold text-gray-700">{fault.machineName}</p>
            <p className="text-sm text-gray-500">סוג מכונה: {fault.machineType}</p>
            <p className="text-sm text-gray-500">סוג פעולה: {fault.formType}</p>
            <p className="text-sm text-gray-500">תאריך פתיחה: {fault.date}</p>
            <p className="text-sm text-gray-500">תיאור: {fault.description}</p>
            <div className="mt-3">
              {fault.status === "closed" ? (
                <span className="py-1 px-3 bg-blue-200 text-blue-800 rounded-md text-sm">
                  נסגר
                </span>
              ) : (
                <button
                  onClick={() => handleOpenPasswordPopup(fault)}
                  className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm"
                >
                  סגור תקלה
                </button>
              )}
            </div>
          </div>
        ))}
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
        <CloseFaultForm fault={selectedFault} onClose={(status:string) => handleFaultClosed(selectedFault._id,status)} />
      )}
    </div>
  );
}
