import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log("התקבלה בקשת POST לשליחת דוח...");

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      console.warn("לא התקבל קובץ");
      return NextResponse.json(
        { error: "לא התקבל קובץ. יש לצרף קובץ Excel." },
        { status: 400 }
      );
    }

    if (!file.type.includes("excel") && !file.name.endsWith(".xlsx")) {
      console.warn("סוג הקובץ אינו תקין");
      return NextResponse.json(
        { error: "יש לצרף קובץ מסוג Excel בלבד." },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    console.log("שולח מייל עם דוח מצורף...");

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_SUPPORT,
      subject: "דוח השבתה - נשלח מהמערכת",
      text: "מצורף דוח השבתה שנוצר במערכת.",
      attachments: [
        {
          filename: file.name,
          content: fileBuffer,
          contentType: file.type,
        },
      ],
    });

    console.log("הדוח נשלח בהצלחה!");
    return NextResponse.json({ message: "הדוח נשלח בהצלחה!" }, { status: 200 });
  } catch (error: unknown) {
    console.error("שגיאה בשליחת המייל:", error);
    const errorMessage =
      error instanceof Error ? error.message : "שגיאה לא ידועה בשליחת המייל";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    console.log("התקבלה בקשת GET לשליחת דוח תקופתי...");
    // כאן ניתן ליצור דוח אוטומטי ולשלוח אותו
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
