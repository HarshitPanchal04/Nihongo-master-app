import React, { useState, useEffect } from 'react';
import { View } from '../types';
import { Trophy, Check, X, ArrowRight, CheckCircle } from 'lucide-react';
import { generateQuizQuestions } from '../services/quizService';

const hiraganaToRomaji: Record<string, string> = {
  'あ':'a', 'い':'i', 'う':'u', 'え':'e', 'お':'o',
  'か':'ka', 'き':'ki', 'く':'ku', 'け':'ke', 'こ':'ko',
  'さ':'sa', 'し':'shi', 'す':'su', 'せ':'se', 'そ':'so',
  'た':'ta', 'ち':'chi', 'つ':'tsu', 'て':'te', 'と':'to',
  'な':'na', 'に':'ni', 'ぬ':'nu', 'ね':'ne', 'の':'no',
  'は':'ha', 'ひ':'hi', 'ふ':'fu', 'へ':'he', 'ほ':'ho',
  'ま':'ma', 'み':'mi', 'む':'mu', 'め':'me', 'も':'mo',
  'や':'ya', 'ゆ':'yu', 'よ':'yo',
  'ら':'ra', 'り':'ri', 'る':'ru', 'れ':'re', 'ろ':'ro',
  'わ':'wa', 'を':'wo', 'ん':'n',
  'が':'ga', 'ぎ':'gi', 'ぐ':'gu', 'げ':'ge', 'ご':'go',
  'ざ':'za', 'じ':'ji', 'ず':'zu', 'ぜ':'ze', 'ぞ':'zo',
  'だ':'da', 'ぢ':'ji', 'づ':'zu', 'で':'de', 'ど':'do',
  'ば':'ba', 'び':'bi', 'ぶ':'bu', 'べ':'be', 'ぼ':'bo',
  'ぱ':'pa', 'ぴ':'pi', 'ぷ':'pu', 'ぺ':'pe', 'ぽ':'po',
  'きゃ':'kya', 'きゅ':'kyu', 'きょ':'kyo',
  'しゃ':'sha', 'しゅ':'shu', 'しょ':'sho',
  'ちゃ':'cha', 'ちゅ':'chu', 'ちょ':'cho',
  'にゃ':'nya', 'にゅ':'nyu', 'にょ':'nyo',
  'ひゃ':'hya', 'ひゅ':'hyu', 'ひょ':'hyo',
  'みゃ':'mya', 'みゅ':'myu', 'みょ':'myo',
  'りゃ':'rya', 'りゅ':'ryu', 'りょ':'ryo',
  'ぎゃ':'gya', 'ぎゅ':'gyu', 'ぎょ':'gyo',
  'じゃ':'ja', 'じゅ':'ju', 'じょ':'jo',
  'びゃ':'bya', 'びゅ':'byu', 'びょ':'byo',
  'ぴゃ':'pya', 'ぴゅ':'pyu', 'ぴょ':'pyo'
};

function toRomaji(hiragana: string): string {
  if (!hiragana) return '';
  let result = '';
  for(let i=0; i<hiragana.length; i++) {
    const twoChar = hiragana.substring(i, i+2);
    if (hiraganaToRomaji[twoChar]) {
      result += hiraganaToRomaji[twoChar];
      i++;
      continue;
    }
    const char = hiragana[i];
    if (char === 'っ') {
      const nextChar = hiragana[i+1];
      if (nextChar && hiraganaToRomaji[nextChar]) {
        result += hiraganaToRomaji[nextChar][0]; 
      }
      continue;
    }
    if (char === 'ー') {
      const lastChar = result[result.length - 1];
      if (lastChar) result += lastChar;
      continue;
    }
    result += hiraganaToRomaji[char] || char;
  }
  return result;
}

interface QuizProps {
  onViewChange: (view: View) => void;
}

