import { auth } from "@/auth";
import React from "react";
import { hasPreferences } from "../lib/preferences";
import { redirect } from "next/navigation";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (session && session.user && session.user.id) {
		const pref = await hasPreferences(session.user.id);

		if (pref && pref.id && pref.userId) {
			redirect(`/dashboard`);
		}
	}

	return <>{children}</>;
}
