import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // קבלת הקובץ מבקשת ה-POST
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "לא התקבל קובץ. יש לצרף קובץ Excel." },
        { status: 400 }
      );
    }

    // המרת הקובץ לבאפר
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // בדיקת הגדרות הדוא"ל
    if (
      !process.env.GMAIL_USER ||
      !process.env.GMAIL_PASS ||
      !process.env.GMAIL_SUPPORT
    ) {
      console.error("חסרים פרטי התחברות לדואר אלקטרוני");
      return NextResponse.json(
        { error: "תצורת שרת הדואר לא הוגדרה כראוי" },
        { status: 500 }
      );
    }

    // יצירת טרנספורטר של Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // שליחת המייל עם הקובץ כמצורף
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_SUPPORT,
      subject: "דוח השבתה - נשלח מהמערכת",
      text: "מצורף דוח השבתה שנוצר במערכת.",
      attachments: [
        {
          filename: "downtime_report.xlsx",
          content: fileBuffer,
        },
      ],
    });

    return NextResponse.json({ message: "הדוח נשלח בהצלחה!" }, { status: 200 });
  } catch (error: unknown) {
    console.error("שגיאה בשליחת המייל:", error);
    const errorMessage =
      error instanceof Error ? error.message : "שגיאה לא ידועה בשליחת המייל";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// השארת ה-GET יכולה לסייע להפעלת שליחה תקופתית אוטומטית
export async function GET(): Promise<NextResponse> {
  // כאן אפשר ליצור את הדוח באופן אוטומטי ולשלוח במייל
  // הקוד ישמש לדוחות תקופתיים אוטומטיים
  // לדוגמא, אפשר להשתמש בשירות כמו CRON שיקרא לנקודת קצה זו

  try {
    // הקוד הקיים שלך שמייצר ושולח במייל את הדוח
    // ...

    return NextResponse.json(
      { message: "דוח תקופתי נשלח בהצלחה!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("שגיאה בשליחת דוח תקופתי:", error);
    const errorMessage =
      error instanceof Error ? error.message : "שגיאה לא ידועה";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
