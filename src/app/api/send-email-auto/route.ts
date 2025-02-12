import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import nodemailer from "nodemailer";

export async function GET(): Promise<NextResponse> {
  try {
    // דוגמא לנתונים - יש להתאים לנתוני המערכת שלך
    const data = [
      { machineName: "מכונה 1", machineType: "סוג A", downtimeDays: 2, downtimeHours: 5, downtimeMinutes: 30, repairCost: "1000" },
      { machineName: "מכונה 2", machineType: "סוג B", downtimeDays: 1, downtimeHours: 2, downtimeMinutes: 15, repairCost: "500" }
    ];

    // המרת הנתונים לקובץ Excel
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
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
