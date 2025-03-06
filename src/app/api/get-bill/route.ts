import { getBillDetail } from "@/actions/business";
import { NextRequest, NextResponse } from "next/server";

export default async function GET(req: NextRequest) {
  try {
    const body = await req.json();
    const { billId, businessId, clerkId } = body;
    if (!billId) {
      return NextResponse.json({ message: "billId not found" });
    }
    const bill = await getBillDetail(billId, businessId, clerkId);
    if (bill.status === 200) {
      return NextResponse.json({ data: bill.data }, { status: 200 });
    }
    return NextResponse.json(
      { message: "Something went wrong while fetching bill" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error processing request : ", error);
    return NextResponse.json(
      { error: "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
