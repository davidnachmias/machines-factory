import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// הגדרת Multer לאחסון זמני
const upload = multer({ dest: 'uploads/' });
const uploadMiddleware = upload.single('file');

// הפיכת Multer ל-Promise כדי שיעבוד עם Next.js
const parseForm = (req: NextRequest) =>
  new Promise<void>((resolve, reject) => {
    // יצירת אובייקט של IncomingMessage
    const reqClone = req as any;
    uploadMiddleware(reqClone, {} as any, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    console.log('req:', req,'------');
    await parseForm(req);

    // השגת הקובץ מהבקשה
    const file = (req as any).file;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const { path: filePath, originalname } = file;

    // יצירת טרנספורטר של Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'hadassyemini@gmail.com', // ✨ שנה לכתובת המייל שלך
        pass: 'zoeh ktbf zcrd pstu', // ✨ צור סיסמה מיוחדת לאפליקציה
      },
    });

    // הגדרת פרטי המייל
    const mailOptions = {
      from: 'hadassyemini@gmail.com',
      to: 'hadassyemini@gmail.com', // ✨ שנה לכתובת הנמען
      subject: 'דוח השבתה',
      text: 'מצורף דוח השבתה בפורמט Excel.',
      attachments: [{ filename: originalname, path: filePath }],
    };

    // שליחת המייל
    await transporter.sendMail(mailOptions);

    // מחיקת הקובץ לאחר השליחה
    fs.unlinkSync(filePath);

    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
