import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasPreferences } from "../lib/preferences";
import Sidebar from "@/app/dashboard/components/Sidebar";
import MainPanel from "./components/MainPanel";
import { LoaderCircle } from "lucide-react";
import { Session } from "next-auth";

export interface Entity {
	id: string;
	name: string;
}
export interface PreferenceProps {
	priorities: Entity[];
	reasons: Entity[];
	interest: Entity[];
	knowledge: Entity[];
}

export type PreferencePropsWithSession = PreferenceProps & { session: Session };

const fetchPreferences = async (id: string) => {
	const response = await fetch(
		`http://localhost:3000/api/preferences/user/${id}`
	);
	const preferences = await response.json();

	if (
		!preferences ||
		!preferences.PreferencesImportance ||
		!preferences.PreferencesReason
	) {
		return null;
	}
	const priorities: Entity[] = preferences.PreferencesImportance.map(
		(item: any) => item.importance
	);
	const reasons: Entity[] = preferences.PreferencesReason.map(
		(item: any) => item.reason
	);

	let interest: Entity[] = [];
	if (preferences.userInterest) {
		interest = preferences.userInterest.map((item: any) => item.interest);
	}
	let knowledge: Entity[] = [];
	if (preferences.userKnowledge) {
		knowledge = preferences.userKnowledge.map((item: any) => item.knowledge);
	}

	return {
		priorities,
		reasons,
		interest,
		knowledge,
	};
};

async function DashboardPage() {
	const session = await auth();

	if (!session || !session.user || !session.user.id) {
		redirect("/");
	}

	if (session.user && session.user.id) {
		const pref = await hasPreferences(session.user.id);

		if (!pref || !pref.id || !pref.userId) {
			redirect(`/initial-preferences/3-things-distraction`);
		}
	}

	const id = session.user.id;
	const preferences = await fetchPreferences(id);

	return (
		<div className='flex bg-fondo p-5 overflow-hidden h-full'>
			{preferences ? (
				<MainPanel
					priorities={preferences.priorities}
					reasons={preferences.reasons}
					interest={preferences.interest}
					knowledge={preferences.knowledge}
					session={session}
				/>
			) : (
				<div className='flex-1 flex flex-col' />
			)}
			{preferences ? (
				<Sidebar
					priorities={preferences.priorities}
					reasons={preferences.reasons}
					interest={preferences.interest}
					knowledge={preferences.knowledge}
					session={session}
				/>
			) : (
				<div className='w-[500px]'>
					<LoaderCircle className='animate-spin' />
				</div>
			)}
		</div>
	);
}

export default DashboardPage;
