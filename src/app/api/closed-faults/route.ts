import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Machine from '@/models/Machine';

export async function GET(req: NextRequest): Promise<NextResponse> {
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
  } catch (error: any) {
    console.error('Failed to fetch closed faults:', error);
    return NextResponse.json({ error: `Failed to fetch closed faults: ${error.message}` }, { status: 500 });
  }
}
