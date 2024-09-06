import React from 'react';

export function Textarea(props) {
  return (
    <textarea
      className="w-full p-2 border border-purple-300 rounded-lg 
                 bg-gradient-to-r from-pink-100 to-purple-100
                 focus:outline-none focus:ring-2 focus:ring-pink-400
                 text-purple-900 placeholder-purple-400
                 transition duration-300 ease-in-out"
      {...props}
    />
  );
}