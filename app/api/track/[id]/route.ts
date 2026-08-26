import { NextRequest, NextResponse } from "next/server";
import { daysLeft, getRecord } from "@/lib/mockDb";
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = getRecord(decodeURIComponent(id));
  if (!record) return NextResponse.json({ error: "Couldn't find that grievance. Check the registration number and try again." }, { status: 404 });
  return NextResponse.json({ ...record, daysLeft: daysLeft(record.slaDeadline) });
}
