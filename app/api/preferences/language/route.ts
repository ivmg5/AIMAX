import prisma from "@/prisma/db";

export async function POST(request: Request) {
	try {
		const { language } = await request.json();

		let languageIds = [];
		for (let lang of language) {
			// Check if language exists in the database
			let languageExists;
			try {
				languageExists = await prisma.language.findMany({
					where: { name: lang },
				});
			} catch (error) {
				return new Response("Error fetching language", { status: 500 });
			}

			if (languageExists.length === 0) {
				console.log("Language does not exist in the database");
				try {
					const data = await prisma.language.create({
						data: {
							name: lang,
						},
					});
					languageIds.push(data.id);
				} catch (error) {
					return new Response("Error creating language", { status: 500 });
				}
			} else {
				languageIds.push(languageExists[0].id);
			}
		}

		return new Response(JSON.stringify({ languageIds }), { status: 200 });
	} catch (error) {
		console.log("Couldn't process request", error);
		return new Response("Server API Error", { status: 500 });
	}
}
