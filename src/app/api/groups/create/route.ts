import dbConnect from "@/lib/db";
import GroupModel from "@/model/Group";
import UserModel from "@/model/User";
import { create } from "domain";
import mongoose from "mongoose";


export async function POST(request: Request) {

    await dbConnect();
    try {
        const { name, description, admins, members } = await request.json();
        const group = await GroupModel.create({
            name,
            description,
            members : [admins, ...members],
            admins : [admins],
            createdBy : admins
        })
        // members.forEach(async (member:string) => {
        //     console.log(member)
        //     await UserModel.findByIdAndUpdate(member, {$push : {groups : new mongoose.mongo.ObjectId(group._id)}})
        // })
        // await UserModel.findByIdAndUpdate(admins, {$push : {groups : new mongoose.mongo.ObjectId(group._id)}})
        const allUserIds = [admins, ...members];
        await Promise.all(
            allUserIds.map(async (userId) => {
              await UserModel.findByIdAndUpdate(userId, {
                $push: {
                  groups: group._id,
                  unReadMessages: { id: group._id, count: 0 },
                },
              });
            })
          );
        return Response.json({
            status: true,
            message: "Group created successfully",
            group
        })
        
    } catch (error) {
        console.log(error)
        return Response.json({
            status: false,
            message: "Something went wrong"
        })
    }
}