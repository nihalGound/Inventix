import { NextRequest, NextResponse } from "next/server";

export default async function GET(req:NextRequest) {
    try {
        const body = await req.json()
        const {billId} = body
        if(!billId) {
            return NextResponse.json(
                {message: "billId not found"},
                
            )
        }
    } catch (error) {
        
    }
}