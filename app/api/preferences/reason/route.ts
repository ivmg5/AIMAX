import prisma from "@/prisma/db";

export async function POST(request: Request) {
	try {
		const { studyReason } = await request.json();

		console.log("Study Reason", studyReason);
		let reasonExists;
		try {
			reasonExists = await prisma.reason.findMany({
				where: { name: studyReason },
			});
		} catch (error) {
			return new Response("Error fetching reason", { status: 500 });
		}

		let reasonId = null;
		if (reasonExists.length === 0) {
			try {
				const data = await prisma.reason.create({
					data: {
						name: studyReason,
					},
				});

				reasonId = data.id;
			} catch (error) {
				return new Response("Error creating reason", { status: 500 });
			}
		} else {
			reasonId = reasonExists[0].id;
		}
		console.log("Reason ID", reasonId);

		return new Response(JSON.stringify({ reasonId }), { status: 200 });
	} catch (error) {
		console.log("Couldn't process request", error);
		return new Response("Server API Error", { status: 500 });
	}
}
