import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, 
  Eye, 
  EyeOff, 
  Trash2, 
  CheckCircle, 
  ArrowLeft,
  ArrowRight 
} from 'lucide-react';
import { useUserProgress } from '../contexts/UserProgressContext';

const KANJI_DATA = [
  { char: '山', romaji: 'Yama', meaning: 'Mountain', strokes: 3, hints: ['1', '2', '3'], positions: [{t:'25%', l:'48%'}, {t:'45%', l:'22%'}, {t:'45%', l:'75%'}] },
  { char: '川', romaji: 'Kawa', meaning: 'River', strokes: 3, hints: ['1', '2', '3'], positions: [{t:'25%', l:'25%'}, {t:'25%', l:'50%'}, {t:'25%', l:'75%'}] },
  { char: '日', romaji: 'Hi', meaning: 'Sun/Day', strokes: 4, hints: ['1', '2', '3', '4'], positions: [{t:'20%', l:'30%'}, {t:'20%', l:'70%'}, {t:'50%', l:'50%'}, {t:'80%', l:'50%'}] },
  { char: '月', romaji: 'Tsuki', meaning: 'Moon', strokes: 4, hints: ['1', '2', '3', '4'], positions: [{t:'20%', l:'30%'}, {t:'20%', l:'70%'}, {t:'45%', l:'50%'}, {t:'70%', l:'50%'}] },
];

export const Writing: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [strokeCount, setStrokeCount] = useState(0);
  const [feedback, setFeedback] = useState<{status: 'success' | 'error' | 'idle', message: string}>({status: 'idle', message: ''});
  const [hasAwardedXp, setHasAwardedXp] = useState(false);
  const { addXp } = useUserProgress();
  
  const currentKanji = KANJI_DATA[currentIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#bd002c';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Reset canvas on kanji change
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokeCount(0);
    setFeedback({status: 'idle', message: ''});
  }, [currentIndex]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setFeedback({status: 'idle', message: ''}); // clear feedback when they retry
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setStrokeCount(prev => prev + 1);
    }
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setStrokeCount(0);
    setFeedback({status: 'idle', message: ''});
  };

  const playKanaAudio = () => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(currentKanji.char);
    u.lang = 'ja-JP';
    u.rate = 0.8;
    window.speechSynthesis.speak(u);
  };

  const checkAnswer = () => {
    if (strokeCount === currentKanji.strokes) {
      setFeedback({
        status: 'success', 
        message: '✨ Perfect! Correct number of strokes. (+10 XP)'
      });
      if (!hasAwardedXp) {
        addXp(10);
        setHasAwardedXp(true);
      }
    } else if (strokeCount === 0) {
      setFeedback({
        status: 'error', 
        message: 'Write the character first!'
      });
    } else {
      setFeedback({
        status: 'error', 
        message: `❌ You drew ${strokeCount} strokes, but this character requires ${currentKanji.strokes} strokes.`
      });
    }
  };

  const nextKanji = () => {
    if (currentIndex < KANJI_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setHasAwardedXp(false);
    }
  };

  const prevKanji = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setHasAwardedXp(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8 flex flex-col items-center">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-primary/5">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Kanji Practice</span>
            <span className="text-slate-400 text-xs font-bold">Step {currentIndex + 1} of {KANJI_DATA.length}</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mt-1">
            {currentKanji.char} <span className="text-xl font-medium text-slate-400">({currentKanji.romaji})</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">Meaning: <span className="text-slate-800 font-bold">{currentKanji.meaning}</span> • Strokes: <span className="text-slate-800 font-bold">{currentKanji.strokes}</span></p>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-1">
            <button 
              onClick={playKanaAudio}
              className="size-12 rounded-2xl border-2 border-primary/10 flex items-center justify-center text-primary bg-white hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              <Volume2 size={24} />
            </button>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Listen</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button 
              onClick={() => setShowGuide(!showGuide)}
              className={`size-12 rounded-2xl border-2 flex items-center justify-center transition-all shadow-sm ${showGuide ? 'bg-primary border-primary text-white' : 'bg-white border-primary/10 text-primary hover:bg-primary/5'}`}
            >
              {showGuide ? <Eye size={24} /> : <EyeOff size={24} />}
            </button>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Guide</span>
          </div>
        </div>
      </div>

      <div className="w-full aspect-square max-w-[500px] relative bg-white rounded-3xl shadow-xl border-2 border-slate-100 writing-grid overflow-hidden">
        {showGuide && (
          <>
            <div className="absolute inset-0 flex items-center justify-center ghost-char text-[320px] font-serif leading-none opacity-10">
              {currentKanji.char}
            </div>
            <div className="absolute inset-0 pointer-events-none">
              {currentKanji.positions.map((pos, i) => (
                <span 
                  key={i}
                  className="absolute text-primary/40 font-black text-xl bg-white/80 size-8 rounded-full flex items-center justify-center shadow-sm border border-primary/10"
                  style={{ top: pos.t, left: pos.l }}
                >
                  {currentKanji.hints[i]}
                </span>
              ))}
            </div>
          </>
        )}
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="absolute inset-0 cursor-crosshair w-full h-full z-10"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
        />
      </div>

      {feedback.status !== 'idle' && (
        <div className={`mt-6 p-4 w-full max-w-[500px] rounded-xl border text-center font-bold ${feedback.status === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {feedback.message}
        </div>
      )}

      <div className="w-full max-w-[500px] flex gap-4 mt-8">
        <button 
          onClick={clearCanvas}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all border border-slate-200"
        >
          <Trash2 size={20} />
          Clear
        </button>
        <button 
          onClick={checkAnswer}
          className="flex-[2] flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all transform active:scale-95"
        >
          <CheckCircle size={20} />
          Check Answer
        </button>
      </div>

      <div className="w-full max-w-[500px] mt-12 flex items-center justify-between">
        <button 
          onClick={prevKanji}
          disabled={currentIndex === 0}
          className={`p-3 rounded-xl transition-all flex items-center gap-2 font-bold ${currentIndex === 0 ? 'text-slate-200' : 'text-slate-400 hover:text-primary hover:bg-primary/5'}`}
        >
          <ArrowLeft size={20} />
          Previous
        </button>
        <div className="flex gap-2">
          {KANJI_DATA.map((_, i) => (
            <div 
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-slate-200'}`}
            ></div>
          ))}
        </div>
        <button 
          onClick={nextKanji}
          disabled={currentIndex === KANJI_DATA.length - 1}
          className={`p-3 rounded-xl transition-all flex items-center gap-2 font-bold ${currentIndex === KANJI_DATA.length - 1 ? 'text-slate-200' : 'text-slate-400 hover:text-primary hover:bg-primary/5'}`}
        >
          Next
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
