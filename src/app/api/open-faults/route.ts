import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Machine from '@/models/Machine';
import { stat } from 'fs';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const machines = await Machine.find({
      $or: [
        { 'faults.status': 'open' },
        { 'faults.status': { $exists: false } },
        { 
          'faults.status': 'closed',
          'faults.closedDate': { $gte: twentyFourHoursAgo.toISOString() }
        }
      ]
    });

    const filteredFaults = machines.flatMap(machine =>
      machine.faults
        .filter(fault => 
          fault.status === 'open' ||
          !fault.status ||
          (fault.status === 'closed' && fault.closedDate && new Date(fault.closedDate) >= twentyFourHoursAgo)
        )
        .map(fault => ({
          _id: fault._id,
          machineName: machine.name,
          machineType: machine.type,
          formType: fault.formType,
          description: fault.description,
          status: fault.status,
          date: new Date(fault.date).toLocaleDateString('he-IL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }),
        }))
    );

    return NextResponse.json(filteredFaults, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch faults:', error);
    return NextResponse.json({ error: `Failed to fetch faults: ${error.message}` }, { status: 500 });
  }
}
