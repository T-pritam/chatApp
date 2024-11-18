import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      // _id?: string;
      name?: string;
      email?: string;
      image?: string;
    } & DefaultSession['user'];
  } 

  interface User {
    _id: string;
  }
}
