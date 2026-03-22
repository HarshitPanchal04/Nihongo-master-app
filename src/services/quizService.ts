import { VocabularyItem, QuizQuestion } from '../types';
import vocabData from '../data/vocabulary.json';

const vocabulary = vocabData as VocabularyItem[];

// Seeded PRNG so questions are consistent per day
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

const getDailySeed = () => {
  const d = new Date();
  // Format: YYYYMMDD (e.g. 20241022)
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
};

export const generateQuizQuestions = (count: number = 10): any[] => {
  const randomGen = mulberry32(getDailySeed());
  
  const shuffled = [...vocabulary].sort(() => 0.5 - randomGen());
  const selected = shuffled.slice(0, count);

  return selected.map((item, index) => {
    const correctAnswer = item.primary_meanings[0];
    
    // Generate distractors
    const otherMeanings = vocabulary
      .filter(v => v.id !== item.id)
      .map(v => v.primary_meanings[0])
      .filter((m, i, self) => self.indexOf(m) === i && m !== correctAnswer);
    
    const distractors = [...otherMeanings]
      .sort(() => 0.5 - randomGen())
      .slice(0, 3);
    
    const options = [correctAnswer, ...distractors].sort(() => 0.5 - randomGen());

    return {
      id: `q-${item.id}-${index}`,
      word: `${item.word}`,
      reading: item.reading,
      options,
      correctAnswer,
      type: 'vocabulary'
    };
  });
};
