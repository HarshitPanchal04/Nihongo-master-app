import { VocabularyItem, QuizQuestion } from '../types';
import vocabData from '../data/vocabulary.json';

const vocabulary = vocabData as VocabularyItem[];

export const generateQuizQuestions = (count: number = 10): any[] => {
  const shuffled = [...vocabulary].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  return selected.map((item, index) => {
    const correctAnswer = item.primary_meanings[0];
    
    // Generate distractors
    const otherMeanings = vocabulary
      .filter(v => v.id !== item.id)
      .map(v => v.primary_meanings[0])
      .filter((m, i, self) => self.indexOf(m) === i && m !== correctAnswer);
    
    const distractors = [...otherMeanings]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const options = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());

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
