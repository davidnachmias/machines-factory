import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Machine from '@/models/Machine';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();

    const machines = await Machine.find({
      $or: [
        { 'faults.status': 'open' },
        { 'faults.status': { $exists: false } }
      ]
    });

    const openFaults = machines.flatMap(machine => 
      machine.faults
        .filter(fault => fault.status === 'open' || !fault.status)
        .map(fault => ({
          _id: fault._id,
          machineName: machine.name,
          machineType: machine.type,
          formType: fault.formType,
          description: fault.description,
          date: new Date(fault.date).toLocaleDateString('he-IL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }),
        }))
    );

    return NextResponse.json(openFaults, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch open faults:', error);
    return NextResponse.json({ error: `Failed to fetch open faults: ${error.message}` }, { status: 500 });
  }
}