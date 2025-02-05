import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { hebrewFontBase64 } from "../fonts/hebrewFontBase64";

interface ExportToPDFProps {
  data: {
    machineName?: string;
    machineType?: string;
    downtimeDays?: number;
    downtimeHours?: number;
    downtimeMinutes?: number;
    repairCost?: string;
    empty?: number;
  }[];
}

export default function ExportToPDF({ data }: ExportToPDFProps) {
  // פונקציה לבדיקה אם טקסט הוא בעברית בלבד
  const isHebrew = (text: string) => /^[\u0590-\u05FF\s]+$/.test(text);

  // פונקציה שמסדרת טקסט מימין לשמאל רק אם הוא בעברית
  const fixHebrewText = (text: string) => {
    return isHebrew(text) ? text.split("").reverse().join("") : text;
  };

  // פונקציה לחישוב סה"כ זמן השבתה
  const calculateDowntime = (days: number, hours: number, minutes: number) => {
    const text = `${days} ימים, ${hours} שעות ו ${minutes} דקות`;
    return text.split("").reverse().join("");
  };

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    // טעינת הפונט העברי
    doc.addFileToVFS("hebrewFont.ttf", hebrewFontBase64);
    doc.addFont("hebrewFont.ttf", "Hebrew", "normal");
    doc.setFont("Hebrew");

    // כותרת בעברית
    const title = fixHebrewText("דוח השבתה ועלות תיקון");
    doc.text(title, 105, 10, { align: "center", baseline: "middle" });

    // כותרות הטבלה
    const tableColumn = [
        fixHebrewText("עלות תיקון"),
        fixHebrewText('זמן השבתה'),
        fixHebrewText("סוג מכונה"),
        fixHebrewText("שם מכונה"),
    ];

    const tableRows: any[] = [];
    console.log(data, "data");
    

    data.forEach((fault) => {
        if (fault.empty) {
            tableRows.push(["", "", "", ""]);   // הוספת שורה ריקה  לפרד בין הנתונים לסיכום
        }else{
        const totalDowntime = calculateDowntime(
                fault.downtimeDays ?? 0,
                fault.downtimeHours ?? 0,
                fault.downtimeMinutes ?? 0
            );

            tableRows.push([
                fixHebrewText(fault.repairCost ?? "0 ₪"),
                totalDowntime,
                fixHebrewText(fault.machineType || "לא זמין"),
                fixHebrewText(fault.machineName || ""),
            ]);
        }
    });

    // יצירת הטבלה
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { font: "Hebrew", halign: "right" }, // יישור לימין
        columnStyles: {
            0: { halign: "right" },
            1: { halign: "right" },
            2: { halign: "right" },
            3: { halign: "right" },
        },
    });

    doc.save("downtime_report.pdf");
  };

  return (
    <button onClick={generatePDF} className="bg-red-500 text-white px-4 py-2 rounded mt-4">
      ייצא ל-PDF
    </button>
  );
}
