
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-6 md:mb-8">
      <h1 className="text-4xl md:text-5xl font-extrabold">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
          AI Dungeon Master
        </span>
      </h1>
      <p className="text-slate-400 mt-2 text-lg">Your Interactive Story Weaver</p>
    </header>
  );
};

export default Header;
