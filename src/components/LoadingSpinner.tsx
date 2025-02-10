"use client";

import React from "react";

interface LoadingSpinnerProps {
  text?: string;
  size?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = "טוען...", size = "h-10 w-10" }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full border-t-4 border-blue-600 ${size}`}></div>
      <span className="mt-2 text-gray-600">{text}</span>
    </div>
  );
};

export default LoadingSpinner;
