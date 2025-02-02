import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Machine from '@/models/Machine';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();

    const machines = await Machine.find({});
    return NextResponse.json(machines, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch machines:', error);
    return NextResponse.json({ error: `Failed to fetch machines: ${error.message}` }, { status: 500 });
  }
}
