import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import CwsModal from './CwsModal';

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function QuizBeeGame({ questions, triggerPageFlip, language, onBackToMenu }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slots, setSlots] = useState([]);
  const [availableTiles, setAvailableTiles] = useState([]);
  const [answerStatus, setAnswerStatus] = useState('idle'); 
  const [isFinished, setIsFinished] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', actionLabel: '' });

  const currentQ = questions[currentIndex];

  const t = language === 'tl' ? {
    clue: "Clue",
    fillLabel: "Punan ang mga Nawawalang Letra (I-tap para bawiin)",
    pickLabel: "Piliin ang Tamang Letra:",
    submitBtn: "IPASA ANG SAGOT",
    nextBtn: "SUSUNOD NA TANONG ➔",
    playAgainBtn: "BUMALIK SA MENU 🔄",
    finishedTitle: "TAPOS NA! 🏆",
    finishedMsg: "Binabati kita! Nasagutan mo nang tama ang lahat ng mga tanong!",
    goodJobTitle: "MAGALING!",
    foundMsg: (word) => `Nahanap mo ang mga letra para mabuo ang "${word}"!`
  } : {
    clue: "Clue",
    fillLabel: "Fill in the Missing Letters (Tap to undo)",
    pickLabel: "Choose the Correct Letters:",
    submitBtn: "SUBMIT ANSWER",
    nextBtn: "NEXT QUESTION ➔",
    playAgainBtn: "BACK TO MENU 🔄",
    finishedTitle: "ACTIVITY FINISHED! 🏆",
    finishedMsg: "Congratulations! All questions have been completed successfully!",
    goodJobTitle: "GREAT JOB!",
    foundMsg: (word) => `You found the missing letters to spell "${word}"!`
  };

  useEffect(() => {
    if (!currentQ) return;
    
    const rawWord = currentQ.answer.toUpperCase();
    const vowels = new Set(['A', 'E', 'I', 'O', 'U']);
    const initialSlots = [];

    // Itago ang lahat ng VOWELS (A, E, I, O, U) at ipakita ang CONSONANTS
    for (let i = 0; i < rawWord.length; i++) {
      const char = rawWord[i];
      if (char === ' ') {
        initialSlots.push({ char: ' ', isSpace: true, isFixed: true, tileId: null });
      } else if (vowels.has(char)) {
        // Blangko kapag Vowel
        initialSlots.push({ char: '', isSpace: false, isFixed: false, tileId: null });
      } else {
        // Fixed kapag Consonant
        initialSlots.push({ char: char, isSpace: false, isFixed: true, tileId: null });
      }
    }

    // Gamitin ang eksaktong tiles list mula sa questions.js
    const pool = currentQ.tiles.map((char, idx) => ({
      id: `tile-${idx}-${char}-${Math.random()}`,
      char: char.toUpperCase(),
      isUsed: false,
    }));

    setSlots(initialSlots);
    setAvailableTiles(shuffleArray(pool)); // I-shuffle ang pagpipilian (o palitan ng `pool` lang kung ayaw i-shuffle)
    setAnswerStatus('idle');
    setModalState({ isOpen: false, title: '', message: '', actionLabel: '' });
  }, [currentIndex, currentQ]);

  const handleSelectTile = (tile) => {
    if (tile.isUsed || answerStatus === 'correct') return;
    const firstBlankIndex = slots.findIndex(s => !s.isSpace && !s.isFixed && s.char === '');
    if (firstBlankIndex === -1) return;

    const updated = [...slots];
    updated[firstBlankIndex] = { ...updated[firstBlankIndex], char: tile.char, tileId: tile.id };
    setSlots(updated);
    setAvailableTiles(prev => prev.map(t => (t.id === tile.id ? { ...t, isUsed: true } : t)));
    setAnswerStatus('idle');
  };

  const handleRemoveSlot = (index) => {
    if (answerStatus === 'correct') return;
    const slot = slots[index];
    if (slot.isFixed || slot.isSpace || slot.char === '') return;

    const updated = [...slots];
    updated[index] = { ...updated[index], char: '', tileId: null };
    setSlots(updated);
    setAvailableTiles(prev => prev.map(t => (t.id === slot.tileId ? { ...t, isUsed: false } : t)));
    setAnswerStatus('idle');
  };

  const handleCheckAnswer = () => {
    const isComplete = slots.every(s => s.isSpace || s.char !== '');
    if (!isComplete) return;

    const formedWord = slots.filter(s => !s.isSpace).map(s => s.char).join('');
    const targetWord = currentQ.answer.replace(/\s+/g, '').toUpperCase();

    if (formedWord === targetWord) {
      setAnswerStatus('correct');
      confetti({ particleCount: 110, spread: 85, origin: { y: 0.6 } });

      const isLastQuestion = currentIndex === questions.length - 1;

      setTimeout(() => {
        if (isLastQuestion) {
          setIsFinished(true);
          setModalState({
            isOpen: true,
            title: t.finishedTitle,
            message: t.finishedMsg,
            actionLabel: t.playAgainBtn
          });
        } else {
          setModalState({
            isOpen: true,
            title: t.goodJobTitle,
            message: t.foundMsg(currentQ.answer.toUpperCase()),
            actionLabel: t.nextBtn
          });
        }
      }, 450);

    } else {
      setAnswerStatus('wrong');
      setTimeout(() => setAnswerStatus('idle'), 1000);
    }
  };

  const handleModalAction = () => {
    setModalState({ isOpen: false, title: '', message: '', actionLabel: '' });

    if (isFinished) {
      if (onBackToMenu) onBackToMenu(); 
    } else {
      if (currentIndex < questions.length - 1) {
        if (triggerPageFlip) triggerPageFlip();
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
        }, 1500);
      }
    }
  };

  if (!currentQ) return null;
  const isFilled = slots.every(s => s.isSpace || s.char !== '');

  return (
    <div className="w-full max-w-2xl flex flex-col items-center mt-6 sm:mt-8">
      <div className="w-full bg-white rounded-3xl p-6 sm:p-7 mb-5 text-center border-4 border-amber-300 relative shadow-2xl">
        <div className="absolute -top-5 -left-5 sm:-top-6 sm:-left-6 w-14 h-14 sm:w-16 sm:h-16 bg-[#1692e4] text-white rounded-full flex items-center justify-center font-black text-2xl sm:text-3xl border-4 border-white shadow-[0_4px_10px_rgba(0,0,0,0.3)] z-10">
          {currentIndex + 1}
        </div>

        <p className="text-gray-800 text-lg sm:text-2xl font-extrabold mb-3 leading-snug mt-2">
          "{currentQ.question}"
        </p>

        <div className="inline-flex items-center gap-1.5 bg-sky-50 border border-sky-200 text-sky-800 px-4 py-1.5 rounded-2xl text-xs sm:text-sm font-bold">
          <span>💡</span>
          <span>{t.clue}: {currentQ.clue}</span>
        </div>
      </div>

      <div className="flex flex-col items-center mb-6 w-full">
        <span className="text-white/80 text-[11px] font-bold tracking-widest uppercase mb-2">
          {t.fillLabel}
        </span>

        <div className={`flex flex-wrap justify-center gap-y-3 gap-x-1.5 sm:gap-2 min-h-[64px] max-w-full ${answerStatus === 'wrong' ? 'shake-error' : ''}`}>
          {slots.map((slot, idx) => {
            if (slot.isSpace) return <div key={idx} className="w-4 sm:w-8 h-12 sm:h-14"></div>;

            if (slot.isFixed) {
              return (
                <div key={idx} className={`w-11 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black italic text-2xl sm:text-3xl border-2 transition-all shadow-md ${answerStatus === 'correct' ? 'bg-emerald-500 text-white border-emerald-600' : answerStatus === 'wrong' ? 'bg-rose-500 text-white border-rose-700' : 'bg-white text-gray-900 border-gray-300'}`}>
                  {slot.char}
                </div>
              );
            }

            if (slot.char === '') {
              return (
                <div key={idx} className="w-11 h-12 sm:w-14 sm:h-14 border-2 border-dashed border-white/70 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
                  <span className="text-white/50 text-2xl font-bold">_</span>
                </div>
              );
            }

            return (
              <button key={idx} onClick={() => handleRemoveSlot(idx)} className={`w-11 h-12 sm:w-14 sm:h-14 rounded-2xl font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg transition active:scale-95 border-b-4 ${answerStatus === 'correct' ? 'bg-emerald-500 text-white border-emerald-700' : answerStatus === 'wrong' ? 'bg-rose-500 text-white border-rose-700' : 'bg-amber-400 hover:bg-amber-300 text-sky-950 border-amber-600'}`}>
                {slot.char}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full bg-[#0a5c9e]/40 p-4 sm:p-5 rounded-3xl mb-6 backdrop-blur-md border border-white/25 shadow-xl">
        <p className="text-white text-xs text-center font-extrabold mb-3 tracking-wider uppercase opacity-95">
          {t.pickLabel}
        </p>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {availableTiles.map((tile) => (
            <button key={tile.id} disabled={tile.isUsed || answerStatus === 'correct'} onClick={() => handleSelectTile(tile)} className={`w-11 h-11 sm:w-13 sm:h-13 text-xl sm:text-2xl font-black rounded-2xl transition-all transform ${tile.isUsed ? 'bg-sky-950/40 text-transparent border-transparent cursor-not-allowed scale-90 opacity-20' : 'bg-white hover:bg-amber-100 text-sky-900 border-b-4 border-sky-300 shadow-md active:scale-95'}`}>
              {tile.char}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center w-full">
        {answerStatus !== 'correct' ? (
          <button onClick={handleCheckAnswer} disabled={!isFilled} className={`w-full sm:w-auto px-10 py-3.5 rounded-2xl font-black text-base uppercase tracking-wider transition ${isFilled ? 'bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white shadow-xl border-b-4 border-emerald-700 cursor-pointer' : 'bg-white/25 text-white/50 cursor-not-allowed'}`}>
            {t.submitBtn}
          </button>
        ) : (
          <button onClick={handleModalAction} className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 active:scale-95 text-sky-950 font-black px-10 py-3.5 rounded-2xl shadow-xl border-b-4 border-amber-600 transition text-base uppercase tracking-wider">
            {isFinished ? t.playAgainBtn : t.nextBtn}
          </button>
        )}
      </div>

      <CwsModal isOpen={modalState.isOpen} title={modalState.title} message={modalState.message} onAction={handleModalAction} actionLabel={modalState.actionLabel} />
    </div>
  );
}