"use client"
import { useState, useEffect } from 'react';

export const BackgroundAnimation = ({ children }: { children: React.ReactNode }) => {
  const [bgPosition, setBgPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgPosition(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const backgroundStyle = {
    backgroundImage: `linear-gradient(${bgPosition}deg, 
      rgba(49, 46, 129, 0.8), 
      rgba(88, 28, 135, 0.8), 
      rgba(157, 23, 77, 0.8))`,
    transition: 'background-image 0.5s ease',
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={backgroundStyle}>
      <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-gradient-to-r from-indigo-500 to-purple-500" />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      {children}
    </div>
  );
};