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
    // סידור הנתונים לפי הסדר החדש
    const translatedData = data.map((row) => ({
      "שם מכונה": row.machineName,
      "סוג מכונה": row.machineType,
      'סה"כ זמן השבתה': row.empty
        ? ""
        : `${row.downtimeDays} ימים, ${row.downtimeHours} שעות, ${row.downtimeMinutes} דקות`,
      "עלות תיקון": row.repairCost ? `${row.repairCost} ₪` : "",
    }));

    // יצירת גיליון Excel
    const ws = XLSX.utils.json_to_sheet(translatedData, { skipHeader: false });

    // הגדרת כיוון RTL והגדרות עיצוב לגיליון
    ws['!dir'] = 'rtl';

    // הגדרת סגנונות לכותרות
    const headerStyle = {
      fill: { fgColor: { rgb: "4F81BD" } }, // צבע רקע כחול
      font: { color: { rgb: "FFFFFF" }, bold: true }, // טקסט לבן ומודגש
      alignment: { horizontal: "right" }, // יישור לימין
    };

    // הגדרת רוחב עמודות
    ws["!cols"] = Object.keys(translatedData[0]).map(() => ({ width: 25 }));

    // החלת סגנונות על כותרות
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:D1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (!ws[address]) continue;
      ws[address].s = headerStyle;
    }

    // יצירת חוברת עבודה
    const wb = XLSX.utils.book_new();
    
    // הגדרת כיוון RTL לחוברת העבודה
    wb.Workbook = wb.Workbook || {};
    wb.Workbook.Views = wb.Workbook.Views || [];
    wb.Workbook.Views[0] = {
      RTL: true,
    };

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
          alert(data.message || "הדוח נשלח בהצלחה!");
        })
        .catch(() => {
          alert("שגיאה בשליחת הדוח");
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