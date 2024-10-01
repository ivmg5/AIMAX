
import React from 'react';

interface FooterProps {
  onBack: () => void;
  onNext: () => void;
}

const Footer: React.FC<FooterProps> = ({ onBack, onNext }) => {
  return (
    <footer className="bg-custom-orange text-white py-4 text-center w-full">
      <div className="flex justify-center">
        <button onClick={onBack} className="bg-custom-orange text-white px-4 py-2 rounded-full">&lt; Back</button>
        <button onClick={onNext} className="bg-custom-orange text-white px-4 py-2 rounded-full">Next &gt;</button>
      </div>
    </footer>
  );
};

export default Footer;
