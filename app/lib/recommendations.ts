"use server";

import { Session } from "next-auth";
import { PreferenceProps } from "../dashboard/page";

export type StudyResource = {
	id: string;
	name: string;
	description: string;
	url?: string;
	type: ResourceType;
};

enum ResourceType {
	VIDEO = "VIDEO",
	ARTICLE = "ARTICLE",
	COURSE = "COURSE",
	BOOK = "BOOK",
	PODCAST = "PODCAST",
	OTHER = "OTHER",
}

type Subject = {
	id: string;
	name: string;
	description: string;
	resources: StudyResource[];
};

export type Recommendation = {
	id: string;
	userId: string;
	createdAt: string;
	subjectId: string;
	subject: Subject;
};

const fetchNewRecommendation = async (
	session: Session,
	preferences: PreferenceProps
) => {
	const recommendations: Recommendation[] = await completeTwoRecommendations(
		session,
		preferences
	);
	return recommendations;
};

const completeTwoRecommendations = async (
	session: Session,
	preferences: PreferenceProps
) => {
	try {
		await createRecommendation(session, preferences);
	} catch (error) {
		console.error(error);
	}
	return await fetchRecommendation(session, preferences);
};

const fetchRecommendation = async (
	session: Session,
	preferences: PreferenceProps
) => {
	const url = new URL("http://localhost:3000/api/recommendations");
	if (!session.user || !session.user.id) {
		throw new Error("Invalid session");
	}
	url.searchParams.append("id", session.user.id);

	const response = await fetch(url.toString());

	let lastRecommendation: Recommendation[] = [];
	if (response.status === 404) {
		try {
			lastRecommendation = await fetchNewRecommendation(session, preferences);
		} catch (error) {
			console.error(error);
		}
	} else if (response.status === 200) {
		lastRecommendation = await response.json();
	}

	if (lastRecommendation.length === 0) {
		throw new Error("Failed to fetch recommendation");
	}

	return lastRecommendation;
};

const createRecommendation = async (
	session: Session,
	preferences: PreferenceProps
) => {
	console.log("Creating recommendation...");
	if (!session.user || !session.user.id) {
		throw new Error("Invalid session");
	}

	const response = await fetch("http://localhost:3000/api/recommendations", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			id: session.user.id,
			...preferences,
		}),
	});

	if (!response.ok) {
		throw new Error("Failed to create recommendation");
	}
	const { recommendations } = await response.json();

	return recommendations;
};

export { fetchNewRecommendation, fetchRecommendation };
