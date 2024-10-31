async function hasPreferences(user: string) {
	try {
		const response = await fetch(
			`http://localhost:3000/api/preferences/user/${user}`
		);
		const { id, userId } = await response.json();
		return { id, userId };
	} catch (error) {
		console.error(error);
	}
}

type Preferences = {
	priorities: { name: string; id: string }[];
	reasons: { name: string; id: string }[];
	interests: { name: string; id: string }[];
	knowledge: { name: string; id: string }[];
};

async function changePreferences(
	user: string,
	newPreferences: Preferences,
	removedPreferences: Preferences
) {
	try {
		const response = await fetch(
			`http://localhost:3000/api/preferences/user/${user}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					preferences: newPreferences,
					removedPreferences: removedPreferences,
				}),
			}
		);

		if (!response.ok) {
			throw new Error("Error updating preferences");
		}
	} catch (error) {
		console.error(error);
	}
}

export { hasPreferences, changePreferences };
