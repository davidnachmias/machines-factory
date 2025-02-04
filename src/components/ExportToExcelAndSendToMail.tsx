import React from "react";
import axios from "axios";

interface ExportToExcelProps {
  data: any[];
}

const ExportToExcelAndSendToMail: React.FC<ExportToExcelProps> = ({ data }) => {
  const handleExport = async () => {
    // תרגום הנתונים
    const translatedData = data.map((row) => ({
      "שם מכונה": row.machineName,
      "סוג מכונה": row.machineType,
      "סה\"כ זמן השבתה": row.empty
        ? ""
        : `${row.downtimeDays} ימים, ${row.downtimeHours} שעות, ${row.downtimeMinutes} דקות`,
      "עלות תיקון": row.repairCost ? `${row.repairCost} ₪` : "",
    }));

    // המרת הנתונים למחרוזת טקסט
    const reportText = translatedData
      .map((row) =>
        Object.entries(row)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n")
      )
      .join("\n\n");

    try {
      const response = await axios.post("/api/send-report", { reportText });

      if (response.status === 200) {
        alert("המייל נשלח בהצלחה!");
      } else {
        alert(`שגיאה בשליחת המייל: ${response.data.error}`);
      }
    } catch (error) {
      console.error("שגיאה בשליחת המייל:", error);
      alert("אירעה שגיאה בשליחת המייל");
    }
  };

  return (
    <div>
      <button
        onClick={handleExport}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-5"
      >
        יצא ושלח במייל
      </button>
    </div>
  );
};

export default ExportToExcelAndSendToMail;
