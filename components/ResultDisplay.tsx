import React, { useState } from 'react';
import { PromptResult } from '../types';

interface ResultDisplayProps {
  data: PromptResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ data }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* English Prompt */}
      <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl p-6 flex flex-col h-full relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
              <span className="text-2xl">🇺🇸</span> English Prompt
            </h3>
            <button 
              onClick={() => handleCopy(data.english, 'english')}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
              title="Copy"
            >
              {copiedKey === 'english' ? (
                <span className="text-green-400 text-sm font-bold flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Copied
                </span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5" />
                </svg>
              )}
            </button>
         </div>
         <div className="flex-1 bg-zinc-950 rounded-xl p-4 border border-zinc-800/50 shadow-inner">
           <p className="text-zinc-300 leading-relaxed text-sm md:text-base font-light font-mono selection:bg-cyan-500/30 selection:text-cyan-100">
             {data.english}
           </p>
         </div>
      </div>

      {/* Arabic Prompt */}
      <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800 rounded-2xl p-6 flex flex-col h-full relative overflow-hidden group" dir="rtl">
         <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-emerald-500 to-green-600"></div>
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2 font-arabic">
              <span className="text-2xl">🇸🇦</span> الوصف العربي
            </h3>
            <button 
              onClick={() => handleCopy(data.arabic, 'arabic')}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
              title="نسخ"
            >
              {copiedKey === 'arabic' ? (
                <span className="text-green-400 text-sm font-bold flex items-center gap-1 font-arabic">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  تم النسخ
                </span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5" />
                </svg>
              )}
            </button>
         </div>
         <div className="flex-1 bg-zinc-950 rounded-xl p-4 border border-zinc-800/50 shadow-inner">
           <p className="text-zinc-300 leading-relaxed text-sm md:text-base font-light font-arabic text-right selection:bg-emerald-500/30 selection:text-emerald-100">
             {data.arabic}
           </p>
         </div>
      </div>
    </div>
  );
};

export default ResultDisplay;