import prisma from '@/prisma/db';

export async function GET(request: Request) {
    try {
        const resources = await prisma.studyResource.findMany();
        return new Response(JSON.stringify(resources), { status: 200 });
    } catch (error) {
        console.log("Couldn't process request", error);
        return new Response("Server API Error", { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { id, name, description, url, type, subjectId } = await request.json();
        const resource = await prisma.studyResource.create({
            data: {
                id,
                name,
                description,
                url,
                type,
                subjectId,
            },
        });
        return new Response(JSON.stringify(resource), { status: 200 });
    } catch (error) {
        console.log("Couldn't process request", error);
        return new Response("Server API Error", { status: 500 });
    }
}
