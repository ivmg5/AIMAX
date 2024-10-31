import prisma from '@/prisma/db';

export async function GET(request: Request) {
    try {
        const subjects = await prisma.subject.findMany({
            include: {
                resources: true,
            },
        });
        return new Response(JSON.stringify(subjects), { status: 200 });
    } catch (error) {
        console.log("Couldn't process request", error);
        return new Response("Server API Error", { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { name, description } = await request.json();
        const subject = await prisma.subject.create({
            data: {
                name,
                description,
            },
        });
        return new Response(JSON.stringify(subject), { status: 200 });
    } catch (error) {
        console.log("Couldn't process request", error);
        return new Response("Server API Error", { status: 500 });
    }
}
