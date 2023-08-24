import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/userModel'
import { NextRequest,NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'
import {sendEmail} from '@/helpers/mailer'

connect()

export async function POST(request:NextRequest){
    try {
        const reqBody = await request.json()
        const {email} = reqBody
        console.log(reqBody)

        //check if user already exists
        const user = await User.findOne({email})

        if(!user){
            return NextResponse.json({error: "Email not registered"}, {status: 400})
        }
        console.log(user)

        // send verification email
        await sendEmail({
            email,emailType: "RESET",userId:user._id
        })

        return NextResponse.json({
            message:"Email exists",
        })

    } catch (error:any) {
        return NextResponse.json({error: error.message},{status: 500})
    }
}