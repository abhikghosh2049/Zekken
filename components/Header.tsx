import React from 'react';
import { ZEKKEN_LOGO } from '../constants';

export const Header: React.FC = () => {
  return (
    <header className="text-center flex flex-col items-center">
      <div className="flex items-center gap-4 mb-2">
        {ZEKKEN_LOGO}
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-400">
          Zekken
        </h1>
      </div>
      <p className="mt-2 text-lg text-zinc-400 max-w-2xl mx-auto">
        Your personal AI for the smartest, fastest rides.
      </p>
    </header>
  );
};