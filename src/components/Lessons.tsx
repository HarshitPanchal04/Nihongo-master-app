import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, PlayCircle, Lock } from 'lucide-react';
import { LessonPlayer } from './LessonPlayer';

export const Lessons = () => {
  const [activeLesson, setActiveLesson] = useState<{ id: number; title: string } | null>(null);

  const lessons = [
    { id: 1, title: 'Hiragana Basics', level: 'N5', duration: '15 min', progress: 100, status: 'completed' },
    { id: 2, title: 'Katakana Introduction', level: 'N5', duration: '20 min', progress: 100, status: 'completed' },
    { id: 3, title: 'Basic Greetings', level: 'N5', duration: '10 min', progress: 0, status: 'in-progress' },
    { id: 4, title: 'Food & Dining', level: 'N5', duration: '15 min', progress: 0, status: 'in-progress' },
    { id: 5, title: 'Asking Questions', level: 'N5', duration: '10 min', progress: 0, status: 'in-progress' },
    { id: 6, title: 'Asking for Help', level: 'N5', duration: '10 min', progress: 0, status: 'in-progress' },
  ];

  if (activeLesson) {
    return <LessonPlayer lessonId={activeLesson.id} lessonTitle={activeLesson.title} onClose={() => setActiveLesson(null)} />;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">Lessons</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Master Japanese step-by-step with our structured curriculum.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-2xl border ${
              lesson.status === 'locked' 
                ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-75' 
                : 'bg-white dark:bg-dark-surface border-primary/10 dark:border-dark-border shadow-sm hover:shadow-md transition-shadow'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${
                lesson.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                lesson.status === 'in-progress' ? 'bg-primary/10 dark:bg-primary/20 text-primary' :
                'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}>
                {lesson.status === 'completed' ? <CheckCircle size={24} /> : 
                 lesson.status === 'in-progress' ? <PlayCircle size={24} /> : <Lock size={24} />}
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">
                {lesson.level} • {lesson.duration}
              </span>
            </div>
            
            <h3 className="text-xl font-bold mb-2 dark:text-white">{lesson.title}</h3>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500 dark:text-slate-400">Progress</span>
                <span className="font-bold dark:text-slate-300">{lesson.progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${lesson.progress}%` }}
                />
              </div>
            </div>

            <button 
              disabled={lesson.status === 'locked'}
              onClick={() => setActiveLesson({ id: lesson.id, title: lesson.title })}
              className={`w-full mt-6 py-3 rounded-xl font-bold transition-colors ${
                lesson.status === 'locked'
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              {lesson.status === 'completed' ? 'Review Lesson' : 
               lesson.status === 'in-progress' ? 'Continue' : 'Unlock Lesson'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
