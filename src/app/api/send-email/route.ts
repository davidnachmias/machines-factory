import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // קריאת גוף הבקשה (הקובץ ה-PDF)
    const formData = await req.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // המרת הקובץ לפורמט Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // הגדרת טרנספורטר של Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // שליפה מהקובץ .env.local
        pass: process.env.GMAIL_PASS, // שליפה מהקובץ .env.local
      },
    });

    // הגדרת פרטי המייל
    const mailOptions = {
      from: process.env.GMAIL_USER, // שליפה מהקובץ .env.local
      to: process.env.GMAIL_USER, // שליחה למייל שלך
      subject: "דוח השבתה",
      text: "מצורף דוח השבתה ב-PDF", // טקסט מלווה
      attachments: [
        {
          filename: "downtime_report.pdf",
          content: fileBuffer,
        },
      ],
    };

    // שליחת המייל
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
    }
}