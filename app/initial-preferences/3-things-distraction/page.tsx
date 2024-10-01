"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/Footer";
import PageTransition from "@/app/components/PageTransition";
import QuestionHeader from "@/app/components/QuestionHeader";
import SelectionButton from "@/app/components/SelectionButton";
import pages from "@/app/routes/routes";

export default function ThreeThingsDistraction() {
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const router = useRouter();
	const currentPageIndex = pages.indexOf(
		"/initial-preferences/3-things-distraction"
	);

	useEffect(() => {
		const savedOptions = localStorage.getItem("selectedOptions");
		if (savedOptions) {
			setSelectedOptions(JSON.parse(savedOptions));
		}
	}, []);

	const toggleSelection = (option: string) => {
		if (selectedOptions.includes(option)) {
			setSelectedOptions(selectedOptions.filter((item) => item !== option));
		} else {
			if (selectedOptions.length < 3) {
				setSelectedOptions([...selectedOptions, option]);
			} else {
				setSelectedOptions([...selectedOptions.slice(1), option]);
			}
		}
	};

	const saveSelection = () => {
		localStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
		if (currentPageIndex < pages.length - 1) {
			router.push(pages[currentPageIndex + 1]);
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
						title='Questions for creating a user Profile'
						description='¿Cuáles son las 3 cosas más importantes que buscas a la hora de estudiar?'
					/>
					<div className='flex flex-wrap justify-center mb-4 max-w-2xl'>
						{[
							"Interacción",
							"Métodos convencionales de estudio",
							"Métodos no convencionales de estudio",
							"Recompensas y reconocimiento",
							"Flexibilidad de horarios",
							"Nuevas herramientas de estudio",
							"Retos",
							"Ver progreso",
							"Estudio individual",
							"Estudio en equipo/ acompañado",
							"Temas especializados",
							"Saber un poco de todo",
						].map((option) => (
							<SelectionButton
								key={option}
								option={option}
								isSelected={selectedOptions.includes(option)}
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
