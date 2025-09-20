
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StorySegment, GameState, UploadedImage } from './types';
import { generateStorySegment } from './services/geminiService';
import StoryPanel from './components/StoryPanel';
import Controls from './components/Controls';
import Header from './components/Header';
import ErrorDisplay from './components/ErrorDisplay';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.INITIAL);
  const [storySegments, setStorySegments] = useState<StorySegment[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);

  const handleStartGame = useCallback(async (premise: string) => {
    if (!premise.trim()) {
      setError("Please provide a starting premise for your adventure.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setGameState(GameState.LOADING);

    const firstSegment: StorySegment = { text: premise, from: 'user' };
    setStorySegments([firstSegment]);

    try {
      const result = await generateStorySegment([firstSegment], uploadedImage);
      setStorySegments(prev => [...prev, { text: result.storyText, from: 'ai' }]);
      setChoices(result.choices);
      setGameState(GameState.PLAYING);
    } catch (err) {
      console.error(err);
      setError("The AI failed to weave the first thread of fate. Please try again.");
      setGameState(GameState.ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage]);

  const handleChoiceSelected = useCallback(async (choice: string) => {
    setError(null);
    setIsLoading(true);
    setGameState(GameState.LOADING);
    setChoices([]);

    const newSegments: StorySegment[] = [
      ...storySegments,
      { text: choice, from: 'user' },
    ];
    setStorySegments(newSegments);
    
    try {
      const result = await generateStorySegment(newSegments, null); // Image is only used for the first prompt
      setStorySegments(prev => [...prev, { text: result.storyText, from: 'ai' }]);
      setChoices(result.choices);
      setGameState(GameState.PLAYING);
    } catch (err) {
      console.error(err);
      setError("The connection to the story realm was lost. Try making another choice.");
      setGameState(GameState.ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [storySegments]);

  const handleReset = () => {
    setGameState(GameState.INITIAL);
    setStorySegments([]);
    setChoices([]);
    setIsLoading(false);
    setError(null);
    setUploadedImage(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans flex flex-col p-4 md:p-6 lg:p-8">
      <Header />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-5 gap-8 min-h-0">
        <div className="lg:col-span-3 bg-slate-800/50 rounded-lg shadow-lg overflow-hidden flex flex-col h-[60vh] lg:h-auto">
          <StoryPanel segments={storySegments} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-2 bg-slate-800/50 rounded-lg shadow-lg p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-cyan-400 mb-4 border-b-2 border-cyan-400/20 pb-2">Your Move, Adventurer</h2>
            {error && <ErrorDisplay message={error} />}
            <Controls
              gameState={gameState}
              choices={choices}
              isLoading={isLoading}
              onStartGame={handleStartGame}
              onChoiceSelected={handleChoiceSelected}
              onImageUpload={setUploadedImage}
              uploadedImage={uploadedImage}
            />
          </div>
          <div className="mt-6">
             <button
              onClick={handleReset}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md disabled:bg-gray-500 disabled:cursor-not-allowed"
              disabled={gameState === GameState.INITIAL}
            >
              Start a New Legend
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
