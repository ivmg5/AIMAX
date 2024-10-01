import React from 'react';

interface QuestionHeaderProps {
  title: string;
  description: string;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({ title, description }) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="mb-4">{description}</p>
    </div>
  );
};

export default QuestionHeader;
