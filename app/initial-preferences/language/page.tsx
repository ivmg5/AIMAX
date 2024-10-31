"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/Footer";
import PageTransition from "@/app/components/PageTransition";
import QuestionHeader from "@/app/components/QuestionHeader";
import SelectionButton from "@/app/components/SelectionButton";
import pages from "@/app/routes/routes";

export default function Language() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const router = useRouter();
  const currentPageIndex = pages.indexOf("/initial-preferences/language");

  useEffect(() => {
    const savedOptions = localStorage.getItem("language");
    if (savedOptions) {
      setSelectedOptions(JSON.parse(savedOptions));
    }
  }, []);

  const toggleSelection = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const saveSelection = () => {
    localStorage.setItem("language", JSON.stringify(selectedOptions));
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
    <div className="flex flex-col h-full">
      <div className="flex-grow flex items-center justify-center bg-custom-yellow">
        <PageTransition>
          <QuestionHeader title="¿Cuál(es) idioma(s) hablas?" description="Selecciona todos los que correspondan" />
          <div className="flex flex-wrap justify-center mb-4">
            {["Español", "English", "Français", "中国人", "Deutsch", "otro"].map((option) => (
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
