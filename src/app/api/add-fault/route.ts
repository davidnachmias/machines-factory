import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Machine from '@/models/Machine';
import { Types } from 'mongoose';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();

    const { _id, formType, description, date } = await req.json();

    const machine = await Machine.findById(_id);
    if (!machine) {
      return NextResponse.json({ error: 'Machine not found' }, { status: 404 });
    }

    const fault = {
      _id: new Types.ObjectId().toString(),
      formType,
      description,
      date,
      status: 'open', // חדש: סטטוס התקלה
    };

    machine.faults.push(fault);
    await machine.save();

    return NextResponse.json({ message: 'Fault added successfully!' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Failed to add fault:', error);

    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: `Failed to add fault: ${errorMessage}` }, { status: 500 });
  }
}