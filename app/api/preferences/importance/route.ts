import prisma from "@/prisma/db";

export async function POST(request: Request) {
	try {
		const { importance } = await request.json();

		let importanceIds = [];
		for (let imp of importance) {
			let importanceExists;
			try {
				importanceExists = await prisma.importance.findMany({
					where: { name: imp },
				});
			} catch (error) {
				return new Response("Error fetching importance", { status: 500 });
			}

			if (importanceExists.length === 0) {
				console.log("Importance does not exist in the database");
				try {
					const data = await prisma.importance.create({
						data: {
							name: imp,
						},
					});
					importanceIds.push(data.id);
				} catch (error) {
					return new Response("Error creating importance", { status: 500 });
				}
			} else {
				importanceIds.push(importanceExists[0].id);
			}
		}

		return new Response(JSON.stringify({ importanceIds }), { status: 200 });
	} catch (error) {
		console.log("Couldn't process request", error);
		return new Response("Server API Error", { status: 500 });
	}
}
