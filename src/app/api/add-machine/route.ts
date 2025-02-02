import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Machine from '@/models/Machine';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();

    const { machineName, machineType }: { machineName: string; machineType: string } = await req.json();

    const newMachine = new Machine({ name: machineName, type: machineType });
    await newMachine.save();

    return NextResponse.json({ message: 'Machine added successfully!' }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to add machine:', error);
    return NextResponse.json({ error: `Failed to add machine: ${error.message}` }, { status: 500 });
  }
}