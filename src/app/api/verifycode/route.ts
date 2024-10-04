import dbConnect from "@/lib/db";
import UserModel from "@/model/User";

export async function POST(req:Request){
    await dbConnect()
    try {
        const {username,verificationCode} = await req.json()
        const user = await UserModel.findOne({username : username})
        console.log(username)
        console.log(user)

        if (!user){
            return Response.json({
                status : false,
                message : "User not found"
            })
        }

        const isCodeValid = user.verifyCode === verificationCode
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeNotExpired && isCodeValid){
            user.isVerified = true
            await user.save()
            return Response.json({
                status : true,
                message : "Acoount verified successfully"
            })
        }else if(!isCodeNotExpired){
            return Response.json({
                status : false,
                message : "Verification code has expired. please signup again to get a new code."
            })
        } else {
            return Response.json({
                status : false,
                message : "Incorrect verifiacation code"
            })
        }
    } catch (error) {
        return Response.json({
            status : false,
            message : "User verifiacation failed"
        })   
    }
}