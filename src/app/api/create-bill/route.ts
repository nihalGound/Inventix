import { generateBill } from "@/actions/business";
import { NextRequest, NextResponse } from "next/server";

interface BillRequestBody {
  businessId: string;
  clerkId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  notes?: string;
  discount?: number;
}

export default async function POST(req: NextRequest) {
  try {
    const body: BillRequestBody = await req.json();

    const {
      businessId,
      clerkId,
      items,
      customerEmail,
      customerName,
      customerPhone,
      notes,
      discount,
    } = body;

    if (!businessId || !clerkId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bill = await generateBill(
      businessId,
      clerkId,
      items,
      customerEmail,
      customerName,
      customerPhone,
      notes,
      discount
    );

    if (bill.status === 201)
      return NextResponse.json(
        { message: "Bill created successfully" },
        { status: 201 }
      );

    return NextResponse.json(
      { message: "Something went wrong while creating bill" },
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
