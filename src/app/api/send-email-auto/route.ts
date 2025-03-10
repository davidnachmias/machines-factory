import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import Machine from "@/models/Machine";

export async function GET(): Promise<NextResponse> {
  try {
    if (mongoose.connection.readyState === 0) {
      // פשוט מחבר בלי אפשרויות נוספות
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    const machines = await Machine.find().lean();
    const MAX_ROWS = 500; // מספר השורות המקסימלי

    const data = machines.flatMap((machine) =>
      machine.faults.map((fault) => ({
        machineN: machine.name,
        machineT: machine.type,
        formType: fault.formType,
        description: fault.description,
        date: fault.date,
        status: fault.status,
        closedDate: fault.closedDate || "",
        partsUsed: fault.partsUsed || "",
        repairCost: fault.repairCost ? `₪${fault.repairCost}` : "0",
        repairDesc: fault.repairDescription || "",
      }))
    );

    const limitedData = data.slice(0, MAX_ROWS);

    // הוספת שורת רווח לפני תאריך הדוח
    limitedData.push({
      machineN: "",
      machineT: "",
      formType: "",
      description: "",
      date: "",
      status: "",
      closedDate: "",
      partsUsed: "",
      repairCost: "",
      repairDesc: "",
    });

    // הוספת שורה אחרונה עם תאריך ושעה נוכחיים
    const currentDateTime = new Date().toLocaleString("he-IL", {
      timeZone: "Asia/Jerusalem",
    });

    limitedData.push({
      machineN: "",
      machineT: "",
      formType: "",
      description: "",
      date: "",
      status: "",
      closedDate: "",
      partsUsed: "",
      repairCost: "",
      repairDesc: `תאריך יצירת הדוח: ${currentDateTime}`,
    });

    const ws = XLSX.utils.json_to_sheet(limitedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "דוח תקלות");

    ws["!cols"] = [
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 40 },
    ];

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_SUPPORT,
      subject: "דוח תקלות - עדכון אוטומטי",
      text: "מצורף דוח תקלות שנשלח אוטומטית.",
      attachments: [
        {
          filename: "faults_report.xlsx",
          content: excelBuffer,
        },
      ],
    });

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
