import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight,
  Info,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
  Mic2
} from 'lucide-react';
import { SPANISH_NUMBERS } from './constants';

export default function App() {
  const [selectedNum, setSelectedNum] = useState<typeof SPANISH_NUMBERS[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'study'>('grid');
  const [currentIdx, setCurrentIdx] = useState(0);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.lang = 'es-ES';
    msg.rate = 0.9; // Slightly slower for learning
    
    msg.onstart = () => setIsPlaying(true);
    msg.onend = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(msg);
  }, []);

  const handleSelect = (num: typeof SPANISH_NUMBERS[0]) => {
    setSelectedNum(num);
    speak(num.word);
  };

  const nextNum = () => {
    const next = SPANISH_NUMBERS[(selectedNum ? selectedNum.value : 0) % 100];
    handleSelect(next);
  };

  const prevNum = () => {
    const prev = SPANISH_NUMBERS[(selectedNum ? selectedNum.value - 2 + 100 : 99) % 100];
    handleSelect(prev);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100 overflow-x-hidden flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <GraduationCap size={24} />
            </div>
            <div>
                <h1 className="font-black text-xl tracking-tight text-slate-800 uppercase">Spanish Numbers</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Teacher Mode 1-100</p>
            </div>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
                onClick={() => setViewMode('grid')}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Grid
            </button>
            <button 
                onClick={() => {
                    setViewMode('study');
                    if (!selectedNum) handleSelect(SPANISH_NUMBERS[0]);
                }}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'study' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                Study
            </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 flex flex-col">
        <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
                <motion.div 
                    key="grid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 md:gap-3"
                >
                    {SPANISH_NUMBERS.map((num) => (
                        <NumberCard 
                            key={num.value} 
                            num={num} 
                            isSelected={selectedNum?.value === num.value}
                            onClick={() => handleSelect(num)}
                        />
                    ))}
                </motion.div>
            ) : (
                <motion.div 
                    key="study"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex-1 flex flex-col items-center justify-center py-10"
                >
                    <div className="w-full max-w-2xl bg-white rounded-[3rem] p-10 md:p-20 shadow-[0_20px_70px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col items-center relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full blur-[60px] -mr-20 -mt-20" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-50 rounded-full blur-[60px] -ml-20 -mb-20" />

                        <motion.div 
                            layoutId="active-num-val"
                            className="text-9xl md:text-[12rem] font-black tracking-tighter text-indigo-600 mb-8"
                        >
                            {selectedNum?.value}
                        </motion.div>

                        <motion.div 
                            key={selectedNum?.word}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl md:text-6xl font-black text-slate-800 uppercase tracking-tight text-center"
                        >
                            {selectedNum?.word}
                        </motion.div>

                        <button 
                            onClick={() => selectedNum && speak(selectedNum.word)}
                            className={`mt-12 w-24 h-24 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-indigo-600 text-white scale-110 shadow-xl shadow-indigo-200' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-95'}`}
                        >
                            <Volume2 size={40} className={isPlaying ? 'animate-pulse' : ''} />
                        </button>

                        {/* Navigation dots */}
                        <div className="absolute bottom-8 flex gap-1.5 overflow-hidden w-2/3 justify-center">
                            {SPANISH_NUMBERS.map(n => (
                                <div key={n.value} className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedNum?.value === n.value ? 'bg-indigo-600 w-4' : 'bg-slate-200'}`} />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6 mt-12">
                        <NavBtn icon={<ChevronLeft size={32} />} onClick={prevNum} />
                        <div className="text-slate-400 font-bold uppercase tracking-widest text-sm">Use arrows to browse</div>
                        <NavBtn icon={<ChevronRight size={32} />} onClick={nextNum} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </main>

      {/* Mini Visualizer / Active Bar */}
      <AnimatePresence>
        {selectedNum && viewMode === 'grid' && (
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-xl bg-slate-900 rounded-[2rem] p-4 flex items-center gap-6 shadow-2xl z-[60] border border-white/10"
            >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-4xl font-black text-white shrink-0">
                    {selectedNum.value}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-0.5">Translation</p>
                    <p className="text-2xl font-black text-white uppercase tracking-tight truncate">{selectedNum.word}</p>
                </div>
                <button 
                    onClick={() => speak(selectedNum.word)}
                    className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-900/40"
                >
                    <Volume2 size={24} />
                </button>
            </motion.div>
        )}
      </AnimatePresence>

      <footer className="p-8 text-center border-t border-slate-100 bg-white">
          <div className="max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-center gap-2 text-indigo-600 mb-2">
                  <BookOpen size={16} />
                  <span className="text-xs font-black uppercase tracking-widest">Education Pro</span>
              </div>
              <p className="text-slate-500 text-sm font-medium">Click any number to hear its perfect Spanish pronunciation and see how it's written.</p>
          </div>
      </footer>
    </div>
  );
}

function NumberCard({ num, isSelected, onClick }: any) {
    return (
        <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`aspect-square rounded-xl border flex items-center justify-center text-lg md:text-xl font-black transition-all ${
                isSelected 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/30'
            }`}
        >
            {num.value}
        </motion.button>
    );
}

function NavBtn({ icon, onClick }: { icon: React.ReactNode, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className="w-16 h-16 bg-white border border-slate-200 rounded-3xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-xl transition-all active:scale-90"
        >
            {icon}
        </button>
    );
}
