import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Machine from '@/models/Machine';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();

    const { faultId, partsUsed, repairCost } = await req.json();

    const machine = await Machine.findOne({ 'faults._id': faultId });
    if (!machine) {
      return NextResponse.json({ error: 'Fault not found' }, { status: 404 });
    }

    const fault = machine.faults.find(fault => fault._id === faultId);
    if (fault) {
      fault.status = 'closed';
      fault.closedDate = new Date().toISOString();
      fault.partsUsed = partsUsed;
      fault.repairCost = repairCost;
      await machine.save();
    }

    return NextResponse.json({ message: 'Fault closed successfully!' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Failed to close fault:', error);
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: `Failed to add fault: ${errorMessage}` }, { status: 500 });
  }
}