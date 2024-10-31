import prisma from "@/prisma/db";
import openai from "@/openaiClient";
import { auth } from "@/auth";
import { Entity } from "@/app/dashboard/page";

const resourceTypeMapping: {
	[key: string]: "VIDEO" | "ARTICLE" | "COURSE" | "BOOK" | "PODCAST" | "OTHER";
} = {
	"Online Course": "COURSE",
	MOOC: "COURSE",
	Book: "BOOK",
	Video: "VIDEO",
	Article: "ARTICLE",
	Podcast: "PODCAST",
	Other: "OTHER",
};

function clearMdJsonCodeBlock(jsonString: string) {
	// Remove the initial and final code block notation
	jsonString = jsonString.replace(/^```json\s*/, "").replace(/\s*```$/, "");

	// Parse the JSON string
	let data = JSON.parse(jsonString);

	return data;
}

export async function POST(request: Request) {
	try {
		const { id, priorities, reasons, interest, knowledge } =
			await request.json();

		if (!id) {
			return new Response("User ID not provided", { status: 400 });
		}

		if (!priorities || !reasons || !interest || !knowledge) {
			return new Response("Missing preferences", { status: 400 });
		}

		const user = await prisma.user.findUnique({
			where: { id },
		});

		const prompt = `
        Given the user's interests, knowledge, reasons for learning, priorities, and language preferences, generate a list of study topics and corresponding resources. The response should be a JSON object containing an array of topics, where each topic has an id, name, description, and an array of study resources. Each study resource should have an id, name, description, URL, and type.
        Interests: ${interest.map((entity: Entity) => entity.name).join(", ")}
        Knowledge: ${knowledge.map((entity: Entity) => entity.name).join(", ")}
        Reasons for Learning: ${reasons
					.map((entity: Entity) => entity.name)
					.join(", ")}
        Priorities: ${priorities
					.map((entity: Entity) => entity.name)
					.join(", ")}
        Language: English
        `;

		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content:
						"You are an assistant that provides personalized study recommendations.",
				},
				{ role: "user", content: prompt },
			],
			max_tokens: 1000,
		});

		const content = response.choices[0].message.content;

		if (!content) {
			return new Response("No content received from OpenAI API", {
				status: 500,
			});
		}

		let recommendations;
		try {
			recommendations = clearMdJsonCodeBlock(content);
		} catch (error) {
			console.error("Error parsing OpenAI response:", error);
			return new Response("Error parsing OpenAI response", { status: 500 });
		}

		if (!recommendations.topics || !Array.isArray(recommendations.topics)) {
			console.error("Invalid response format from OpenAI:", recommendations);
			return new Response("Invalid response format from OpenAI", {
				status: 500,
			});
		}

		const recommendationsData = [];

		for (let topic of recommendations.topics) {
			if (!topic.study_resources || !Array.isArray(topic.study_resources)) {
				console.error("Invalid topic resources format:", topic);
				continue;
			}

			const subject = await prisma.subject.create({
				data: {
					name: topic.name,
					description: topic.description,
				},
			});

			for (let resource of topic.study_resources) {
				const resourceType = resourceTypeMapping[resource.type] || "OTHER";
				await prisma.studyResource.create({
					data: {
						name: resource.name,
						description: resource.description,
						url: resource.URL || null,
						type: resourceType,
						subjectId: subject.id,
						subjects: { connect: { id: subject.id } },
					},
				});
			}

			const recommendation = await prisma.recommendation.create({
				data: {
					userId: id,
					subjectId: subject.id,
				},
			});

			recommendationsData.push(recommendation);
		}

		return new Response(
			JSON.stringify({ recommendations: recommendationsData }),
			{ status: 200 }
		);
	} catch (error) {
		console.log("Couldn't process request", error);
		return new Response("Server API Error", { status: 500 });
	}
}

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const searchParams = new URLSearchParams(url.search);
		const id = searchParams.get("id");

		if (!id) {
			return new Response("User ID not provided", { status: 400 });
		}

		const user = await prisma.user.findUnique({
			where: { id },
		});
		if (!user) {
			return new Response("User not found in the database", { status: 500 });
		}

		// order by date of creation Descending

		const lastRecommendation = await prisma.recommendation.findMany({
			where: { userId: user.id },
			include: {
				subject: {
					include: {
						resources: true,
					},
				},
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		if (lastRecommendation.length === 0) {
			return new Response(
				JSON.stringify({ message: "No recommendations found" }),
				{ status: 404 }
			);
		}

		// return latest 2 recommendations
		return new Response(JSON.stringify(lastRecommendation.slice(0, 2)), {
			status: 200,
		});
	} catch (error) {
		console.log("Couldn't process request", error);
		return new Response("Server API Error", { status: 500 });
	}
}
