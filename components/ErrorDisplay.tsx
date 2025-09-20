
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-rose-900/50 border border-rose-500 text-rose-300 px-4 py-3 rounded-lg relative mb-4 animate-fade-in" role="alert">
      <strong className="font-bold">A dark omen!</strong>
      <span className="block sm:inline ml-2">{message}</span>
    </div>
  );
};

export default ErrorDisplay;
