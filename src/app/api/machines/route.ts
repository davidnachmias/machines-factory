import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Machine from '@/models/Machine';

export async function GET(): Promise<NextResponse> {
  try {
    await dbConnect();

    const machines = await Machine.find({});
    return NextResponse.json(machines, { status: 200 });
  } catch (error: unknown) {
    console.error('Failed to fetch machines:', error);
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: `Failed to add fault: ${errorMessage}` }, { status: 500 });
  }
}
