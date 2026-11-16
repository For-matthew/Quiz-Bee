import React, { useState } from 'react';
import QuizBeeGame from './components/QuizBeeGame';
import { questionsEn, questionsTl } from './data/questions';

export default function App() {
  const [isFlipping, setIsFlipping] = useState(false);
  const [gameState, setGameState] = useState('menu'); // 'menu' | 'playing'
  const [language, setLanguage] = useState('en');

  const triggerPageFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipping(false);
    }, 1500);
  };

  const startGame = (lang) => {
    setLanguage(lang);
    triggerPageFlip();
    
    // Papalitan natin ang screen sa kalagitnaan ng page flip animation
    setTimeout(() => {
      setGameState('playing');
    }, 750); 
  };

  const selectedQuestions = language === 'tl' ? questionsTl : questionsEn;

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#18a2ee] via-[#158fe0] to-[#0f6bb8] flex flex-col items-center px-4 py-6 font-sans select-none ${isFlipping ? 'realistic-book-flip pointer-events-none' : ''}`}>
      
     {/* Header Banner - Static / Hindi magbabago */}
      <header className="flex flex-col items-center mb-6 text-center">
        <div className="bg-[#0c4a6e]/50 text-white/95 text-[11px] sm:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm mb-3 border border-white/20 shadow-md">
          Ecclesiastical District of Metro Manila South
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shrink-0 p-1 bg-amber-400/30 backdrop-blur-sm shadow-[0_8px_20px_rgba(0,0,0,0.35)] ring-4 ring-amber-300 z-20">
            <img src="/cws-logo.png" alt="CWS Logo" className="w-full h-full object-cover [clip-path:circle(49%_at_center)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" />
          </div>

          <div className="flex flex-col items-center sm:items-start relative">
            <h1 className="text-4xl sm:text-5xl font-black text-yellow-300 tracking-wider uppercase drop-shadow-[0_4px_0_#92400e] text-center sm:text-left z-10 relative">
              COMPLETE THE WORD
            </h1>
            
            {/* 
              TWEAK: Pinalitan ang sm:-mt-2 ng sm:mt-2 para bumaba at magkaroon ng space.
              Nananatili ang sm:ml-24 para nakatapat pa rin sa P.
            */}
            <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-base sm:text-lg px-10 py-2 rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.4)] border-b-4 border-red-800 uppercase tracking-widest mt-3 sm:mt-2 sm:ml-24 text-center z-20 relative">
              Visitation Activity
            </div>
          </div>
        </div>
      </header>  

      {/* Main Content Area */}
      <main className="w-full flex justify-center pb-8 flex-1">
        {gameState === 'menu' ? (
          <div className="w-full max-w-md bg-white rounded-3xl p-8 text-center border-4 border-amber-300 shadow-2xl flex flex-col items-center justify-center h-fit mt-4">
            <h2 className="text-2xl sm:text-3xl font-black text-sky-900 uppercase tracking-wider mb-6">
              Select Language<br/><span className="text-lg text-emerald-600">Pumili ng Wika</span>
            </h2>
            <div className="flex flex-col gap-4 w-full">
              <button onClick={() => startGame('en')} className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-black px-6 py-4 rounded-2xl shadow-xl border-b-4 border-emerald-700 transition text-xl uppercase tracking-wider">
                English (US)
              </button>
              <button onClick={() => startGame('tl')} className="w-full bg-amber-400 hover:bg-amber-300 active:scale-95 text-sky-950 font-black px-6 py-4 rounded-2xl shadow-xl border-b-4 border-amber-600 transition text-xl uppercase tracking-wider">
                Filipino (Tagalog)
              </button>
            </div>
          </div>
        ) : (
          <QuizBeeGame
            questions={selectedQuestions}
            triggerPageFlip={triggerPageFlip}
            language={language}
            onBackToMenu={() => {
               triggerPageFlip();
               setTimeout(() => setGameState('menu'), 750);
            }}
          />
        )}
      </main>

      <footer className="text-white/70 text-xs font-medium text-center mt-auto pb-2">
        Children's Worship Service • Iglesia Ni Cristo
      </footer>
    </div>
  );
}