export const Quiz: React.FC<QuizProps> = ({ onViewChange }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setQuestions(generateQuizQuestions(10));
  }, []);

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const question = questions[currentQuestionIndex];

  const handleCheck = () => {
    if (selectedOption) {
      setIsAnswered(true);
      if (selectedOption === question.correctAnswer) {
        setScore(score + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-primary/10 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy size={40} className="text-primary" />
        </div>
        <h2 className="text-3xl font-black mb-2">Quiz Complete!</h2>
        <p className="text-slate-500 mb-8">You scored {score} out of {questions.length}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">XP Gained</p>
            <p className="text-xl font-black text-primary">+{score * 10}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Accuracy</p>
            <p className="text-xl font-black text-primary">{Math.round((score / questions.length) * 100)}%</p>
          </div>
        </div>

        <button 
          onClick={() => onViewChange('dashboard')}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const progress = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div className="max-w-[800px] mx-auto w-full px-4 py-8 flex flex-col gap-6">
      <div className="flex flex-col gap-3 p-6 bg-white rounded-2xl shadow-sm border border-primary/5">
        <div className="flex gap-6 justify-between items-end">
          <div className="flex flex-col gap-1">
            <p className="text-primary text-xs font-bold uppercase tracking-widest">Vocabulary Quiz</p>
            <p className="text-slate-900 text-lg font-bold leading-normal">Question {currentQuestionIndex + 1} of {questions.length}</p>
          </div>
          <p className="text-slate-500 text-sm font-bold tabular-nums">{Math.round(progress)}% Complete</p>
        </div>
        <div className="h-3 rounded-full bg-primary/10 overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="flex flex-col items-center py-8">
        <div className="bg-white dark:bg-dark-surface w-full rounded-3xl p-12 flex flex-col items-center border border-primary/10 dark:border-dark-border shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary/5 dark:bg-primary/20"></div>
          <h1 className="text-slate-900 dark:text-white tracking-tight text-6xl md:text-7xl font-black leading-tight text-center pb-2">
            {question.word}
          </h1>
          {question.reading && (
            <p className="text-primary font-bold text-2xl mb-2">
              {question.reading} <span className="text-slate-400 font-medium text-lg ml-2">({toRomaji(question.reading)})</span>
            </p>
          )}
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium text-center max-w-xs mt-4">
            What is the English meaning of this word?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
        {question.options.map((option: string) => {
          const isSelected = selectedOption === option;
          const isCorrect = isAnswered && option === question.correctAnswer;
          const isWrong = isAnswered && isSelected && option !== question.correctAnswer;

          return (
            <button
              key={option}
              disabled={isAnswered}
              onClick={() => setSelectedOption(option)}
              className={`group relative flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-200 shadow-sm ${
                isCorrect ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-500/10' :
                isWrong ? 'border-primary bg-primary/5 ring-4 ring-primary/10' :
                isSelected ? 'border-primary bg-primary/5 ring-4 ring-primary/10' :
                'bg-white border-slate-100 hover:border-primary hover:shadow-md'
              }`}
            >
              <span className={`text-lg font-bold ${
                isCorrect ? 'text-emerald-700' :
                isWrong ? 'text-primary' :
                isSelected ? 'text-primary' :
                'text-slate-700'
              }`}>
                {option}
              </span>
              <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                isCorrect ? 'border-emerald-500 bg-emerald-500' :
                isWrong ? 'border-primary bg-primary' :
                isSelected ? 'border-primary' :
                'border-slate-200 group-hover:border-primary'
              }`}>
                {isCorrect && <Check size={14} className="text-white" />}
                {isWrong && <X size={14} className="text-white" />}
                {isSelected && !isAnswered && <div className="size-2.5 rounded-full bg-primary"></div>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pb-10">
        <button 
          onClick={() => onViewChange('dashboard')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-primary transition-colors"
        >
          <X size={20} />
          Quit Quiz
        </button>
        <button 
          onClick={isAnswered ? handleNext : handleCheck}
          disabled={!selectedOption}
          className={`px-10 py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center gap-3 ${
            !selectedOption ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' :
            'bg-primary text-white shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5'
          }`}
        >
          {isAnswered ? 'Next Question' : 'Check Answer'}
          {isAnswered ? <ArrowRight size={20} /> : <CheckCircle size={20} />}
        </button>
      </div>
    </div>
  );
};
