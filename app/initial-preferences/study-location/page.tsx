"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/Footer";
import PageTransition from "@/app/components/PageTransition";
import QuestionHeader from "@/app/components/QuestionHeader";
import SelectionButton from "@/app/components/SelectionButton";
import pages from "@/app/routes/routes";

export default function StudyLocation() {
	const [selectedOption, setSelectedOption] = useState<string | null>(null);
	const router = useRouter();
	const currentPageIndex = pages.indexOf("/initial-preferences/study-location");

	useEffect(() => {
		const savedOption = localStorage.getItem("studyLocation");
		if (savedOption) {
			setSelectedOption(savedOption);
		}
	}, []);

	const toggleSelection = (option: string) => {
		setSelectedOption(option);
	};

	const saveSelection = () => {
		if (selectedOption) {
			localStorage.setItem("studyLocation", selectedOption);
			if (currentPageIndex < pages.length - 1) {
				router.push(pages[currentPageIndex + 1]);
			}
		} else {
			alert("Por favor seleccione una opción.");
		}
	};

	const goBack = () => {
		if (currentPageIndex > 0) {
			router.push(pages[currentPageIndex - 1]);
		} else {
			alert("Esta es la primera página");
		}
	};

	return (
		<div className='flex flex-col h-full'>
			<div className='flex-1 flex items-center justify-center bg-custom-yellow'>
				<PageTransition>
					<QuestionHeader
						title='¿Desde dónde estudias?'
						description='Selecciona una opción'
					/>
					<div className='flex max-w-2xl flex-wrap justify-center mb-4'>
						{[
							"Casa",
							"Escuela",
							"Trabajo",
							"Lugar público",
							"Lugar en silencio/tranquilo (biblioteca,salón privado,etc)",
						].map((option) => (
							<SelectionButton
								key={option}
								option={option}
								isSelected={selectedOption === option}
								onSelect={toggleSelection}
							/>
						))}
					</div>
				</PageTransition>
			</div>
			<Footer onBack={goBack} onNext={saveSelection} />
		</div>
	);
}
