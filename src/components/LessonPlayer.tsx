import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, ArrowLeft, Volume2, CheckCircle } from 'lucide-react';

interface LessonPlayerProps {
  lessonId: number;
  lessonTitle: string;
  onClose: () => void;
}

const hiraganaItems = [
  { char: 'あ', romaji: 'a', example: 'あさ (asa - morning)' },
  { char: 'い', romaji: 'i', example: 'いぬ (inu - dog)' },
  { char: 'う', romaji: 'u', example: 'うみ (umi - sea)' },
  { char: 'え', romaji: 'e', example: 'えき (eki - station)' },
  { char: 'お', romaji: 'o', example: 'おとこ (otoko - man)' },
  { char: 'か', romaji: 'ka', example: 'かさ (kasa - umbrella)' },
  { char: 'き', romaji: 'ki', example: 'き (ki - tree)' },
  { char: 'く', romaji: 'ku', example: 'くも (kumo - cloud/spider)' },
  { char: 'け', romaji: 'ke', example: 'けむり (kemuri - smoke)' },
  { char: 'こ', romaji: 'ko', example: 'こども (kodomo - child)' }
];

const katakanaItems = [
  { char: 'ア', romaji: 'a', example: 'アメリカ (amerika - America)' },
  { char: 'イ', romaji: 'i', example: 'インターネット (intaanetto - Internet)' },
  { char: 'ウ', romaji: 'u', example: 'ウエーター (ueetaa - Waiter)' },
  { char: 'エ', romaji: 'e', example: 'エレベーター (erebeetaa - Elevator)' },
  { char: 'オ', romaji: 'o', example: 'オレンジ (orenji - Orange)' },
  { char: 'カ', romaji: 'ka', example: 'カメラ (kamera - Camera)' },
  { char: 'キ', romaji: 'ki', example: 'キー (kii - Key)' },
  { char: 'ク', romaji: 'ku', example: 'クラス (kurasu - Class)' },
  { char: 'ケ', romaji: 'ke', example: 'ケーキ (keeki - Cake)' },
  { char: 'コ', romaji: 'ko', example: 'コーヒー (koohii - Coffee)' }
];

const greetingsItems = [
  { char: 'こんにちは', romaji: 'Konnichiwa', example: 'Hello / Good afternoon' },
  { char: 'おはようございます', romaji: 'Ohayou gozaimasu', example: 'Good morning' },
  { char: 'こんばんは', romaji: 'Konbanwa', example: 'Good evening' },
  { char: 'ありがとうございます', romaji: 'Arigatou gozaimasu', example: 'Thank you very much' },
  { char: 'すみません', romaji: 'Sumimasen', example: 'Excuse me / I am sorry' },
];

const foodItems = [
  { char: 'いただきます', romaji: 'Itadakimasu', example: 'Let\'s eat (said before meals)' },
  { char: 'ごちそうさまでした', romaji: 'Gochisousama deshita', example: 'Thank you for the meal (after eating)' },
  { char: 'おいしいです', romaji: 'Oishii desu', example: 'It is delicious' },
  { char: 'これをください', romaji: 'Kore o kudasai', example: 'Please give me this (when ordering)' },
  { char: 'お水をお願いします', romaji: 'Omizu o onegaishimasu', example: 'Water, please' },
];

const questionItems = [
  { char: 'これは何ですか？', romaji: 'Kore wa nan desu ka?', example: 'What is this?' },
  { char: 'いくらですか？', romaji: 'Ikura desu ka?', example: 'How much is this?' },
  { char: 'どこですか？', romaji: 'Doko desu ka?', example: 'Where is it?' },
  { char: 'いつですか？', romaji: 'Itsu desu ka?', example: 'When is it?' },
  { char: 'なぜですか？', romaji: 'Naze desu ka?', example: 'Why?' },
];

const helpItems = [
  { char: '助けてください！', romaji: 'Tasukete kudasai!', example: 'Please help me!' },
  { char: '英語を話せますか？', romaji: 'Eigo o hanasemasu ka?', example: 'Can you speak English?' },
  { char: 'わかりません', romaji: 'Wakarimasen', example: 'I do not understand' },
  { char: '迷子になりました', romaji: 'Maigo ni narimashita', example: 'I am lost' },
  { char: 'もう一度言ってください', romaji: 'Mou ichido itte kudasai', example: 'Please say it again' },
];

