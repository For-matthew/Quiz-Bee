import React, { useState } from 'react';
import QuizBeeGame from './components/QuizBeeGame';
import { questionsData } from './data/questions';

export default function App() {
  const [isFlipping, setIsFlipping] = useState(false);

  // Trigger para sa 3-segundong page flip animation sa buong page
  const triggerPageFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipping(false);
    }, 3000);
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-[#18a2ee] via-[#158fe0] to-[#0f6bb8] flex flex-col items-center px-4 py-6 font-sans select-none ${
        isFlipping ? 'realistic-book-flip pointer-events-none' : ''
      }`}
    >
      {/* Header Banner */}
      <header className="flex flex-col items-center mb-6 text-center">
        {/* District Ribbon */}
        <div className="bg-[#0c4a6e]/50 text-white/95 text-[11px] sm:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm mb-3 border border-white/20 shadow-md">
          Ecclesiastical District of Metro Manila South
        </div>

        {/* Logo at Title */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          {/* CWS Logo na may Gold Glow Border at Shadow */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shrink-0 p-1 bg-amber-400/30 backdrop-blur-sm shadow-[0_8px_20px_rgba(0,0,0,0.35)] ring-4 ring-amber-300">
            <img
              src="/cws-logo.png"
              alt="CWS Logo"
              className="w-full h-full object-contain [clip-path:circle(49%_at_center)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
            />
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h1 className="text-4xl sm:text-5xl font-black text-yellow-300 tracking-wider uppercase drop-shadow-[0_4px_0_#92400e]">
              KIDZ BEE
            </h1>
            <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-xs sm:text-sm px-4 py-1 rounded-md shadow-md border-b-2 border-red-800 uppercase tracking-widest mt-1">
              Visitation Activity
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Screen */}
      <main className="w-full flex justify-center pb-8">
        <QuizBeeGame
          questions={questionsData}
          triggerPageFlip={triggerPageFlip}
        />
      </main>

      <footer className="text-white/70 text-xs font-medium text-center mt-auto pb-2">
        Children's Worship Service • Iglesia Ni Cristo
      </footer>
    </div>
  );
}