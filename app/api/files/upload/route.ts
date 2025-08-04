import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

// initialize imagekit
const imagekit = new ImageKit ({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
})

// always validate an endpint
export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 });
        }
        // parse formData
        const formData = await request.formData()
        const file = formData.get("file") as File
        const formUserId = formData.get("userId") as string
        const parentId = formData.get("parentId") as string || null

        if (formUserId !== userId){
            return NextResponse.json({
                error: "Unauthorized"
            }, { status: 401 });
        }
        if (!file) {
            return NextResponse.json({error: "no file provided"}, {status: 401})
        }
        // check if parent folder exists if one is provided 
        if (parentId){
           const [parentFolder] = await db
           .select()
           .from(files)
           .where(
            and(
                eq(files.id, parentId),
                eq(files.userId, userId),
                eq(files.isFolder, true)));
                if (!parentFolder) {
                    return NextResponse.json(
                        { error: "Parent folder not found" },
                        { status: 404 }
                    );
                }
            }
        } catch {}
}