import React, { useState } from "react";
import axios from "axios";
import { Fault } from "@/models/Machine";

interface CloseFaultFormProps {
  fault: Fault;
  onClose: (status: string) => void;
}

export default function CloseFaultForm({
  fault,
  onClose,
}: CloseFaultFormProps) {
  const [partsUsed, setPartsUsed] = useState("");
  const [repairCost, setRepairCost] = useState("");
  const [repairDescription, setRepairDescription] = useState("");

  const handleCloseFault = async () => {
    try {
      console.log({
        faultId: fault._id,
        partsUsed,
        repairCost,
        repairDescription,
      });

      const response = await axios.post("/api/close-fault", {
        faultId: fault._id,
        partsUsed,
        repairCost,
        repairDescription,
      });

      if (response.status === 200) {
        alert("התקלה נסגרה בהצלחה!");
        onClose("closed");
      } else {
        alert(`שגיאה: ${response.data.error}`);
      }
    } catch (error: unknown) {
      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(`שגיאה: ${errorMessage}`);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-96">
        {/* כפתור סגירה */}
        <button
          onClick={() => onClose("cancelled")}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-xl"
        >
          ❌
        </button>
        <h2 className="text-xl font-semibold mb-4 pt-8">סגירת תקלה</h2>

        {/* הצגת פרטי התקלה */}
        <div className="text-right bg-gray-100 p-3 rounded-md mb-4">
          <p>
            <strong>שם מכונה:</strong> {fault.machineName}
          </p>
          <p>
            <strong>סוג מכונה:</strong> {fault.machineType}
          </p>
          <p>
            <strong>סוג פעולה:</strong> {fault.formType}
          </p>
          <p>
            <strong>תיאור:</strong> {fault.description}
          </p>
          <p>
            <strong>תאריך:</strong> {fault.date}
          </p>
        </div>

        <input
          type="text"
          placeholder="חלפים שהוחלפו"
          className="border p-2 mb-2 w-full"
          value={partsUsed}
          onChange={(e) => setPartsUsed(e.target.value)}
          required
        />
        <input
          type="string"
          placeholder="עלות תיקון"
          className="border p-2 mb-4 w-full"
          value={repairCost}
          step="0.01"
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) setRepairCost(value);
          }}
          required
        />
        <input
          type="text"
          placeholder="תיאור תיקון"
          className="border p-2 mb-4 w-full"
          value={repairDescription}
          onChange={(e) => setRepairDescription(e.target.value)}
        />

        {/* כפתורים */}
        <div className="flex justify-between">
          <button
            onClick={() => onClose("cancelled")}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            ביטול
          </button>
          <button
            onClick={() => {
              if (!partsUsed.trim() || !repairCost.trim()) {
                alert("אנא מלא את כל השדות הנדרשים.");
                return;
              }
              handleCloseFault();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            אישור
          </button>
        </div>
      </div>
    </div>
  );
}
