
import React, { useEffect, useRef } from 'react';
import type { StorySegment } from '../types';
import Spinner from './Spinner';

interface StoryPanelProps {
  segments: StorySegment[];
  isLoading: boolean;
}

const StoryPanel: React.FC<StoryPanelProps> = ({ segments, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [segments, isLoading]);

  return (
    <div className="flex-grow p-6 overflow-y-auto custom-scrollbar">
      {segments.length === 0 && !isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-slate-400">
            <p className="text-2xl font-semibold">The Chronicle is Blank.</p>
            <p className="mt-2">Your adventure awaits its first chapter.</p>
          </div>
        </div>
      )}
      {segments.map((segment, index) => (
        <div key={index} className={`mb-6 animate-fade-in ${segment.from === 'user' ? 'text-right' : 'text-left'}`}>
          {segment.from === 'user' ? (
             <div className="inline-block bg-indigo-500/80 text-white rounded-lg p-3 max-w-xl shadow-md">
                <p className="font-semibold italic">You chose: "{segment.text}"</p>
             </div>
          ) : (
            <div className="inline-block bg-slate-700/50 rounded-lg p-4 max-w-2xl shadow-md">
              <p className="whitespace-pre-wrap leading-relaxed">{segment.text}</p>
            </div>
          )}
        </div>
      ))}
      {isLoading && (
         <div className="flex justify-center items-center p-4">
            <Spinner />
            <p className="ml-4 text-slate-400 animate-pulse">The AI is weaving the next thread of fate...</p>
         </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default StoryPanel;
