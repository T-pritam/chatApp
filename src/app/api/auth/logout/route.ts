import { cookies } from "next/headers";

export async function GET(req: Request) {

  const cookieStore = cookies();
  cookieStore.delete("auth");

  return Response.json({
    status : true,
    message :  "User Logged Out"
  })
}