import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

interface Machine {
  machineName: string;
  machineType: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DBNAME as string; // קבלת שם הדאטהבייס מהסביבה
    if (!dbName) {
      throw new Error("Database name is not defined in environment variables.");
    }

    const db = client.db(dbName); // שימוש בשם מהסביבה
    const collection = db.collection('machines');

    const { machineName, machineType }: Machine = await req.json();

    await collection.insertOne({ name: machineName, type: machineType });

    return NextResponse.json({ message: 'Machine added successfully!' }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to add machine:', error);
    return NextResponse.json({ error: `Failed to add machine: ${error.message}` }, { status: 500 });
  }
}