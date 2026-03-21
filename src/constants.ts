import { DailyTarget, WordOfTheDay, QuizQuestion, LeaderboardEntry } from './types';

export const MOCK_USER = {
  id: 'u1',
  name: 'Alex',
  email: 'alex@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  level: 12,
  rank: 'Ashigaru',
  xp: 1420,
  streak: 12,
};

export const DAILY_TARGETS: DailyTarget[] = [
  { label: 'Kanji Mastered', current: 5, total: 10, icon: 'draw' },
  { label: 'Vocabulary Words', current: 20, total: 30, icon: 'forum' },
  { label: 'Grammar Points', current: 2, total: 5, icon: 'rule' },
];

export const WORD_OF_THE_DAY: WordOfTheDay = {
  kanji: '食べ物',
  romaji: 'Tabemono',
  meaning: 'Food',
  example: '日本の食べ物はとても美味しいです。',
  exampleRomaji: 'Nihon no tabemono wa totemo oishii desu.',
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    word: 'たべる (Taberu)',
    options: ['To Sleep', 'To Eat', 'To Drink', 'To Walk'],
    correctAnswer: 'To Eat',
    type: 'vocabulary',
  },
  {
    id: 'q2',
    word: 'みず (Mizu)',
    options: ['Fire', 'Earth', 'Water', 'Wind'],
    correctAnswer: 'Water',
    type: 'vocabulary',
  },
  {
    id: 'q3',
    word: 'ねこ (Neko)',
    options: ['Dog', 'Cat', 'Bird', 'Fish'],
    correctAnswer: 'Cat',
    type: 'vocabulary',
  },
  {
    id: 'q4',
    word: 'これ (Kore)',
    options: ['That', 'There', 'This', 'Who'],
    correctAnswer: 'This',
    type: 'vocabulary',
  },
  {
    id: 'q5',
    word: 'せんせい (Sensei)',
    options: ['Student', 'Doctor', 'Teacher', 'Engineer'],
    correctAnswer: 'Teacher',
    type: 'vocabulary',
  },
];

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Haruto',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Haruto',
    level: 18,
    title: 'Daimyo',
    xp: 2450,
  },
  {
    rank: 2,
    name: 'Yuki',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki',
    level: 16,
    title: 'Samurai',
    xp: 2100,
  },
  {
    rank: 3,
    name: 'Aoi',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aoi',
    level: 15,
    title: 'Ronin',
    xp: 1950,
  },
  {
    rank: 4,
    name: 'Kenji Sato',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kenji',
    level: 15,
    title: 'Samurai',
    xp: 1820,
  },
  {
    rank: 5,
    name: 'Sakura Tanaka',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sakura',
    level: 14,
    title: 'Ronin',
    xp: 1750,
  },
  {
    rank: 12,
    name: 'Alex',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    level: 12,
    title: 'Ashigaru',
    xp: 1420,
    isCurrentUser: true,
  },
  {
    rank: 13,
    name: 'Hiroki Ito',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hiroki',
    level: 11,
    title: 'Newcomer',
    xp: 1380,
  },
];
