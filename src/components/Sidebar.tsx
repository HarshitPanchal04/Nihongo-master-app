import React from 'react';
import { View } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  PenTool, 
  HelpCircle, 
  Trophy, 
  Languages 
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'writing', label: 'Writing', icon: PenTool },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-primary/10 p-6 gap-8 h-screen sticky top-0 shrink-0">
      <button 
        onClick={() => onViewChange('dashboard')}
        className="flex items-center gap-3 text-primary text-left hover:opacity-80 transition-opacity cursor-pointer cursor-none-if-desktop"
      >
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shrink-0">
          <Languages size={24} />
        </div>
        <h1 className="text-xl font-black tracking-tight leading-tight">Nihongo<br/>Master</h1>
      </button>
      
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as View)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
              currentView === item.id
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-slate-600 hover:bg-primary/5'
            }`}
          >
            <item.icon size={22} className={currentView === item.id ? 'text-white' : 'text-primary'} />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto bg-primary/5 p-4 rounded-xl border border-primary/10">
        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Current Goal</p>
        <p className="text-sm font-semibold mb-3">JLPT N5 Proficiency</p>
        <div className="w-full bg-primary/20 h-2 rounded-full overflow-hidden">
          <div className="bg-primary h-full w-[45%] transition-all duration-1000"></div>
        </div>
        <p className="text-[10px] mt-2 text-slate-500">45% Completed</p>
      </div>
    </aside>
  );
};
