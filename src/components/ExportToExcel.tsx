import React, { useState } from "react";
import * as XLSX from "xlsx";

interface ExportToExcelProps {
  data: {
    machineName?: string;
    machineType?: string;
    closedDate: string;
    date: string;
    downtimeDays?: number;
    downtimeHours?: number;
    downtimeMinutes?: number;
    repairCost?: string;
    empty?: number;
  }[];
  sendToMail?: boolean;
}

const ExportToExcel: React.FC<ExportToExcelProps> = ({ data, sendToMail }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async () => {
    try {
      setIsLoading(true);
      
      const now = new Date();
      const dateString = now.toLocaleDateString('he-IL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const timeString = now.toLocaleTimeString('he-IL', {
        hour: '2-digit',
        minute: '2-digit'
      });
      const dateTimeString = `תאריך הפקה: ${dateString} | שעה: ${timeString}`;

      // פורמט הנתונים בטבלה
      const formattedData = data.map(row => ({
        "שם מכונה": { 
          v: row.machineName || "", 
        },
        "סוג מכונה": { 
          v: row.machineType || "", 
        },
        "תאריך פתיחה": { 
          v: row.date || "", 
        },
        "תאריך סגירה": { 
          v: row.closedDate || "", 
        },
        "זמן השבתה": {
          v: row.empty ? "" : 
             row.closedDate === 'סך הכל' ? 
             `${row.downtimeDays} ימים, ${row.downtimeHours} שעות, ${row.downtimeMinutes} דקות` :
             `${row.downtimeDays} ימים, ${row.downtimeHours} שעות, ${row.downtimeMinutes} דקות`,
        },
        "עלות תיקון": {
          v: row.repairCost ? ` ₪ ${row.repairCost}` : "",
        }
      }));

      const headers = ["שם מכונה", "סוג מכונה", "תאריך פתיחה", "תאריך סגירה", "זמן השבתה", "עלות תיקון"];
      const ws = XLSX.utils.json_to_sheet(formattedData, { header: headers });

      // הגדרת RTL
      ws['!dir'] = 'rtl';

      // הגדרת רוחב העמודות
      ws['!cols'] = [
        { width: 25 }, // שם מכונה
        { width: 25 }, // סוג מכונה
        { width: 30 }, // תאריך פתיחה
        { width: 30 }, // תאריך סגירה
        { width: 35 }, // זמן השבתה
        { width: 20 }  // עלות תיקון
      ];

      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:F1');

      // הזזת הנתונים למטה להוספת כותרת
      for (let r = range.e.r; r >= 0; r--) {
        for (let c = range.s.c; c <= range.e.c; c++) {
          const oldCell = XLSX.utils.encode_cell({r: r, c: c});
          const newCell = XLSX.utils.encode_cell({r: r+2, c: c});
          if (ws[oldCell]) {
            ws[newCell] = ws[oldCell];
            if (r === 0) {
              // Keep original header styling
            } else {
              // Adjust cell reference if there are formulas
              if (ws[oldCell].f) ws[newCell].f = ws[oldCell].f;
            }
          }
        }
      }

       // Add the datetime as the first row merged across all columns
       ws["A1"] = { v: dateTimeString, t: 's' };
       ws["!merges"] = [{ s: {r: 0, c: 0}, e: {r: 0, c: 5} }];
       
       // Create an empty row (row 2) for spacing
       // The second row is left empty intentionally, but we'll need to style it consistently
       for (let c = 0; c <= 5; c++) {
         const cellRef = XLSX.utils.encode_cell({r: 1, c: c});
         ws[cellRef] = { v: "", t: 's' };
       }
       
       // Style the datetime row
       ws["A1"].s = {
         font: {
           bold: true,
           color: { rgb: "000000" }
         },
         alignment: {
           horizontal: 'right',
           vertical: 'center'
         },
         border: {
           top: { style: 'thin' },
           bottom: { style: 'thin' },
           left: { style: 'thin' },
           right: { style: 'thin' }
         }
       };
 
       // Update the worksheet range to include the new rows
       ws['!ref'] = XLSX.utils.encode_range({
         s: { r: 0, c: 0 },
         e: { r: range.e.r + 2, c: range.e.c }
       });
 
      // עיצוב הכותרות
      const headerStyle = {
        fill: {
          patternType: 'solid',
          fgColor: { rgb: "C5D9F1" }
        },
        font: {
          bold: true,
          color: { rgb: "000000" }
        },
        alignment: {
          horizontal: 'right',
          vertical: 'center',
          wrapText: true
        },
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        }
      };

      // החלת עיצוב על כותרות העמודות
      ['A2', 'B2', 'C2', 'D2', 'E2', 'F2'].forEach(cellRef => {
        if (ws[cellRef]) {
          ws[cellRef].s = headerStyle;
        }
      });

      const wb = XLSX.utils.book_new();
      wb.Workbook = {
        Views: [{ RTL: true }]
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

        const response = await fetch("/api/send-email", {
          method: "POST",
          body: formData,
        });
          
        const result = await response.json();
        
        if (response.ok) {
          alert(result.message || "הדוח נשלח בהצלחה!");
        } else {
          throw new Error(result.error || "שגיאה בשליחת הדוח");
        }
      } else {
        XLSX.writeFile(wb, "downtime_report.xlsx");
      }
    } catch (error) {
      console.error("שגיאה בייצוא/שליחת קובץ Excel:", error);
      alert(error instanceof Error ? error.message : "שגיאה בפעולה");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isLoading}
      className={`
        ${sendToMail ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}
        text-white py-2 px-4 rounded-lg transition duration-200
        ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
        flex items-center justify-center gap-2
      `}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {sendToMail ? "שלח למייל Excel" : "הורד Excel"}
    </button>
  );
};

export default ExportToExcel;