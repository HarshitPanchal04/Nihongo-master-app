import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../firebase';
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';

export interface UserProgress {
  xp: number;
  streak: number;
  lastActive: string | null;
  level: number;
  rank: string;
}

interface UserProgressContextType {
  progress: UserProgress;
  addXp: (amount: number) => Promise<void>;
}

const defaultProgress: UserProgress = {
  xp: 0,
  streak: 0,
  lastActive: null,
  level: 1,
  rank: 'Newcomer'
};

const UserProgressContext = createContext<UserProgressContextType>({
  progress: defaultProgress,
  addXp: async () => {},
});

export const UserProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  useEffect(() => {
    let unsubscribe = () => {};

    const authUnsub = auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        unsubscribe = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.progress) {
              setProgress(data.progress);
            } else {
              setDoc(userRef, { progress: defaultProgress }, { merge: true });
              setProgress(defaultProgress);
            }
          }
        });
      } else {
        setProgress(defaultProgress); // logged out
      }
    });

    return () => {
      authUnsub();
      unsubscribe();
    };
  }, []);

  const addXp = async (amount: number) => {
    const user = auth.currentUser;
    if (!user) return;
    
    // Calculate new stats
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    let newStreak = progress.streak;
    let rank = progress.rank;
    const newXp = progress.xp + amount;
    const newLevel = Math.floor(newXp / 100) + 1; // 100 XP per level
    
    // Update Rank
    if (newLevel >= 20) rank = 'Daimyo';
    else if (newLevel >= 15) rank = 'Samurai';
    else if (newLevel >= 10) rank = 'Ashigaru';
    else if (newLevel >= 5) rank = 'Ronin';
    else rank = 'Newcomer';

    // Update Streak
    if (progress.lastActive !== today) {
        const yesterdayDate = new Date();
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterday = yesterdayDate.toISOString().split('T')[0];
        
        if (progress.lastActive === yesterday) {
            newStreak += 1;
        } else if (progress.lastActive !== today) {
            newStreak = 1; // Reset streak
        }
    }

    const updatedProgress: UserProgress = {
      xp: newXp,
      streak: newStreak,
      lastActive: today,
      level: newLevel,
      rank
    };

    // Save to local state (optimistic)
    setProgress(updatedProgress);

    // Save to Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      progress: updatedProgress
    });
  };

  return (
    <UserProgressContext.Provider value={{ progress, addXp }}>
      {children}
    </UserProgressContext.Provider>
  );
};

export const useUserProgress = () => useContext(UserProgressContext);
