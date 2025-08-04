import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: NextResponse){
    try {
    const {userId} = await auth()
    if (!userId){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    const searchParams = request.nextUrl.searchParams
    const queryUserId = searchParams.get("userId")
    const parentId = searchParams.get("parentId")

    if(!queryUserId || queryUserId !== userId){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    
// review the drizzle orm docs for this section
// connect to db and fetch from a specific folder based on parentid. 
    let userFiles;
    if (parentId){
      userFiles =  await db
        .select()
        .from(files)
        .where(
            and(eq(files.userId, userId),
        eq(files.parentId, parentId))
        )
    }
        else {
            // fetch file from the root level i.e. parentId is null
            userFiles = await db
            .select()
            .from(files)
            .where(
                and(
                    eq(files.userId,userId),
                    isNull(files.parentId)));
        }
        return NextResponse.json(userFiles);
    } catch (error) {
    console.error("Couldn't fetch files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
        
}
}