import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Machine from '@/models/Machine';

export async function GET(): Promise<NextResponse> {
  try {
    await dbConnect();

    const machines = await Machine.find({});
    
    // שליפת התקלות הסגורות בלבד
    const closedFaults = machines.flatMap((machine) =>
      machine.faults
        .filter((fault) => fault.closedDate) // סינון רק תקלות שנסגרו
        .map((fault) => ({
          machineName: machine.name,
          machineType: machine.type,
          closedDate: fault.closedDate,
          date: fault.date,
          repairCost: fault.repairCost,
        }))
    );

    return NextResponse.json(closedFaults, { status: 200 });
  } catch (error: unknown) {
    console.error('Failed to fetch closed faults:', error);
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: `Failed to add fault: ${errorMessage}` }, { status: 500 });
  }
}
