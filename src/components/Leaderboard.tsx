import React, { useState, useEffect } from 'react';
import { Award, TrendingUp } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { db, auth } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'all-time' | 'friends'>('all-time');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('progress.xp', 'desc'), limit(100));
        const snap = await getDocs(q);
        const data = snap.docs.map((d, index) => {
          const ud = d.data();
          return {
            rank: index + 1,
            name: ud.displayName?.split(' ')[0] || 'Unknown User',
            avatar: ud.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${d.id}`,
            level: ud.progress?.level || 1,
            title: ud.progress?.rank || 'Newcomer',
            xp: ud.progress?.xp || 0,
            isCurrentUser: d.id === auth.currentUser?.uid
          };
        });
        setLeaderboardData(data);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const top3 = leaderboardData.slice(0, 3);
  const others = leaderboardData.slice(3);

  if (loading) {
     return <div className="p-12 text-center text-slate-500 font-bold animate-pulse">Loading Rankings...</div>;
  }

  if (leaderboardData.length === 0) {
      return <div className="p-12 text-center text-slate-500 font-bold">No data available yet!</div>;
  }

  return (
    <div className="max-w-[960px] mx-auto w-full px-4 py-6 flex flex-col gap-6">
      <div className="flex bg-slate-100 p-1 rounded-2xl w-full border border-slate-200">
        {(['weekly', 'all-time', 'friends'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
              activeTab === tab 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-slate-500 hover:text-primary'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4 items-end pt-12 pb-6 relative">
        {/* 2nd Place */}
        {top3[1] && (
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div 
              className="size-16 md:size-20 rounded-full border-4 border-slate-300 overflow-hidden bg-cover bg-center shadow-lg"
              style={{ backgroundImage: `url(${top3[1].avatar})` }}
            ></div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-300 text-slate-800 text-xs font-black size-7 flex items-center justify-center rounded-full border-2 border-white">2</div>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold truncate w-24 text-slate-800">{top3[1].name}</p>
            <p className="text-xs text-primary font-black">{top3[1].xp.toLocaleString()} XP</p>
          </div>
        </div>
        )}

        {/* 1st Place */}
        {top3[0] && (
        <div className="flex flex-col items-center gap-4 -translate-y-6">
          <div className="relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce">
              <Award size={40} className="text-yellow-500 fill-yellow-500" />
            </div>
            <div 
              className="size-24 md:size-32 rounded-full border-4 border-yellow-500 overflow-hidden bg-cover bg-center shadow-xl ring-8 ring-yellow-500/10"
              style={{ backgroundImage: `url(${top3[0].avatar})` }}
            ></div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-white text-sm font-black size-10 flex items-center justify-center rounded-full border-4 border-white shadow-md">1</div>
          </div>
          <div className="text-center">
            <p className="text-lg font-black truncate w-28 text-slate-900">{top3[0].name}</p>
            <p className="text-sm text-primary font-black">{top3[0].xp.toLocaleString()} XP</p>
          </div>
        </div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div 
              className="size-16 md:size-20 rounded-full border-4 border-orange-400 overflow-hidden bg-cover bg-center shadow-lg"
              style={{ backgroundImage: `url(${top3[2].avatar})` }}
            ></div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-orange-400 text-white text-xs font-black size-7 flex items-center justify-center rounded-full border-2 border-white">3</div>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold truncate w-24 text-slate-800">{top3[2].name}</p>
            <p className="text-xs text-primary font-black">{top3[2].xp.toLocaleString()} XP</p>
          </div>
        </div>
        )}
      </div>

      {/* Rankings List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-slate-900 text-xl font-black tracking-tight">Rankings</h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top 100</span>
        </div>
        <div className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
          {others.map((entry) => (
            <div 
              key={entry.rank}
              className={`flex items-center gap-4 p-4 transition-all border-b border-slate-50 last:border-0 ${
                entry.isCurrentUser ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-slate-50'
              }`}
            >
              <span className={`font-black w-6 text-center ${entry.isCurrentUser ? 'text-primary' : 'text-slate-300'}`}>
                {entry.rank}
              </span>
              <div 
                className={`size-12 rounded-2xl bg-cover bg-center shadow-sm ${entry.isCurrentUser ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                style={{ backgroundImage: `url(${entry.avatar})` }}
              ></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-bold ${entry.isCurrentUser ? 'text-primary' : 'text-slate-800'}`}>
                    {entry.isCurrentUser ? `You (${entry.name})` : entry.name}
                  </p>
                  {entry.isCurrentUser && (
                    <span className="px-1.5 py-0.5 rounded-full bg-primary text-[8px] text-white font-black uppercase tracking-tighter">Top 5%</span>
                  )}
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Level {entry.level} • {entry.title}</p>
              </div>
              <div className="text-right">
                <p className={`text-base font-black ${entry.isCurrentUser ? 'text-primary' : 'text-slate-900'}`}>
                  {entry.xp.toLocaleString()}
                </p>
                <p className={`text-[10px] uppercase tracking-widest font-black ${entry.isCurrentUser ? 'text-primary' : 'text-slate-300'}`}>XP</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-4 p-8 bg-slate-900 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
          <TrendingUp size={96} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="font-black text-2xl leading-tight">Keep the streak alive!</h4>
            <p className="text-slate-400 font-medium mt-2">Review 20 more Kanji to climb the ranks.</p>
          </div>
          <button className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-primary/30 active:scale-95">
            Start Review
          </button>
        </div>
      </div>
    </div>
  );
};
