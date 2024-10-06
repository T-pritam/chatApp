import dbConnect from "@/lib/db";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"



export async function POST(req: Request) {
    const { searchParams } = new URL(req.url)
    const { password } = await req.json();

    await dbConnect();
    try {
        const id = searchParams.get("id")
        const hashed = searchParams.get("hashed")
        const user = await UserModel.findOne({
            _id : id
        });
       if (!user?.isVerified){
        return Response.json({
          status : false,
          message : "User not verfied continue with signin"
        })
        } else if (user?.passwordResetExpires < new Date()){
            return Response.json({
              status : false,
              message : "Link expired Try again"
            })
        } 
        
        else if (hashed == user.passwordResetToken){
            user.password = await bcrypt.hash(password,10)
            user.passwordResetToken = "P"
            user.passwordResetExpires = new Date(Date.now() - 3600)
            await user.save()
            return Response.json({
            status : true,
            message : "Password reset successfully"
        })
        }else{
            return Response.json({
                status : false,
                message : "User not found"
        })
      }
    }
    catch (error) {
      console.log(error)
        return Response.json({
            status : false,
            message : error
        })
    }
}