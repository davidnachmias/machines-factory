import React from "react";
import * as XLSX from "xlsx";

interface ExportToExcelProps {
  data: {
    machineName?: string;
    machineType?: string;
    downtimeDays?: number;
    downtimeHours?: number;
    downtimeMinutes?: number;
    repairCost?: string;
    empty?: number;
  }[];
  sendToMail?: boolean;
}

const ExportToExcel: React.FC<ExportToExcelProps> = ({ data, sendToMail }) => {
  const handleExport = () => {
    // הגדרת סדר עמודות הפוך כדי ש-Excel יציג אותן נכון
    const translatedData = data.map((row) => ({
      "עלות תיקון": row.repairCost ? `${row.repairCost} ₪` : "",
      "סה\"כ זמן השבתה": row.empty
        ? ""
        : `${row.downtimeDays} ימים, ${row.downtimeHours} שעות, ${row.downtimeMinutes} דקות`,
      "סוג מכונה": row.machineType,
      "שם מכונה": row.machineName,
    }));

    // יצירת גיליון Excel
    const ws = XLSX.utils.json_to_sheet(translatedData, { skipHeader: false });

    // הגדרת רוחב עמודות
    ws["!cols"] = Object.keys(translatedData[0]).map(() => ({ width: 20 }));

    // יצירת חוברת עבודה
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "דוח השבתה");

    if (sendToMail) {
      const excelBlob = new Blob(
        [XLSX.write(wb, { bookType: "xlsx", type: "array" })],
        {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      );

      const formData = new FormData();
      formData.append("file", excelBlob, "downtime_report.xlsx");

      fetch("/api/send-email", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message || "Email sent successfully!");
        })
        .catch(() => {
          alert("Error sending email");
        });
    } else {
      XLSX.writeFile(wb, "downtime_report.xlsx");
    }
  };

  return (
    sendToMail ? (
      <button
        onClick={handleExport}
        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
      >
        שלח למייל Excel
      </button>
    ) : (
      <button
        onClick={handleExport}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        הורד Excel
      </button>
    )
  );
};

export default ExportToExcel;
