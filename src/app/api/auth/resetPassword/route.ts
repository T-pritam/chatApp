import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/jwt";
import { sendResetPassword } from "@/lib/sendResetPassword";


export async function POST(req: Request) {
    const { email } = await req.json();

    await dbConnect();
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return Response.json({
          status : false,
          message : "User not found"
        })
      }
      else if (!user?.isVerified){
        return Response.json({
          status : false,
          message : "User not verfied continue with signin"
        })
      }
      
      const token = createToken(user);
      const hashed = await bcrypt.hash(token,10)
      user.passwordResetToken = hashed
      user.passwordResetExpires = new Date(Date.now() + 3600)

      console.log(hashed)

      await user.save()
      const username = user.username
      const resetLink = `${user._id}/${hashed}`
      console.log(resetLink)
      const emailResponse = await sendResetPassword(email,user.username,resetLink)
        if (!emailResponse){
            return Response.json({
                status : false,
                message : "Failed to send password reset email."
            })
        }

        return Response.json({
            status : true,
            message : "Password reset Email sent"
        })
      }
    catch (error) {
      console.log(error)
        return Response.json({
            status : false,
            message : error
        })
    }
    
}