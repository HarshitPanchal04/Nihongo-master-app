import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  TrainFront, 
  RotateCcw, 
  RotateCw, 
  Pause, 
  Play, 
  ChevronUp, 
  FileText, 
  HelpCircle, 
  CheckCircle, 
  Flag 
} from 'lucide-react';

export const Listening: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(45);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const questions = [
    {
      id: 1,
      text: '女の人はどこへ行きたいですか。',
      translation: 'Where does the woman want to go?',
      options: [
        { text: 'ぎんこう', translation: 'Bank' },
        { text: 'しんじゅくえき', translation: 'Shinjuku Station' },
        { text: 'デパート', translation: 'Department Store' }
      ],
      correct: 1
    }
  ];

  return (
    <div className="max-w-[960px] mx-auto w-full px-4 py-8 flex flex-col gap-8">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
        <a href="#" className="text-primary hover:underline">N5 Level</a>
        <span className="text-slate-300">/</span>
        <span className="text-slate-400">Listening Practice</span>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">At the Train Station</h1>
        <p className="text-slate-500 font-medium">Listen to the dialogue and answer the questions below.</p>
      </div>

      <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Headphones size={120} />
        </div>
        
        <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
          <div className="w-56 h-56 rounded-[40px] bg-slate-100 flex items-center justify-center relative overflow-hidden group shadow-inner">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: "url('https://picsum.photos/seed/station/400/400')" }}
            ></div>
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
            <TrainFront size={72} className="text-white relative z-10 drop-shadow-2xl fill-white" />
          </div>
          
          <div className="flex-1 w-full space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Dialogue 04</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">N5 Difficulty</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 leading-tight">Directions to Shinjuku</h3>
              <p className="text-slate-400 font-bold text-sm mt-1 uppercase tracking-tight">Topic: Transportation • Duration: 2:15</p>
            </div>
            
            <div className="space-y-3">
              <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-300 shadow-lg"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs font-black text-slate-400 tracking-tighter">
                <span>{Math.floor((progress / 100) * 135 / 60)}:{String(Math.floor((progress / 100) * 135 % 60)).padStart(2, '0')}</span>
                <span>2:15</span>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-8">
              <button className="text-slate-300 hover:text-primary transition-all hover:scale-110 active:scale-90">
                <RotateCcw size={30} />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-20 w-20 bg-primary text-white rounded-[28px] flex items-center justify-center hover:scale-105 transition-all shadow-2xl shadow-primary/40 active:scale-95 group"
              >
                {isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" />}
              </button>
              <button className="text-slate-300 hover:text-primary transition-all hover:scale-110 active:scale-90">
                <RotateCw size={30} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-10 border-t border-slate-50 pt-8 flex flex-col gap-4">
          <button 
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center gap-3 text-primary font-black text-sm bg-primary/5 px-6 py-3 rounded-2xl hover:bg-primary/10 transition-all w-fit"
          >
            {showTranscript ? <ChevronUp size={20} /> : <FileText size={20} />}
            {showTranscript ? 'Hide Transcript' : 'Show Transcript (Japanese / English)'}
          </button>
          
          {showTranscript && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <span className="font-black text-primary text-xs uppercase">A:</span>
                  <p className="text-slate-800 font-medium">すみません、しんじゅくえきはどこですか。</p>
                </div>
                <div className="flex gap-4">
                  <span className="font-black text-slate-400 text-xs uppercase">B:</span>
                  <p className="text-slate-800 font-medium">まっすぐ行って、右にまがってください。</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <HelpCircle size={24} className="text-primary" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Comprehension</h2>
        </div>
        
        <div className="grid gap-6">
          {questions.map((q) => (
            <div key={q.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <div className="mb-6">
                <p className="text-xl font-black text-slate-900">{q.id}. {q.text}</p>
                <p className="text-slate-400 font-bold text-sm mt-1">({q.translation})</p>
              </div>
              <div className="grid gap-3">
                {q.options.map((opt, i) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedOption(i)}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all group ${
                      selectedOption === i 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-slate-50 hover:border-primary/20 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedOption === i ? 'border-primary bg-primary' : 'border-slate-200 group-hover:border-primary/40'
                    }`}>
                      {selectedOption === i && <div className="size-2 bg-white rounded-full"></div>}
                    </div>
                    <div className="flex-1">
                      <p className={`font-black ${selectedOption === i ? 'text-primary' : 'text-slate-700'}`}>{opt.text}</p>
                      <p className={`text-xs font-bold ${selectedOption === i ? 'text-primary/60' : 'text-slate-400'}`}>{opt.translation}</p>
                    </div>
                    {selectedOption === i && (
                      <CheckCircle size={20} className="text-primary animate-in zoom-in" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between bg-slate-900 p-5 rounded-[32px] mt-8 sticky bottom-6 shadow-2xl border border-white/10">
        <div className="flex items-center gap-6 px-4">
          <div className="hidden sm:block">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Progress</p>
            <p className="text-sm font-black text-white">1 of 3 Completed</p>
          </div>
          <div className="h-10 w-px bg-white/10 hidden sm:block"></div>
          <button className="flex items-center gap-2 text-slate-400 hover:text-white font-black text-xs uppercase tracking-widest transition-colors">
            <Flag size={14} />
            Report
          </button>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-2xl border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95">
            Save
          </button>
          <button 
            disabled={selectedOption === null}
            className={`px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
              selectedOption === null 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
