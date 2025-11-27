import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageInput from './components/ImageInput';
import ResultDisplay from './components/ResultDisplay';
import { AnalysisState, ImageData } from './types';
import { analyzeImage } from './services/gemini';

const App: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisState>({
    status: 'idle',
    data: null,
    error: null,
  });

  const handleImageReady = async (image: ImageData) => {
    setCurrentImage(image);
    setAnalysis({ status: 'loading', data: null, error: null });

    try {
      // Analyze with Gemini
      const result = await analyzeImage(image.base64, image.mimeType);
      setAnalysis({
        status: 'success',
        data: result,
        error: null
      });
    } catch (error: any) {
      setAnalysis({
        status: 'error',
        data: null,
        error: error.message || "Something went wrong during analysis."
      });
    }
  };

  const handleReset = () => {
    setCurrentImage(null);
    setAnalysis({ status: 'idle', data: null, error: null });
  };

  return (
    <div className="min-h-screen flex flex-col bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col items-center">
        
        {/* Intro Hero */}
        {!currentImage && (
          <div className="text-center mb-12 animate-in fade-in zoom-in duration-500">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-arabic tracking-tight">
              حول صورتك إلى <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">نص سحري</span>
            </h2>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Upload any image and let our AI generate the perfect prompt to recreate it. 
              Supports English and Arabic output.
            </p>
          </div>
        )}

        {/* Input Section */}
        {!currentImage && (
          <ImageInput onImageReady={handleImageReady} isLoading={false} />
        )}

        {/* Loading State */}
        {analysis.status === 'loading' && currentImage && (
          <div className="w-full flex flex-col items-center justify-center py-12 animate-in fade-in duration-500">
            <div className="relative w-64 h-64 mb-8 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-indigo-500/20">
              <img src={currentImage.previewUrl} alt="Analyzing" className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                 <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-zinc-700 border-t-indigo-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-indigo-500 rounded-full animate-pulse opacity-50"></div>
                      </div>
                    </div>
                    <p className="text-white font-medium animate-pulse font-arabic">جاري تحليل الصورة...</p>
                 </div>
              </div>
            </div>
            <p className="text-zinc-500 text-sm">Analyzing composition, lighting, and style...</p>
          </div>
        )}

        {/* Error State */}
        {analysis.status === 'error' && (
          <div className="w-full max-w-2xl bg-red-900/10 border border-red-900/50 rounded-xl p-6 mb-8 text-center animate-in fade-in slide-in-from-top-4">
             <div className="w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
               </svg>
             </div>
             <h3 className="text-red-200 font-bold mb-2">Analysis Failed</h3>
             <p className="text-red-300/80 mb-6">{analysis.error}</p>
             <button onClick={handleReset} className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg transition-colors">
               Try Again
             </button>
          </div>
        )}

        {/* Success State */}
        {analysis.status === 'success' && analysis.data && currentImage && (
          <div className="w-full flex flex-col items-center">
            {/* Image Preview Small */}
             <div className="flex items-center gap-4 mb-8 bg-zinc-900/50 p-2 pr-6 rounded-full border border-zinc-800 backdrop-blur">
                <img src={currentImage.previewUrl} alt="Source" className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-700" />
                <span className="text-zinc-400 text-sm font-arabic">تم التحليل بنجاح</span>
                <button onClick={handleReset} className="ml-auto text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                  New Image
                </button>
             </div>

             <ResultDisplay data={analysis.data} />
          </div>
        )}

      </main>

      <footer className="w-full py-6 text-center text-zinc-600 text-sm border-t border-zinc-900">
        <p>&copy; {new Date().getFullYear()} Mazen Studio AI. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;