import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials", 
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "email",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "password",
                },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {username : credentials.provider.email},
                            {email : credentials.provider.email}
                        ]
                    })
                    if (!user) {
                        throw new Error("User not found");
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.provider.password, user.password)
                    if (!isPasswordCorrect) {
                        throw new Error("Invalid credentials");
                    } else{
                        return user
                    }
                } catch (error) {
                    throw new Error("Something went wrong");
                }

            }
        })
    ],
    pages: {
        signIn: "/auth/signin",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id.toString()
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token._id
            }
            return session
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
}