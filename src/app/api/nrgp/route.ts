import { NextResponse } from 'next/server';
import { dbConnect } from '../../lib/dbConnect';
import Nrgp from '@/app/models/nrgp';

// POST: Create a new NRGP record
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const saved = await Nrgp.create(body);

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// GET: Fetch all NRGP records
export async function GET() {
  try {
    await dbConnect();
    const data = await Nrgp.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
