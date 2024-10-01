import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/db";
import { auth } from "@/auth";
import StudyReason from "@/app/initial-preferences/why-selfstudy/page";

function extract_information(json: { [key: string]: any }) {
	json["specialAttention"] =
		["Sí", "si", "Si"].indexOf(json["specialAttention"]) > -1 ? true : false;

	json["importance"] = parseStringifiedList(json["selectedOptions"]);

	console.log("Importance", json["importance"]);
	console.log("Selected Options", json["selectedOptions"]);
	delete json["selectedOptions"];

	json["interests"] = parseStringifiedList(json["programmingLearnLanguages"]);
	delete json["programmingLearnLanguages"];

	json["knowledge"] = parseStringifiedList(json["programmingLanguages"]);
	json["knowledge"] = json["knowledge"].concat(
		parseStringifiedList(json["favTech"])
	);
	delete json["programmingLanguages"];
	delete json["favTech"];

	// Parsing additional fields
	json["studyMethods"] = parseStringifiedList(json["studyMethods"]);
	json["language"] = parseStringifiedList(json["language"]);

	// Handling concatenated arrays in 'knowledge' field if it appears in the input
	if (
		json["knowledge"].length > 0 &&
		typeof json["knowledge"][0] === "string"
	) {
		json["knowledge"] = json["knowledge"].flatMap((item: any) =>
			item.split('","').map((subItem: any) => subItem.replace(/[\[\]]/g, ""))
		);
	}

	return json;
}

function parseStringifiedList(str: string): string[] {
	try {
		return JSON.parse(str);
	} catch {
		return [];
	}
}

export async function POST(request: Request) {
	try {
		const json = await request.json();
		console.log("Received data", json);
		const data = extract_information(json);
		console.log("Extracted data", data);

		const session = await auth();
		if (!session || !session.user) {
			return new Response("Unauthorized", { status: 401 });
		}

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
		});
		if (!user) {
			return new Response("User not found", { status: 404 });
		}
		const responseLang = await fetch(
			"http://localhost:3000/api/preferences/language",
			{
				method: "POST",
				body: JSON.stringify({
					language: data.language,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		const { languageIds } = await responseLang.json();

		console.log("importance data", data.importance);
		const responseImportance = await fetch(
			"http://localhost:3000/api/preferences/importance",
			{
				method: "POST",
				body: JSON.stringify({
					importance: data.importance,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		const { importanceIds } = await responseImportance.json();

		const reponseReason = await fetch(
			"http://localhost:3000/api/preferences/reason",
			{
				method: "POST",
				body: JSON.stringify({
					studyReason: data.studyReason,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		const { reasonId } = await reponseReason.json();

		const responseInterest = await fetch("http://localhost:3000/api/interest", {
			method: "POST",
			body: JSON.stringify({
				interests: data.interests,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const { interestIds } = await responseInterest.json();

		const responseKnowledge = await fetch(
			"http://localhost:3000/api/knowledge",
			{
				method: "POST",
				body: JSON.stringify({
					knowledge: data.knowledge,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		const { knowledgeIds } = await responseKnowledge.json();

		const reponseMethod = await fetch(
			"http://localhost:3000/api/preferences/method",
			{
				method: "POST",
				body: JSON.stringify({
					studyMethods: data.studyMethods,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		const { studyMethodsIds } = await reponseMethod.json();

		const preferences = await prisma.userPreferences.create({
			data: {
				user: {
					connect: {
						id: session.user.id,
					},
				},

				location: data.studyLocation,
				special_attention: data.specialAttention.toString(),
				time_goal: data.studyGoals,
				pronouns: data.pronouns,
				identity: data.genderIdentify,
			},
		});

		for (let lang of languageIds) {
			try {
				await prisma.preferencesLanguage.create({
					data: {
						preferences: {
							connect: {
								id: preferences.id,
							},
						},
						language: {
							connect: {
								id: lang,
							},
						},
					},
				});
			} catch (error) {
				console.log("Error creating language preference");
			}
		}

		for (let imp of importanceIds) {
			try {
				await prisma.preferencesImportance.create({
					data: {
						preferences: {
							connect: {
								id: preferences.id,
							},
						},
						importance: {
							connect: {
								id: imp,
							},
						},
					},
				});
			} catch (error) {
				console.log("Error creating importance preference");
			}
		}

		try {
			await prisma.preferencesReason.create({
				data: {
					preferences: {
						connect: {
							id: preferences.id,
						},
					},
					reason: {
						connect: {
							id: reasonId,
						},
					},
				},
			});
		} catch (error) {
			console.log("Error creating reason preference");
		}

		for (let interest of interestIds) {
			try {
				await prisma.userInterest.create({
					data: {
						user: {
							connect: {
								id: session.user.id,
							},
						},
						interest: {
							connect: {
								id: interest,
							},
						},
					},
				});
			} catch (error) {
				console.log("Error creating interest preference");
			}
		}

		for (let knowledge of knowledgeIds) {
			try {
				await prisma.userKnowledge.create({
					data: {
						user: {
							connect: {
								id: session.user.id,
							},
						},
						knowledge: {
							connect: {
								id: knowledge,
							},
						},
					},
				});
			} catch (error) {
				console.log("Error creating knowledge preference");
			}
		}

		for (let method of studyMethodsIds) {
			try {
				await prisma.preferencesMethod.create({
					data: {
						preferences: {
							connect: {
								id: preferences.id,
							},
						},
						method: {
							connect: {
								id: method,
							},
						},
					},
				});
			} catch (error) {
				console.log("Error creating method preference");
			}
		}

		console.log("Preferences created successfully");

		return new Response(JSON.stringify({ preferences }), { status: 200 });
	} catch (error) {
		console.log("Couldn't process request", error);
		return new Response("Server API Error, login", { status: 500 });
	}
}
