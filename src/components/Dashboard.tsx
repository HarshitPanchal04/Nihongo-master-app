import React, { useState } from 'react';
import { DAILY_TARGETS, WORD_OF_THE_DAY } from '../constants';
import { View } from '../types';
import { useUserProgress } from '../contexts/UserProgressContext';
import { 
  PlayCircle, 
  BookOpen, 
  Flame, 
  Check, 
  Pencil, 
  Lock, 
  Lightbulb, 
  Headphones, 
  FileText, 
  Hand, 
  Clock,
  Book,
  PenTool,
  MessageSquare,
  Scale
} from 'lucide-react';
import { HolographicCard } from './HolographicCard';
import { LessonPlayer } from './LessonPlayer';

const FlashcardItem: React.FC<{ card: any }> = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div 
      className="group perspective-1000 w-full h-48 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary/10 ${isFlipped ? 'rotate-y-180' : 'group-hover:rotate-y-180'}`}>
        {/* Front of Card */}
        <div className="absolute inset-0 backface-hidden bg-white dark:bg-dark-surface rounded-2xl border border-primary/10 dark:border-dark-border flex flex-col items-center justify-center p-6">
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary/20"></div>
          <span className="text-5xl font-black text-slate-900 dark:text-white mb-3">{card.word}</span>
          <span className="text-xs uppercase tracking-widest font-bold text-slate-300 dark:text-slate-600">Front</span>
        </div>
        {/* Back of Card */}
        <div className="absolute inset-0 backface-hidden bg-primary dark:bg-primary rounded-2xl flex flex-col items-center justify-center p-6 rotate-y-180 border border-primary-dark">
          <span className="text-2xl font-bold text-white mb-2 text-center leading-tight">{card.meaning}</span>
          <span className="text-sm font-medium text-white/80 bg-black/20 px-3 py-1 rounded-full">{card.romaji}</span>
        </div>
      </div>
    </div>
  );
};

interface DashboardProps {
  onViewChange: (view: View) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const [activeLesson, setActiveLesson] = useState(false);
  const { progress } = useUserProgress();

  const getDailyTargetIcon = (iconName: string) => {
    switch (iconName) {
      case 'draw': return <PenTool size={20} className="text-primary" />;
      case 'forum': return <MessageSquare size={20} className="text-primary" />;
      case 'rule': return <Scale size={20} className="text-primary" />;
      default: return <Pencil size={20} className="text-primary" />;
    }
  };

