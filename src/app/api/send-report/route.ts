import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // קריאת גוף הבקשה (הטקסט של הדוח)
    const { reportText } = await req.json();

    if (!reportText) {
      return NextResponse.json({ error: 'No report text provided' }, { status: 400 });
    }

    // הגדרת טרנספורטר של Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // שליפה מהקובץ .env.local
        pass: process.env.GMAIL_PASS, // שליפה מהקובץ .env.local
      },
    });

    // הגדרת פרטי המייל
    const mailOptions = {
      from: process.env.GMAIL_USER, // שליפה מהקובץ .env.local
      to: process.env.GMAIL_USER, // שליחה למייל שלך
      subject: 'דוח השבתה',
      text: reportText, // שליחה של הטקסט בלבד
    };

    // שליחת המייל
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
