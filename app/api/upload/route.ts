import { auth } from "@clerk/nextjs/server";

import {db} from "@/lib/db";

import { files } from "@/lib/db/schema";

import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest){
   try { 
    const {userId} = await auth()
    if(!userId){
        return NextResponse.json({error: 
            "Unauthorized"}, {status:401});
    } 
   const body = await request.json()
   const {imagekit,  userId: bodyUserId} = body

   if (bodyUserId !== userId){
    return NextResponse.json({error: 
            "Unauthorized"}, {status:401});
   }
     
   if(!imagekit || !imagekit.url){
     return NextResponse.json({error: 
            "Invalid file upload data"}, {status:400});
   }

   const fileData = {
    name: imagekit.name || "Untitled",
      path: imagekit.filePath || `/droply/${userId}/${imagekit.name || "Untitled"}`,
      size: imagekit.size || 0,
      type: imagekit.fileType || "image",
      fileUrl: imagekit.url,
      thumbnailUrl: imagekit.thumbnailUrl || null,
      userId: userId,
      parentId: null,
      isFolder: false,
      isStarred: false,
      isTrash: false,
   };

   const [newFile] = await db.insert(files).values(fileData).returning()
   if (!newFile) {
     return NextResponse.json({ error: "File upload failed" }, { status: 500 });
   }
   return NextResponse.json(newFile)
} catch (error) {
    console.error("Error saving info to db:", error);
    return NextResponse.json({error: 
            error instanceof Error ? error.message : "Couldn't save info to db"}, {status:500});
}};
