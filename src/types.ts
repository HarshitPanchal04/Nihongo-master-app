export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  rank: string;
  xp: number;
  streak: number;
}

export interface DailyTarget {
  label: string;
  current: number;
  total: number;
  icon: string;
}

export interface WordOfTheDay {
  kanji: string;
  romaji: string;
  meaning: string;
  example: string;
  exampleRomaji: string;
}

export interface QuizQuestion {
  id: string;
  word: string;
  options: string[];
  correctAnswer: string;
  type: 'vocabulary' | 'kanji' | 'grammar';
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  level: number;
  title: string;
  xp: number;
  isCurrentUser?: boolean;
}

export interface VocabularyItem {
  id: number;
  word: string;
  reading: string;
  level: string;
  type: string;
  primary_meanings: string[];
  sentence_ja: string;
  sentence_en: string;
  kanji_frequency_difficulty: number | null;
  kanji_usage_difficulty: number | null;
  kanji_in_n5_list: boolean;
}

export type View = 'login' | 'dashboard' | 'lessons' | 'quiz' | 'leaderboard' | 'writing' | 'listening';
