"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/Footer";
import PageTransition from "@/app/components/PageTransition";
import QuestionHeader from "@/app/components/QuestionHeader";
import SelectionButton from "@/app/components/SelectionButton";
import pages from "@/app/routes/routes";

export default function SpecialAttention() {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [details, setDetails] = useState<string>("");
    const router = useRouter();
    const currentPageIndex = pages.indexOf("/initial-preferences/special-attention");

    useEffect(() => {
        const savedOptions = localStorage.getItem("specialAttention");
        if (savedOptions) {
            try {
                const parsedOptions = JSON.parse(savedOptions);
                if (Array.isArray(parsedOptions)) {
                    setSelectedOptions(parsedOptions);
                    if (parsedOptions.includes("Si")) {
                        const savedDetails = localStorage.getItem("specialAttentionDetails");
                        if (savedDetails) {
                            setDetails(savedDetails);
                        }
                    }
                } else {
                    console.error("Parsed options are not an array:", parsedOptions);
                }
            } catch (error) {
                console.error("Error parsing saved options from localStorage", error);
                localStorage.removeItem("specialAttention");
            }
        }
    }, []);

    const toggleSelection = (option: string) => {
        if (option === "No") {
            setSelectedOptions(["No"]);
            setDetails("");
        } else {
            if (selectedOptions.includes(option)) {
                setSelectedOptions(selectedOptions.filter((item) => item !== option));
            } else {
                setSelectedOptions(["Si"]);
            }
        }
    };

    const handleDetailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDetails(event.target.value);
    };

    const saveSelection = () => {
        const allSelectedOptions = details.trim()
            ? [...selectedOptions, details.trim()]
            : selectedOptions;

        try {
            const jsonString = JSON.stringify(allSelectedOptions);
            localStorage.setItem("specialAttention", jsonString);
            if (selectedOptions.includes("Si")) {
                localStorage.setItem("specialAttentionDetails", details);
            } else {
                localStorage.removeItem("specialAttentionDetails");
            }
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
                        title='¿Requiere atención especializada?'
                        description='(problemas de aprendizaje, problemas de la vista, problemas de audición, problemas de atención, etc)'
                    />
                    <div className='flex flex-wrap justify-center mb-4'>
                        {["Si", "No"].map((option) => (
                            <SelectionButton
                                key={option}
                                option={option}
                                isSelected={selectedOptions.includes(option)}
                                onSelect={() => toggleSelection(option)}
                            />
                        ))}
                        {selectedOptions.includes("Si") && (
                            <input
                                type='text'
                                placeholder='Con qué'
                                value={details}
                                onChange={handleDetailsChange}
                                className='m-2 p-2 border-2 rounded-full bg-white text-custom-orange border-custom-orange'
                            />
                        )}
                    </div>
                </PageTransition>
            </div>
            <Footer onBack={goBack} onNext={saveSelection} />
        </div>
    );
}
