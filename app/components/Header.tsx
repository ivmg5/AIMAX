import Link from "next/link";
import { CircleUserRound } from "lucide-react";
import { auth, signIn, signOut } from "@/auth";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { redirect } from "next/navigation";

interface AvatarDemoProps {
	src: string;
	fallbackText: string;
}

const AvatarDemo: React.FC<AvatarDemoProps> = ({ src, fallbackText }) => {
	return <CircleUserRound size={40} color='#FFFF' />;
};

const CircleIcon: React.FC = () => {
	return (
		<div className='w-12 h-12 bg-logo flex items-center justify-center rounded-full'>
			<span className='text-white font-light'>AI</span>
		</div>
	);
};

export default async function Header() {
	const session = await auth();
	return (
		<header className='flex items-center justify-between p-4 bg-fondo'>
			<div className='flex items-center'>
				<CircleIcon />
			</div>
			<div className='flex items-center space-x-8 ml-auto'>
				<nav className='flex items-center space-x-8'>
					<Link href='/' className='text-white hover:underline'>
						Home{" "}
					</Link>
					<Link href='/inbox' className='text-white hover:underline'>
						Inbox{" "}
					</Link>
					{!session?.user && (
						<form
							action={async (formData) => {
								"use server";
								await signIn();
							}}
						>
							<button type='submit'>Sign in</button>
						</form>
					)}
					{session?.user && (
						<form
							action={async (formData) => {
								"use server";
								await signOut();

								redirect("/");
							}}
						>
							<button type='submit'>Sign out</button>
						</form>
					)}
				</nav>
				{session?.user?.image ? (
					<Avatar>
						<AvatarImage src={session.user.image} />
						<AvatarFallback>{session.user.name}</AvatarFallback>
					</Avatar>
				) : (
					<AvatarDemo
						src='https://avatars.githubusercontent.com/u/1234567'
						fallbackText='AI'
					/>
				)}
			</div>
		</header>
	);
}
