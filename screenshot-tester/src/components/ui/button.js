import React from 'react';

export function Button({ children, ...props }) {
  return (
    <button
      className="relative px-4 py-2 rounded-lg font-semibold text-white
                 bg-gradient-to-r from-pink-500 to-purple-600
                 hover:from-pink-600 hover:to-purple-700
                 disabled:from-pink-300 disabled:to-purple-400
                 transition-all duration-300 ease-in-out
                 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]
                 group"
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-400 to-purple-500 opacity-0 group-hover:opacity-50 blur-md transition-opacity duration-300 ease-in-out"></span>
    </button>
  );
}