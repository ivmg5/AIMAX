import prisma from "@/prisma/db";

export async function POST(request: Request) {
	try {
		const { knowledge } = await request.json();

		let knowledgeIds = [];
		for (let know of knowledge) {
			let knowledgeExists;
			try {
				knowledgeExists = await prisma.knowledge.findMany({
					where: { name: know },
				});
			} catch (error) {
				return new Response("Error fetching knowledge", { status: 500 });
			}

			if (knowledgeExists.length === 0) {
				console.log("knowledge does not exist in the database");
				try {
					const data = await prisma.knowledge.create({
						data: {
							name: know,
						},
					});
					knowledgeIds.push(data.id);
				} catch (error) {
					return new Response("Error creating knowledge", { status: 500 });
				}
			} else {
				knowledgeIds.push(knowledgeExists[0].id);
			}
		}

		return new Response(JSON.stringify({ knowledgeIds }), { status: 200 });
	} catch (error) {
		console.log("Couldn't process request", error);
		return new Response("Server API Error", { status: 500 });
	}
}
