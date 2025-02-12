import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    // צור נתונים לדוח לדוגמה (כאן אתה צריך למשוך נתונים אמיתיים)
    const data = [
      { machineName: "מכונה 1", machineType: "סוג 1", downtimeDays: 2, downtimeHours: 5, downtimeMinutes: 30, repairCost: "200" }
    ];

    // יצירת קובץ Excel
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "דוח השבתה");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    // הגדרת הטרנספורטר של Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // כתובת מייל שולח
        pass: process.env.GMAIL_PASS, // סיסמה (או App Password)
      },
    });

    // שליחת המייל עם הקובץ כקובץ מצורף
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_SUPPORT, // כתובת המקבל
      subject: "דוח השבתה תקופתי",
      text: "מצורף דוח ההשבתה לתקופה האחרונה",
      attachments: [{ filename: "downtime_report.xlsx", content: excelBuffer }],
    });

    return NextResponse.json({ message: "Email sent successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  } 
}