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

export default function QuizBeeGame({ questions, triggerPageFlip }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slots, setSlots] = useState([]);
  const [availableTiles, setAvailableTiles] = useState([]);
  const [answerStatus, setAnswerStatus] = useState('idle'); // 'idle' | 'wrong' | 'correct'
  const [isFinished, setIsFinished] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', actionLabel: '' });

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (!currentQ) return;
    const cleanWord = currentQ.answer.replace(/\s+/g, '').toUpperCase();
    const len = cleanWord.length;

    // Pattern ng Missing Letters (Unang letra at gitna ay pre-filled)
    const fixedIndices = new Set();
    fixedIndices.add(0);

    if (len >= 5) {
      fixedIndices.add(2);
    }

    const initialSlots = Array.from({ length: len }, (_, i) => {
      if (fixedIndices.has(i)) {
        return { char: cleanWord[i], isFixed: true, tileId: null };
      }
      return { char: '', isFixed: false, tileId: null };
    });

    const pool = [];
    for (let i = 0; i < len; i++) {
      if (!fixedIndices.has(i)) {
        pool.push({
          id: `tile-${i}-${cleanWord[i]}-${Math.random()}`,
          char: cleanWord[i],
          isUsed: false,
        });
      }
    }

    setSlots(initialSlots);
    setAvailableTiles(shuffleArray(pool));
    setAnswerStatus('idle');
    setModalState({ isOpen: false, title: '', message: '', actionLabel: '' });
  }, [currentIndex, currentQ]);

  const handleSelectTile = (tile) => {
    if (tile.isUsed || answerStatus === 'correct') return;

    const firstBlankIndex = slots.findIndex(s => !s.isFixed && s.char === '');
    if (firstBlankIndex === -1) return;

    const updated = [...slots];
    updated[firstBlankIndex] = { ...updated[firstBlankIndex], char: tile.char, tileId: tile.id };
    setSlots(updated);

    setAvailableTiles(prev =>
      prev.map(t => (t.id === tile.id ? { ...t, isUsed: true } : t))
    );
    setAnswerStatus('idle');
  };

  const handleRemoveSlot = (index) => {
    if (answerStatus === 'correct') return;
    const slot = slots[index];
    if (slot.isFixed || slot.char === '') return;

    const updated = [...slots];
    updated[index] = { ...updated[index], char: '', tileId: null };
    setSlots(updated);

    setAvailableTiles(prev =>
      prev.map(t => (t.id === slot.tileId ? { ...t, isUsed: false } : t))
    );
    setAnswerStatus('idle');
  };

  const handleCheckAnswer = () => {
    const isComplete = slots.every(s => s.char !== '');
    if (!isComplete) return;

    const formedWord = slots.map(s => s.char).join('');
    const targetWord = currentQ.answer.replace(/\s+/g, '').toUpperCase();

    if (formedWord === targetWord) {
      setAnswerStatus('correct');
      
      confetti({
        particleCount: 110,
        spread: 85,
        origin: { y: 0.6 }
      });

      const isLastQuestion = currentIndex === questions.length - 1;

      setTimeout(() => {
        if (isLastQuestion) {
          setIsFinished(true);
          setModalState({
            isOpen: true,
            title: 'ACTIVITY FINISHED! 🏆',
            message: 'Congratulations! All questions have been completed successfully!',
            actionLabel: 'PLAY AGAIN 🔄'
          });
        } else {
          setModalState({
            isOpen: true,
            title: 'GREAT JOB!',
            message: `You found the missing letters to spell "${targetWord}"!`,
            actionLabel: 'NEXT QUESTION ➔'
          });
        }
      }, 450);

    } else {
      setAnswerStatus('wrong');
      setTimeout(() => {
        setAnswerStatus('idle');
      }, 1000);
    }
  };

  // Mag-reset o lumipat sa susunod na tanong
  const handleModalAction = () => {
    setModalState({ isOpen: false, title: '', message: '', actionLabel: '' });

    if (isFinished) {
      // Mag-restart pabalik sa unang tanong
      if (triggerPageFlip) triggerPageFlip();
      setTimeout(() => {
        setIsFinished(false);
        setCurrentIndex(0);
      }, 1500);
    } else {
      // Lilipat sa susunod na tanong
      if (currentIndex < questions.length - 1) {
        if (triggerPageFlip) triggerPageFlip();
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
        }, 1500);
      }
    }
  };

  if (!currentQ) return null;

  const isFilled = slots.every(s => s.char !== '');

  return (
    <div className="w-full max-w-xl flex flex-col items-center">
      {/* Question Card */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-7 mb-5 text-center border-4 border-amber-300 relative shadow-2xl">
        <div className="inline-block bg-[#1692e4] text-white text-xs sm:text-sm font-black px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
          Question #{currentIndex + 1} of {questions.length}
        </div>

        <p className="text-gray-800 text-lg sm:text-2xl font-extrabold mb-3 leading-snug">
          "{currentQ.question}"
        </p>

        <div className="inline-flex items-center gap-1.5 bg-sky-50 border border-sky-200 text-sky-800 px-4 py-1.5 rounded-2xl text-xs sm:text-sm font-bold">
          <span>💡</span>
          <span>Clue: {currentQ.clue}</span>
        </div>
      </div>

      {/* Answer Slots Row */}
      <div className="flex flex-col items-center mb-6 w-full">
        <span className="text-white/80 text-[11px] font-bold tracking-widest uppercase mb-2">
          Fill in the Missing Letters (Tap to undo)
        </span>

        <div className={`flex flex-wrap justify-center gap-2 sm:gap-3 min-h-[64px] max-w-full ${
          answerStatus === 'wrong' ? 'shake-error' : ''
        }`}>
          {slots.map((slot, idx) => {
            if (slot.isFixed) {
              return (
                <div
                  key={idx}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-black italic text-2xl sm:text-3xl border-2 transition-all shadow-md ${
                    answerStatus === 'correct'
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : answerStatus === 'wrong'
                      ? 'bg-rose-500 text-white border-rose-700'
                      : 'bg-white text-gray-900 border-gray-300'
                  }`}
                >
                  {slot.char}
                </div>
              );
            }

            if (slot.char === '') {
              return (
                <div
                  key={idx}
                  className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-dashed border-white/70 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner"
                >
                  <span className="text-white/50 text-2xl font-bold">_</span>
                </div>
              );
            }

            return (
              <button
                key={idx}
                onClick={() => handleRemoveSlot(idx)}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg transition active:scale-95 border-b-4 ${
                  answerStatus === 'correct'
                    ? 'bg-emerald-500 text-white border-emerald-700'
                    : answerStatus === 'wrong'
                    ? 'bg-rose-500 text-white border-rose-700'
                    : 'bg-amber-400 hover:bg-amber-300 text-sky-950 border-amber-600'
                }`}
              >
                {slot.char}
              </button>
            );
          })}
        </div>
      </div>

      {/* Letters Pool */}
      <div className="w-full bg-[#0a5c9e]/40 p-4 sm:p-5 rounded-3xl mb-6 backdrop-blur-md border border-white/25 shadow-xl">
        <p className="text-white text-xs text-center font-extrabold mb-3 tracking-wider uppercase opacity-95">
          Pick the Missing Letters:
        </p>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {availableTiles.map((tile) => (
            <button
              key={tile.id}
              disabled={tile.isUsed || answerStatus === 'correct'}
              onClick={() => handleSelectTile(tile)}
              className={`w-11 h-11 sm:w-13 sm:h-13 text-xl sm:text-2xl font-black rounded-2xl transition-all transform ${
                tile.isUsed
                  ? 'bg-sky-950/40 text-transparent border-transparent cursor-not-allowed scale-90 opacity-20'
                  : 'bg-white hover:bg-amber-100 text-sky-900 border-b-4 border-sky-300 shadow-md active:scale-95'
              }`}
            >
              {tile.char}
            </button>
          ))}
        </div>
      </div>

      {/* Submit / Action Button sa Page */}
      <div className="flex justify-center w-full">
        {answerStatus !== 'correct' ? (
          <button
            onClick={handleCheckAnswer}
            disabled={!isFilled}
            className={`w-full sm:w-auto px-10 py-3.5 rounded-2xl font-black text-base uppercase tracking-wider transition ${
              isFilled
                ? 'bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white shadow-xl border-b-4 border-emerald-700 cursor-pointer'
                : 'bg-white/25 text-white/50 cursor-not-allowed'
            }`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleModalAction}
            className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 active:scale-95 text-sky-950 font-black px-10 py-3.5 rounded-2xl shadow-xl border-b-4 border-amber-600 transition text-base uppercase tracking-wider"
          >
            {isFinished ? "PLAY AGAIN 🔄" : "NEXT QUESTION ➔"}
          </button>
        )}
      </div>

      {/* CWS Modal */}
      <CwsModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onAction={handleModalAction}
        actionLabel={modalState.actionLabel}
      />
    </div>
  );
}