import React from 'react';

export default function CwsModal({ isOpen, title, message, onAction, actionLabel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center border-4 border-amber-300 relative shadow-2xl">
        {/* Top Trophy/Confetti Icon */}
        <div className="w-16 h-16 rounded-full mx-auto -mt-12 flex items-center justify-center text-3xl shadow-lg border-4 border-white bg-emerald-500">
          🎉
        </div>

        <h3 className="text-2xl font-black mt-3 uppercase tracking-wider text-emerald-600">
          {title || 'GREAT JOB!'}
        </h3>

        <p className="text-gray-700 text-base font-semibold mt-2 leading-relaxed px-2">
          {message}
        </p>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onAction}
            className="bg-amber-400 hover:bg-amber-300 text-sky-950 font-black px-8 py-3 rounded-2xl shadow-lg border-b-4 border-amber-600 active:scale-95 transition uppercase tracking-wider text-sm"
          >
            {actionLabel || "Next Question ➔"}
          </button>
        </div>
      </div>
    </div>
  );
}