const shoppingItems = [
  { char: 'いくらですか？', romaji: 'Ikura desu ka?', example: 'How much is this?' },
  { char: 'これをお願いします', romaji: 'Kore o onegaishimasu', example: 'This one, please' },
  { char: 'カードは使えますか？', romaji: 'Kaado wa tsukaemasu ka?', example: 'Can I use a credit card?' },
  { char: '安くしてください', romaji: 'Yasuku shite kudasai', example: 'Please give me a discount' },
  { char: '袋はいりません', romaji: 'Fukuro wa irimasen', example: 'I do not need a bag' },
];

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ lessonId, lessonTitle, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Choose the items based on the lesson ID
  let items = hiraganaItems;
  if (lessonId === 2) items = katakanaItems;
  else if (lessonId === 3) items = greetingsItems;
  else if (lessonId === 4) items = foodItems;
  else if (lessonId === 5) items = questionItems;
  else if (lessonId === 6) items = helpItems;
  else if (lessonId === 7) items = shoppingItems;
  const isFinished = currentIndex >= items.length;

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      // Adjust speaking rate if desired
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-dark-surface rounded-2xl shadow-xl mt-12 max-w-lg mx-auto border border-primary/10 dark:border-dark-border text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-400">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-black mb-2 dark:text-white">Lesson Complete!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">You've successfully completed {lessonTitle}.</p>
        <button 
          onClick={onClose}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          Return to Lessons
        </button>
      </div>
    );
  }

  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;

  return (
    <div className="max-w-[800px] mx-auto w-full px-4 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 p-6 bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-primary/5 dark:border-dark-border">
        <div className="flex gap-6 justify-between items-end">
          <div className="flex flex-col gap-1">
            <p className="text-primary text-xs font-bold uppercase tracking-widest">{lessonTitle}</p>
            <p className="text-slate-900 dark:text-white text-lg font-bold leading-normal">
              Item {currentIndex + 1} of {items.length}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-100 dark:bg-slate-800 rounded-full">
            <X size={20} />
          </button>
        </div>
        <div className="h-3 rounded-full bg-primary/10 dark:bg-primary/20 overflow-hidden mt-2">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Card area */}
      <div className="flex items-center justify-center py-10 relative perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -50, rotateY: -15 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white dark:bg-dark-surface w-full max-w-sm rounded-[2rem] p-12 flex flex-col items-center border border-primary/10 dark:border-dark-border shadow-2xl shadow-primary/5 relative"
          >
            <button 
              onClick={() => handleSpeak(currentItem.char)}
              className="absolute top-6 right-6 p-3 text-primary bg-primary/5 hover:bg-primary/10 rounded-full transition-colors"
              title="Pronounce"
            >
              <Volume2 size={24} />
            </button>
            
            <h1 className="text-slate-900 dark:text-white text-8xl md:text-9xl font-black py-4 select-none mb-6 text-center">
              {currentItem.char}
            </h1>
            
            <div className="w-full h-px bg-slate-100 dark:bg-dark-border mb-6"></div>
            
            <div className="flex flex-col items-center w-full">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-widest mb-1">Romaji</span>
              <span className="text-primary font-bold text-4xl mb-6">{currentItem.romaji}</span>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 w-full rounded-xl p-4 flex flex-col items-center text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Example</span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{currentItem.example}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-auto">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-6 py-4 rounded-xl font-bold transition-colors ${
            currentIndex === 0 
              ? 'text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed border border-transparent' 
              : 'text-slate-700 dark:text-slate-300 bg-white dark:bg-dark-surface hover:border-primary border border-slate-200 dark:border-dark-border shadow-sm'
          }`}
        >
          <ArrowLeft size={20} />
          Previous
        </button>
        
        <button 
          onClick={handleNext}
          className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
        >
          {currentIndex === items.length - 1 ? 'Finish' : 'Next'}
          {currentIndex !== items.length - 1 && <ArrowRight size={20} />}
        </button>
      </div>
    </div>
  );
};
