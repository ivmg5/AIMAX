"use client";

import {
	Recommendation,
	StudyResource,
	fetchNewRecommendation,
	fetchRecommendation,
} from "@/app/lib/recommendations";
import { RotateCcw } from "lucide-react";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { PreferenceProps, PreferencePropsWithSession } from "../page";
import { Session } from "next-auth";
import Link from "next/link";

function ResourceCard({ resource }: { resource: StudyResource }) {
	const { name, description, url, type } = resource;

	const cardContent = (
		<div className='flex flex-col p-3 rounded-lg bg-logo w-[350px] h-full justify-center items-center'>
			<div className='text-white text-xl text-center font-bold'>{name}</div>
			<div className='text-white text-lg text-center'>{description}</div>
		</div>
	);

	if (url) {
		return <Link href={url}>{cardContent}</Link>;
	} else {
		return cardContent;
	}
}

function RecommendationCard({
	recommendation,
}: {
	recommendation: Recommendation;
}) {
	if (!recommendation) {
		return null;
	}
	const title = recommendation.subject.name;
	const description = recommendation.subject.description;
	const resources = recommendation.subject.resources;
	return (
		<div className='RecomendationTitle text-white font-inherit text-3xl text-center flex items-center justify-center flex-col flex-1'>
			{title}
			<div className='RecomendationText text-white text-lg text-center mt-4'>
				{description}
			</div>
			<div className='flex my-3 gap-5'>
				{resources.map((resource) => {
					return <ResourceCard key={resource.id} resource={resource} />;
				})}
			</div>
		</div>
	);
}

export default function MainPanel({
	priorities,
	reasons,
	interest,
	knowledge,
	session,
}: PreferencePropsWithSession) {
	const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
	const [recommendationLoading, setRecommendationLoading] = useState(false);

	const getRecommendation = async () => {
		setRecommendationLoading(true);
		const recommendations = await fetchRecommendation(session, {
			priorities,
			reasons,
			interest,
			knowledge,
		});
		setRecommendations(recommendations);
		setRecommendationLoading(false);
	};

	const handleNewRecommendation = async () => {
		setRecommendationLoading(true);
		const recommendations = await fetchNewRecommendation(session, {
			priorities,
			reasons,
			interest,
			knowledge,
		});
		setRecommendations(recommendations);
		setRecommendationLoading(false);
	};

	useEffect(() => {
		getRecommendation();
	}, []);

	return (
		<div className='flex-1 flex flex-col'>
			<div className='text-white relative font-bold text-4xl text-center'>
				This Week’s Recommendations
				<button
					onClick={handleNewRecommendation}
					disabled={recommendationLoading}
					className='absolute right-10 top-0 hover:cursor-pointer hover:bg-black/10 p-3 rounded-full disabled:cursor-not-allowed disabled:text-white/40'
				>
					<RotateCcw />
				</button>
			</div>
			{recommendationLoading ? (
				<div className='flex-1 flex justify-center items-center'>
					<div className='text-white text-center'>
						<LoaderCircle className='animate-spin' />
					</div>
				</div>
			) : (
				<div className='flex flex-col justify-around flex-1'>
					<RecommendationCard recommendation={recommendations[0]} />
					<RecommendationCard recommendation={recommendations[1]} />
				</div>
			)}
		</div>
	);
}
