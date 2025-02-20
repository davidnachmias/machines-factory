import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import nodemailer from "nodemailer";

export async function GET(): Promise<NextResponse> {
  try {
    // דוגמא לנתונים - יש להתאים לנתוני המערכת שלך
    const data = [
      { machineName: "מכונה 1", machineType: "סוג A", downtimeDays: 2, downtimeHours: 5, downtimeMinutes: 30, repairCost: "1000" },
      { machineName: "מכונה 2", machineType: "סוג B", downtimeDays: 1, downtimeHours: 2, downtimeMinutes: 15, repairCost: "500" }
    ];

    // Get current date and time in Israel format
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

    // המרת הנתונים לקובץ Excel
    // Create worksheet from JSON data
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Get the current range
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:Z1');
    
    // Shift all data down by 2 rows to make space for the datetime header and blank row
    for (let r = range.e.r; r >= 0; r--) {
      for (let c = range.s.c; c <= range.e.c; c++) {
        const oldCell = XLSX.utils.encode_cell({r: r, c: c});
        const newCell = XLSX.utils.encode_cell({r: r+2, c: c});
        if (ws[oldCell]) {
          ws[newCell] = ws[oldCell];
          if (ws[oldCell].f) ws[newCell].f = ws[oldCell].f;
          delete ws[oldCell];
        }
      }
    }
    
    // Set RTL for the worksheet
    ws['!dir'] = 'rtl';
    
    // Add the datetime as the first row merged across all columns
    ws["A1"] = { v: dateTimeString, t: 's' };
    
    // Calculate the number of columns to determine the merge width
    const columnCount = range.e.c - range.s.c + 1;
    
    // Add merge for the datetime header row
    if (!ws["!merges"]) ws["!merges"] = [];
    ws["!merges"].push({ s: {r: 0, c: 0}, e: {r: 0, c: columnCount > 0 ? columnCount - 1 : 3} });
    
    // Create an empty row (row 2) for spacing
    // No need to explicitly add empty cells for row 2
    
    // Update the worksheet range to include the new rows
    ws['!ref'] = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: range.e.r + 2, c: range.e.c }
    });

    // Style the datetime row
    if (!ws["A1"].s) ws["A1"].s = {};
    ws["A1"].s = {
      font: {
        bold: true,
        color: { rgb: "000000" }
      },
      alignment: {
        horizontal: 'right',
        vertical: 'center'
      }
    };

    // Create workbook and set RTL
    const wb = XLSX.utils.book_new();
    wb.Workbook = {
      Views: [{ RTL: true }]
    };
    
    XLSX.utils.book_append_sheet(wb, ws, "דוח השבתה");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    // הגדרת טרנספורטר של Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // שליחת המייל עם הקובץ כקובץ מצורף
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_SUPPORT,
      subject: "דוח השבתה - עדכון אוטומטי",
      text: "מצורף דוח השבתה שנשלח אוטומטית.",
      attachments: [
        {
          filename: "downtime_report.xlsx",
          content: excelBuffer,
        },
      ],
    });

    return NextResponse.json({ message: "Email sent successfully!" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}