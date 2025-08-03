import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: NextResponse){
    try {
    const {userId} = await auth()
    } catch {
        
}
}