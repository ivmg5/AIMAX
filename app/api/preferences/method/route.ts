import prisma from "@/prisma/db";

export async function POST(request: Request) {
	try {
		const { studyMethods } = await request.json();

		let studyMethodsIds = [];
		for (let meth of studyMethods) {
			// Check if language exists in the database
			let methodExists;
			try {
				methodExists = await prisma.method.findMany({
					where: { name: meth },
				});
			} catch (error) {
				return new Response("Error fetching Method", { status: 500 });
			}

			if (methodExists.length === 0) {
				console.log("Method does not exist in the database");
				try {
					const data = await prisma.method.create({
						data: {
							name: meth,
						},
					});
					studyMethodsIds.push(data.id);
				} catch (error) {
					return new Response("Error creating method", { status: 500 });
				}
			} else {
				studyMethodsIds.push(methodExists[0].id);
			}
		}

		return new Response(JSON.stringify({ studyMethodsIds }), { status: 200 });
	} catch (error) {
		console.log("Couldn't process request", error);
		return new Response("Server API Error", { status: 500 });
	}
}
