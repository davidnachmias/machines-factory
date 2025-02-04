import React from "react";
import * as XLSX from "xlsx";

interface ExportToExcelProps {
  data: any[];
}

const ExportToExcel: React.FC<ExportToExcelProps> = ({ data }) => {
  const handleExport = () => {
    // המרת הנתונים לאובייקט Excel
    const translatedData = data.map((row) => ({
      "שם מכונה": row.machineName,
      "סוג מכונה": row.machineType,
      "סה\"כ זמן השבתה": row.empty ? '' : `${row.downtimeDays} ימים, ${row.downtimeHours} שעות, ${row.downtimeMinutes} דקות`,
      "עלות תיקון": row.repairCost ? `${row.repairCost} ₪` : "",
    }));

    // המרת הנתונים לאובייקט Excel
    const ws = XLSX.utils.json_to_sheet(translatedData, { skipHeader: false });

    // הגדרת רוחב עמודות אוטומטי לפי התוכן
    const headers = ["שם מכונה", "סוג מכונה", "סה\"כ זמן השבתה", "עלות תיקון"];
    ws["!cols"] = headers.map(() => ({ width: 20 }));

    translatedData.forEach((row, rowIndex) => {
      headers.forEach((header, colIndex) => {
        const cell = ws[XLSX.utils.encode_cell({ r: rowIndex + 1, c: colIndex })]; // הגעה לתא
        if (cell && cell.v) { // בדיקה אם התא קיים ויש לו ערך
          const valueLength = String(cell.v).length; // חישוב אורך התוכן
          
          // בדיקה אם ws["!cols"] קיים לפני הגישה
          if (!ws["!cols"]) {
            ws["!cols"] = []; // יצירת המערך אם לא קיים
          }
          
          // אם !cols[colIndex] לא קיים, יצירתו עם רוחב ברירת מחדל
          if (!ws["!cols"][colIndex]) {
            ws["!cols"][colIndex] = { width: 20 }; // רוחב ברירת מחדל
          }

          const currentWidth = ws["!cols"][colIndex]?.width ?? 20; // אם undefined, תן ערך ברירת מחדל של 20
          ws["!cols"][colIndex].width = Math.max(currentWidth, valueLength + 2); // הגדרת רוחב אופטימלי
          
          // הגדרת כיוון RTL על כל תא
          if (cell.v) {
            cell.s = { alignment: { textRotation: 0, horizontal: "right", vertical: "center" } };
          }
        }
      });
    });

    // יצירת חוברת עבודה
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "דוח השבתה");

    // שמירת הקובץ כ-Excel
    XLSX.writeFile(wb, "דוח_השבתה.xlsx");
  };

  return (
    <div>
      <button
        onClick={handleExport}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-5"
      >
        יצא לאקסל
      </button>
    </div>
  );
};

export default ExportToExcel;
