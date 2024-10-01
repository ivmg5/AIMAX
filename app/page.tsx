import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasPreferences } from "@/app/lib/preferences";

export default async function Home() {
	const session = await auth();

	if (session?.user?.id) {
		const pref = await hasPreferences(session.user.id);
		if (pref && pref.id && pref.userId) {
			redirect(`/dashboard`);
		} else {
			redirect(`/initial-preferences/3-things-distraction`);
		}
	}

	return (
		<main className='w-full h-screen flex flex-col'>
			<div className='bg-custom-yellow bg-cover bg-center h-full flex flex-col items-center justify-center'>
				<div className='grid grid-cols-2 w-full overflow-hidden gap-14'>
					<div className='flex justify-end items-center'>
						<img
							src='/lp-aimax.png'
							className='w-[750px] h-[480px] rounded-3xl '
						/>
					</div>
					<div className='flex justify-start items-center'>
						<div className='flex flex-col justify-center items-center'>
							<h1 className='text-white text-7xl font-light italic mb-4'>
								AIMAX
							</h1>
							<form
								action={async () => {
									"use server";
									await signIn();
								}}
							>
								<Button type='submit'>Sign in</Button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
