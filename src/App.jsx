import React, { useState, useEffect } from 'react';
import QuizBeeGame from './components/QuizBeeGame';
import { questionsEn, questionsTl } from './data/questions';

export default function App() {
  const [isFlipping, setIsFlipping] = useState(false);
  const [gameState, setGameState] = useState('intro'); // Nagsisimula sa 'intro'
  const [language, setLanguage] = useState('en');
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // Timer para matapos ang intro at pumunta sa menu
  useEffect(() => {
    if (gameState === 'intro') {
      const timer = setTimeout(() => {
        setGameState('menu');
      }, 3800); // 3.8 seconds bago lumabas ang Menu
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const triggerPageFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipping(false);
    }, 1500);
  };

  const startGame = (lang) => {
    setLanguage(lang);
    setSelectedQuestions(lang === 'tl' ? questionsTl : questionsEn);
    triggerPageFlip();
    
    // Papalitan natin ang screen sa kalagitnaan ng page flip animation
    setTimeout(() => {
      setGameState('playing');
    }, 750); 
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#18a2ee] via-[#158fe0] to-[#0f6bb8] relative w-full flex flex-col items-center pt-4 sm:pt-8 px-4 ${isFlipping ? 'realistic-book-flip' : ''}`}>
      
        {/* ========================================================
          INTODUCTION SCREEN (Tatagal ng ~4 seconds tapos mawawala) 
          ======================================================== */}
      {gameState === 'intro' && (
        <div className="fixed inset-0 z-50 bg-[#18a2ee] flex items-center justify-center overflow-hidden">
          <div className="flex items-end gap-3 sm:gap-5 pb-10">
            {/* Title Text */}
            <div className="animate-intro-text flex flex-col items-end text-right">
              {/* BINAGO DITO: Pinalitan ang text-yellow-300 ng text-white */}
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-wider uppercase drop-shadow-[0_4px_0_#92400e] leading-none mb-1 sm:mb-2">
                COMPLETE<br/>THE WORDS
              </h1>
            </div>
            
            {/* Tumatalbog na Logo bilang tuldok */}
            <div className="animate-intro-ball w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shrink-0 p-1 bg-amber-400/30 backdrop-blur-sm shadow-[0_8px_20px_rgba(0,0,0,0.35)] ring-4 ring-amber-300 relative mb-1 sm:mb-2">
              <img src="/cws-logo.png" alt="CWS Logo" className="w-full h-full object-cover [clip-path:circle(49%_at_center)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MAIN APP CODE (Lalabas lang kapag tapos na ang intro)
          ======================================================== */}
      {gameState !== 'intro' && (
        <>
          <header className="flex flex-col items-center mb-6 text-center w-full max-w-2xl">
            <div className="bg-[#0c4a6e]/50 text-white/95 text-[11px] sm:text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm mb-3 border border-white/20 shadow-md">
              Ecclesiastical District of Metro Manila South
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
              {/* Kung gusto mo ring tumalbog yung logo sa main menu pagkatapos ng intro, panatilihin ang animate-realistic-bounce */}
              <div className="animate-realistic-bounce w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shrink-0 p-1 bg-amber-400/30 backdrop-blur-sm shadow-[0_8px_20px_rgba(0,0,0,0.35)] ring-4 ring-amber-300 z-20 relative">
                <img src="/cws-logo.png" alt="CWS Logo" className="w-full h-full object-cover [clip-path:circle(49%_at_center)] drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" />
              </div>
             <div className="flex flex-col items-center sm:items-start relative">
                {/* 
                  BINAGO DITO: 
                  Tinanggal natin yung 'animate-typing'. 
                  Hinati natin ang "COMPLETE THE WORDS" para bawat letra ay pwedeng mag-bubble!
                */}
                <h1 className="text-[28px] sm:text-4xl md:text-5xl font-black text-white tracking-wider uppercase drop-shadow-[0_4px_0_#92400e] text-center sm:text-left z-10 relative whitespace-nowrap mt-2 sm:mt-0">
                  {"COMPLETE THE WORDS".split('').map((char, index) => (
                    <span key={index} className="bubble-letter">
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </h1>
                
                <div className="animate-highlight bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-sm sm:text-lg px-8 sm:px-10 py-1.5 sm:py-2 rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.4)] border-b-4 border-red-800 uppercase tracking-widest mt-2 sm:mt-3 sm:ml-32 text-center z-20 relative">
                  KIDS ACTIVITY
                </div>
              </div>


            </div>
          </header>

          <main className="w-full flex justify-center pb-8 flex-1">
            {gameState === 'menu' ? (
              <div className="animate-menu-intro w-full max-w-md bg-white rounded-3xl p-8 text-center border-4 border-amber-300 shadow-2xl flex flex-col items-center justify-center h-fit mt-4">
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
        </>
      )}
    </div>
  );
}