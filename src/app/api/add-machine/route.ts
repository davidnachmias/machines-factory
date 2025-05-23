import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Machine from "@/models/Machine";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();

    const {
      machineName,
      machineType,
    }: { machineName: string; machineType: string } = await req.json();

    await Machine.create({ name: machineName, type: machineType });

    return NextResponse.json(
      { message: "Machine added successfully!" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Failed to add machine:", error);

    let errorMessage = "Unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: `Failed to add fault: ${errorMessage}` },
      { status: 500 }
    );
  }
}
