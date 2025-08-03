import { auth } from "@clerk/nextjs/server";

<<<<<<< HEAD
import {NextResponse } from "next/server";

import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || ""
});

export async function GET() {
    try {const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" },
            { status: 401 })
        }
        const authParams = imagekit.getAuthenticationParameters()
        return NextResponse.json(authParams)
    
    }
    catch {
        return NextResponse.json(
            { error: "Authentication parameters could not be generated" }, { status: 500 });
    }
=======
import { NextResponse } from "next/server";

import {ImageKit} from "imagekit"
const imagekit = new ImageKit ({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
})

export async function GET(){
   try { const {userId} = await auth()
    if(!userId){
        return NextResponse.json({error: "Unauthorized"},

            {status:401}
        )
    } 
    const authParams = imagekit.
    getAuthenticationParameters()
    return NextResponse.json(authParams)
} catch (error) {
    return NextResponse.json({error "Failed to generate authentication parameters for imagekit"}, {status: 500})
}
>>>>>>> 489ec6af8f37a76db7b0a7384d1b5bd7ad48b22f
};