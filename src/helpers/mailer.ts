import nodemailer from 'nodemailer'
import User from '@/models/userModel'
import bcryptjs from 'bcryptjs'

export const sendEmail = async({email,emailType,userId}:any)=>{
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(),10)
        if(emailType === 'VERIFY'){
            await User.findByIdAndUpdate(userId,{
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000
            })
        }else if(emailType === 'RESET'){
            await User.findByIdAndUpdate(userId,{
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000
            })
        }
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: `${process.env.MAIL_UsER}`,
                pass: `${process.env.MAIL_PASS}`
                // TODO: add these credentials to .env file
            }
        });
        const mailOptions = {
            from:'ramadhansaputra354@gmail.com',
            to: email,
            subject: emailType === 'VERIFY' ? 'Verify your E-Mail':'Reset Your Password',
            html:`<p>Click <a href="${process.env.DOMAIN}/${emailType === 'VERIFY' ? 'verifyemail':'resetpassword'}?token=${hashedToken}">Here</a> to ${emailType === 'VERIFY' ? 'Verify your E-Mail' : 'Reset your password'} or copy and paste the link  below in your browser. <br/> ${process.env.DOMAIN}/${emailType === 'VERIFY' ? 'verifyemail':'resetpassword'}?token=${hashedToken}</p>`
        }
        const mailResponse = await transport.sendMail(mailOptions)
        return mailResponse
    } catch (error:any) {
        throw new Error(error.message)
    }
}