  if (activeLesson) {
    return (
      <LessonPlayer 
        lessonId={7} 
        lessonTitle="Shopping & Prices" 
        onClose={() => setActiveLesson(false)} 
      />
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Hero Section */}
      <HolographicCard className="lg:col-span-2 relative overflow-hidden bg-primary dark:bg-primary-dark rounded-2xl p-8 text-white shadow-xl shadow-primary/20">
        <div className="relative z-10 max-w-md">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            Current Module
          </span>
          <h3 className="text-3xl font-black mb-2">Shopping & Prices</h3>
          <p className="text-white/80 mb-6 font-light leading-relaxed">
            Learn how to ask "How much is this?" and handle basic transactions in Japanese.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center items-start">
            <button 
              onClick={() => setActiveLesson(true)}
              className="bg-white text-primary px-6 sm:px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-lg w-full sm:w-auto"
            >
              Continue Learning
              <PlayCircle size={20} />
            </button>
            <div className="flex flex-col items-center sm:items-start w-full sm:w-auto mt-2 sm:mt-0">
               <span className="text-xs font-bold uppercase tracking-widest text-primary-200 opacity-80">Rank: {progress.rank}</span>
               <span className="text-sm font-black">Level {progress.level} ({progress.xp} XP)</span>
               <div className="w-full sm:w-32 h-1.5 bg-black/20 rounded-full mt-2 overflow-hidden">
                 <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${(progress.xp % 100)}%` }}></div>
               </div>
            </div>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
          <Book size={240} />
        </div>
      </HolographicCard>

      {/* Weekly Streak */}
      <HolographicCard className="bg-white dark:bg-dark-surface rounded-2xl p-6 border border-primary/10 dark:border-dark-border shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg dark:text-white">Weekly Streak</h3>
          <div className="flex items-center gap-1 text-primary font-black">
            <Flame size={20} fill="currentColor" />
            {progress.streak} Days
          </div>
        </div>
        <div className="flex justify-between items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1 sm:gap-2 min-w-fit flex-shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400">{day}</span>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                i < 4 ? 'bg-primary text-white shadow-md shadow-primary/20' : 
                i === 4 ? 'bg-primary/10 dark:bg-primary/20 border-2 border-primary border-dashed text-primary' :
                'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600'
              }`}>
                {i < 4 ? <Check size={12} className="sm:w-3.5 sm:h-3.5" /> : 
                 i === 4 ? <Pencil size={12} className="animate-pulse sm:w-3.5 sm:h-3.5" /> : 
                 <Lock size={12} className="sm:w-3.5 sm:h-3.5" />}
              </div>
            </div>
          ))}
        </div>
      </HolographicCard>

      {/* Daily Targets */}
      <HolographicCard className="lg:col-span-2 bg-white dark:bg-dark-surface rounded-2xl p-6 border border-primary/10 dark:border-dark-border shadow-sm">
        <h3 className="font-bold text-lg dark:text-white mb-6">Daily Targets</h3>
        <div className="space-y-6">
          {DAILY_TARGETS.map((target) => (
            <div key={target.label}>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/5 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                    {getDailyTargetIcon(target.icon)}
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{target.label}</span>
                </div>
                <span className="text-sm font-bold text-primary">{target.current} / {target.total}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(189,0,44,0.3)] transition-all duration-1000 ease-out"
                  style={{ width: `${(target.current / target.total) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </HolographicCard>

      {/* Word of the Day */}
      <HolographicCard className="bg-white dark:bg-dark-surface rounded-2xl p-6 border border-primary/10 dark:border-dark-border shadow-sm flex flex-col items-center text-center">
        <div className="bg-primary/5 dark:bg-primary/20 p-3 rounded-full mb-4">
          <Lightbulb size={32} className="text-primary" />
        </div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Word of the Day</h3>
        <div className="mb-4">
          <h4 className="text-5xl font-black text-primary mb-1 tracking-tighter">{WORD_OF_THE_DAY.kanji}</h4>
          <p className="text-slate-500 dark:text-slate-400 font-medium">{WORD_OF_THE_DAY.romaji}</p>
        </div>
        <div className="w-full py-4 border-y border-primary/5 dark:border-dark-border mb-4">
          <p className="text-xl font-bold italic text-slate-700 dark:text-slate-300">"{WORD_OF_THE_DAY.meaning}"</p>
        </div>
        <div className="text-left w-full text-sm space-y-2 mb-6">
          <p className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Example Sentence</p>
          <p className="leading-relaxed font-medium text-slate-700 dark:text-slate-300">{WORD_OF_THE_DAY.example}</p>
          <p className="text-slate-400 text-xs italic">({WORD_OF_THE_DAY.exampleRomaji})</p>
        </div>
        <button className="w-full py-3 bg-primary/5 dark:bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all border border-primary/10 dark:border-dark-border">
          Add to Flashcards
        </button>
      </HolographicCard>

      {/* Flashcards */}
      <section className="lg:col-span-3 pb-6">
        <div className="flex justify-between items-end mb-4">
          <h3 className="font-bold text-lg dark:text-white">Flashcards Collection</h3>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Hover to flip</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { word: '食べる', romaji: 'taberu', meaning: 'to eat' },
            { word: '水', romaji: 'mizu', meaning: 'water' },
            { word: '電車', romaji: 'densha', meaning: 'train' },
            { word: '友達', romaji: 'tomodachi', meaning: 'friend' },
          ].map((card, i) => (
            <FlashcardItem key={i} card={card} />
          ))}
        </div>
      </section>
    </div>
  );
};
