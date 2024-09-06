import React from 'react';

export function Card({ children }) {
  return <div className="bg-gradient-to-r from-pink-300 to-purple-300 shadow-md rounded-lg overflow-hidden">{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="px-6 py-4 bg-gradient-to-r from-pink-200 to-purple-200">{children}</div>;
}

export function CardTitle({ children }) {
  return <h2 className="text-xl font-semibold text-black">{children}</h2>;
}

export function CardContent({ children }) {
  return <div className="px-6 py-4 text-black">{children}</div>;
}