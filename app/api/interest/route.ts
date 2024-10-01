import prisma from "@/prisma/db";

export async function POST(request: Request) {
	try {
		const { interests } = await request.json();

		let interestIds = [];
		for (let interest of interests) {
			let interestExists;
			try {
				interestExists = await prisma.interest.findMany({
					where: { name: interest },
				});
			} catch (error) {
				return new Response("Error fetching importance", { status: 500 });
			}

			if (interestExists.length === 0) {
				console.log("interest does not exist in the database");
				try {
					const data = await prisma.interest.create({
						data: {
							name: interest,
						},
					});
					interestIds.push(data.id);
				} catch (error) {
					return new Response("Error creating interest", { status: 500 });
				}
			} else {
				interestIds.push(interestExists[0].id);
			}
		}

		return new Response(JSON.stringify({ interestIds }), { status: 200 });
	} catch (error) {
		console.log("Couldn't process request", error);
		return new Response("Server API Error", { status: 500 });
	}
}
