
import React, { useState } from 'react';
import { GameState, UploadedImage } from '../types';
import FileUpload from './FileUpload';
import Spinner from './Spinner';

interface ControlsProps {
  gameState: GameState;
  choices: string[];
  isLoading: boolean;
  onStartGame: (premise: string) => void;
  onChoiceSelected: (choice: string) => void;
  onImageUpload: (image: UploadedImage | null) => void;
  uploadedImage: UploadedImage | null;
}

const Controls: React.FC<ControlsProps> = ({
  gameState,
  choices,
  isLoading,
  onStartGame,
  onChoiceSelected,
  onImageUpload,
  uploadedImage,
}) => {
  const [premise, setPremise] = useState('');

  const handleStart = () => {
    onStartGame(premise);
  };

  if (gameState === GameState.INITIAL) {
    return (
      <div className="space-y-4">
        <div>
          <label htmlFor="premise" className="block text-sm font-medium text-slate-300 mb-2">
            Describe your hero, world, or opening scene:
          </label>
          <textarea
            id="premise"
            rows={4}
            className="w-full bg-slate-900/70 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            placeholder="e.g., A grizzled space pirate on a derelict starship..."
            value={premise}
            onChange={(e) => setPremise(e.target.value)}
          />
        </div>
        <FileUpload onImageUpload={onImageUpload} uploadedImage={uploadedImage} />
        <button
          onClick={handleStart}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md disabled:bg-gray-500"
          disabled={!premise.trim() || isLoading}
        >
          Weave the First Thread
        </button>
      </div>
    );
  }

  if (isLoading || gameState === GameState.LOADING) {
    return (
        <div className="flex flex-col items-center justify-center text-center text-slate-400 p-8 space-y-4">
            <Spinner />
            <p className="text-lg">Consulting the Oracle...</p>
            <p>Your destiny is being written.</p>
        </div>
    );
  }

  if (gameState === GameState.PLAYING || gameState === GameState.ERROR) {
    return (
      <div className="space-y-3">
        {choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => onChoiceSelected(choice)}
            className="w-full text-left bg-slate-700 hover:bg-indigo-600 text-slate-200 font-semibold py-3 px-5 rounded-lg transition-all duration-200 shadow-sm transform hover:scale-105"
          >
            {choice}
          </button>
        ))}
      </div>
    );
  }

  return null;
};

export default Controls;
