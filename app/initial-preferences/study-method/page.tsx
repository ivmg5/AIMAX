"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/Footer";
import PageTransition from "@/app/components/PageTransition";
import QuestionHeader from "@/app/components/QuestionHeader";
import SelectionButton from "@/app/components/SelectionButton";
import pages from "@/app/routes/routes";

export default function StudyMethod() {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [otherMethod, setOtherMethod] = useState<string>("");
    const router = useRouter();
    const currentPageIndex = pages.indexOf("/initial-preferences/study-method");

    useEffect(() => {
        const savedOptions = localStorage.getItem("studyMethods");
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
                localStorage.removeItem("studyMethods");
            }
        }
    }, []);

    const toggleSelection = (option: string) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter((item) => item !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    const handleOtherMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOtherMethod(event.target.value);
    };

    const saveSelection = () => {
        const allSelectedOptions = otherMethod
            ? [...selectedOptions, otherMethod]
            : selectedOptions;

        try {
            const jsonString = JSON.stringify(allSelectedOptions);
            localStorage.setItem("studyMethods", jsonString);
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
                        title='¿Cuál es tu método de estudio?'
                        description='Selecciona todos los que correspondan'
                    />
                    <div className='flex max-w-2xl flex-wrap justify-center mb-4'>
                        {[
                            "Subrayar lo importante",
                            "Realizando apuntes",
                            "Mapas mentales",
                            "Fichas de estudio",
                            "Ejercicios y casos prácticos",
                            "Tests",
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
                                    value={otherMethod}
                                    onChange={handleOtherMethodChange}
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
