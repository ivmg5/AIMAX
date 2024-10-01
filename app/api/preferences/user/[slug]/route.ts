import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import { UserKnowledge } from "@prisma/client";
import { Entity } from "@/app/dashboard/page";

export async function GET(
	req: NextRequest,
	{ params }: { params: { slug: string } }
) {
	try {
		const userId = params.slug;

		let userKnowledge: {
			knowledge: { id: string; name: string };
			userId: string;
			knowledgeId: string;
		}[] = [];
		let userInterest: {
			interest: { id: string; name: string };
			userId: string;
			interestId: string;
		}[] = [];

		try {
			userKnowledge = await prisma.userKnowledge.findMany({
				where: { userId: userId },
				include: { knowledge: true },
			});
		} catch (error) {
			console.error("Error fetching user knowledge:", error);
		}

		try {
			userInterest = await prisma.userInterest.findMany({
				where: { userId: userId },
				include: { interest: true },
			});
		} catch (error) {
			console.error("Error fetching user interest:", error);
		}

		let preferences = null;
		try {
			preferences = await prisma.userPreferences.findFirst({
				where: { userId: userId },
				include: {
					PreferencesLanguage: {
						include: { language: true },
					},
					PreferencesImportance: {
						include: { importance: true },
					},
					PreferencesReason: {
						include: { reason: true },
					},
					PreferencesMethod: {
						include: { method: true },
					},
				},
			});

			if (!preferences) {
				return new Response(
					JSON.stringify({ message: "Preference not found" }),
					{
						status: 404,
						headers: { "Content-Type": "application/json" },
					}
				);
			}
		} catch (error) {
			console.error("Error fetching preferences:", error);
			return new Response(
				JSON.stringify({ message: "Error fetching preferences" }),
				{
					status: 500,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		const userPreferences = {
			...preferences,
			userInterest,
			userKnowledge,
		};

		return new Response(JSON.stringify(userPreferences), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		console.error("API error:", error);
		return new Response(JSON.stringify({ message: "API error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}

async function createRelation(
	userId: string,
	preferenceId: string,
	preferences: Entity[],
	type: string
) {
	console.log("preferences", preferences);
	const preferenceNames = preferences.map((preference) => preference.name);

	if (type === "importance") {
		const responseImportance = await fetch(
			"http://localhost:3000/api/preferences/importance",
			{
				method: "POST",
				body: JSON.stringify({
					importance: preferenceNames,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		const { importanceIds } = await responseImportance.json();
		console.log("importanceIds", importanceIds);

		for (let imp of importanceIds) {
			try {
				await prisma.preferencesImportance.create({
					data: {
						preferences: {
							connect: {
								id: preferenceId,
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
	} else if (type === "reason") {
		let reasonIds: string[] = [];

		for (let reason of preferenceNames) {
			const responseReason = await fetch(
				"http://localhost:3000/api/preferences/reason",
				{
					method: "POST",
					body: JSON.stringify({
						studyReason: reason,
					}),
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			const { reasonId } = await responseReason.json();
			reasonIds.push(reasonId);
		}

		console.log("reasonIds", reasonIds);

		for (let reason of reasonIds) {
			try {
				await prisma.preferencesReason.create({
					data: {
						preferences: {
							connect: {
								id: preferenceId,
							},
						},
						reason: {
							connect: {
								id: reason,
							},
						},
					},
				});
			} catch (error) {
				console.log("Error creating reason preference");
			}
		}
	} else if (type === "interest") {
		const responseInterest = await fetch("http://localhost:3000/api/interest", {
			method: "POST",
			body: JSON.stringify({
				interests: preferenceNames,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const { interestIds } = await responseInterest.json();

		console.log("interestIds", interestIds);

		for (let interest of interestIds) {
			try {
				await prisma.userInterest.create({
					data: {
						user: {
							connect: {
								id: userId,
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
	} else if (type === "knowledge") {
		const responseKnowledge = await fetch(
			"http://localhost:3000/api/knowledge",
			{
				method: "POST",
				body: JSON.stringify({
					knowledge: preferenceNames,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		const { knowledgeIds } = await responseKnowledge.json();

		console.log("knowledgeIds", knowledgeIds);

		for (let knowledge of knowledgeIds) {
			try {
				await prisma.userKnowledge.create({
					data: {
						user: {
							connect: {
								id: userId,
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
	}
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: { slug: string } }
) {
	try {
		const userId = params.slug;

		const userPreference = await prisma.userPreferences.findFirst({
			where: { userId: userId },
		});

		if (!userPreference) {
			return new Response(JSON.stringify({ message: "Preference not found" }), {
				status: 404,
			});
		}

		const { preferences, removedPreferences } = await req.json();

		console.log("preferences", preferences);
		console.log("removedPreferences", removedPreferences);

		//new preferences
		if (preferences.priorities.length > 0) {
			await createRelation(
				userId,
				userPreference.id,
				preferences.priorities,
				"importance"
			);
		}
		if (preferences.reasons.length > 0) {
			await createRelation(
				userId,
				userPreference.id,
				preferences.reasons,
				"reason"
			);
		}
		if (preferences.interests.length > 0) {
			await createRelation(
				userId,
				userPreference.id,
				preferences.interests,
				"interest"
			);
		}
		if (preferences.knowledge.length > 0) {
			await createRelation(
				userId,
				userPreference.id,
				preferences.knowledge,
				"knowledge"
			);
		}

		//removed preferences
		if (removedPreferences.priorities.length > 0) {
			console.log(
				"removedPreferences.priorities",
				removedPreferences.priorities
			);
			for (let imp of removedPreferences.priorities) {
				await prisma.preferencesImportance.deleteMany({
					where: {
						preferencesId: userPreference.id,
						importanceId: imp.id,
					},
				});
			}
		}
		if (removedPreferences.reasons.length > 0) {
			console.log("removedPreferences.reasons", removedPreferences.reasons);
			for (let reason of removedPreferences.reasons) {
				await prisma.preferencesReason.deleteMany({
					where: {
						preferencesId: userPreference.id,
						reasonId: reason.id,
					},
				});
			}
		}

		if (removedPreferences.interests.length > 0) {
			console.log("removedPreferences.interests", removedPreferences.interests);
			for (let interest of removedPreferences.interests) {
				await prisma.userInterest.deleteMany({
					where: {
						userId: userId,
						interestId: interest.id,
					},
				});
			}
		}

		if (removedPreferences.knowledge.length > 0) {
			console.log("removedPreferences.knowledge", removedPreferences.knowledge);
			for (let knowledge of removedPreferences.knowledge) {
				await prisma.userKnowledge.deleteMany({
					where: {
						userId: userId,
						knowledgeId: knowledge.id,
					},
				});
			}
		}
		return new Response("OK", { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ message: "API error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
