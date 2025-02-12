import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
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
      to: process.env.GMAIL_SUPPORT, // שליחה למייל שלך
      subject: "דוח השבתה",
      text: "מצורף דוח השבתה", // טקסט מלווה
      attachments: [
        {
          filename: (formData.get("file") as File).name,
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
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: `Failed to add fault: ${errorMessage}` }, { status: 500 });
  }
}