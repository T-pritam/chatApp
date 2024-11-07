import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import UserModel, { UserType } from '@/model/User';
import Group from '@/model/Group';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        // Fetch all users from the database
        const users = await UserModel.find({});
        const group = await Group.find({});

        for (const user of users) {
            // Map each friend ID to an unread message entry with count 0
            const unreadMessages = user.friends.map(friendId => ({
                id: friendId.toString(),
                count: 0,
            }));

            // Update the user with the new unReadMessages field
            await UserModel.updateOne(
                { _id: user._id },
                { $set: { unReadMessages: unreadMessages } }
            );

            console.log(`Updated user ${user.username} with unread messages.`);
        }

        return NextResponse.json({ message: 'All users updated with unread messages field.' });
    } catch (error) {
        console.error("Error updating unread messages field:", error);
        return NextResponse.json({ message: 'Error updating unread messages field', error }, { status: 500 });
    }
}
