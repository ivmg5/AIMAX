"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/Footer";
import PageTransition from "@/app/components/PageTransition";
import QuestionHeader from "@/app/components/QuestionHeader";
import SelectionButton from "@/app/components/SelectionButton";
import pages from "@/app/routes/routes";

export default function FavTech() {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [otherTech, setOtherTech] = useState<string>("");
    const router = useRouter();
    const currentPageIndex = pages.indexOf("/initial-preferences/fav-tech");

    useEffect(() => {
        const savedOptions = localStorage.getItem("favTech");
        if (savedOptions) {
            try {
                const parsedOptions = JSON.parse(savedOptions);
                if (Array.isArray(parsedOptions)) {
                    setSelectedOptions(parsedOptions);
                } else {
                    console.error("Parsed options are not an array:", parsedOptions);
                }
            } catch (error) {
                console.error("Error parsing saved options from localStorage", error);
                localStorage.removeItem("favTech");
            }
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

    const handleOtherTechChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOtherTech(event.target.value);
    };

    const saveSelection = () => {
        const allSelectedOptions = otherTech
            ? [...selectedOptions, otherTech]
            : selectedOptions;

        try {
            const jsonString = JSON.stringify(allSelectedOptions);
            localStorage.setItem("favTech", jsonString);
            console.log("Selected options saved to localStorage:", jsonString);
        } catch (error) {
            console.error("Error saving options to localStorage", error);
        }

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
                        title='Tecnologías favoritas'
                        description='Selecciona tus tecnologías favoritas'
                    />
                    <div className='flex flex-wrap max-w-2xl justify-center mb-4'>
                        {[
                            "Python",
                            "AWS",
                            "JavaScript",
                            "React",
                            "TypeScript",
                            "Java",
                            "Azure",
                            "Kubernetes",
                            "CSS",
                            "GCP",
                            "SQL",
                            "Linux",
                            "HTML",
                            "Docker",
                            "Ruby",
                            "GraphQL",
                            "JIRA",
                            "Jenkins",
                            "Postgres",
                            "C#",
                        ].map((option) => (
                            <SelectionButton
                                key={option}
                                option={option}
                                isSelected={selectedOptions.includes(option)}
                                onSelect={() => toggleSelection(option)}
                            />
                        ))}
                        <div className='flex flex-col items-center'>
                            <label className='m-2 p-2 border-2 rounded-full bg-white text-custom-orange border-custom-orange'>
                                Otro:
                                <input
                                    type='text'
                                    className='ml-2'
                                    value={otherTech}
                                    onChange={handleOtherTechChange}
                                />
                            </label>
                        </div>
                    </div>
                </PageTransition>
            </div>
            <Footer onBack={goBack} onNext={saveSelection} />
        </div>
    );
}
