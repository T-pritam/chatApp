// import NextAuth from 'next-auth';
// import GoogleProvider from 'next-auth/providers/google';
// import { NextAuthOptions } from 'next-auth';

// export const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//   ],
//   callbacks: {
//     // Called after sign-in is successful
//     async signIn({ user, account, profile }) {
//       console.log('Signed in user:', user);  // Log the signed-in user
//       return true;
//     },
//     // Called when creating the JWT token for session management
//     async jwt({ token, account, profile }) {
//       if (account && profile) {
//         token.email = profile.email;
//         token.name = profile.name;
//         token.image = (profile as any).picture;  // Store user profile picture URL
//       }
//       return token;  // Return the token to save in session
//     },
//     // Pass JWT token into session to provide user data on the frontend
//     async session({ session, token }) {
//       session.user = token;  // Add user data from JWT token to the session
//       return session;  // Return the session with user data
//     },
//   },
//   session: {
//     strategy: 'jwt',  // Use JWT for session management instead of a database session
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };


import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/model/User';

const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await dbConnect();
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          email: user.email!,
          name: user.name!,
          image: user.image!,
        });
      }

      return true;
    },
    async jwt({ token, account, user }) {
      if (user) {
        const dbUser = await User.findOne({ email: user.email });
        token.id = dbUser?._id;
      }

      if (account) {
        token.jwt = jwt.sign({ id: token.id }, process.env.JWT_SECRET!, {
          expiresIn: '7d',
        });
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
      };

      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.JWT_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
