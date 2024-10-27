export async function GET(req: Request) {

    return Response.json({
        status: true,
        message: "Server Running",
    })
}