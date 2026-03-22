import React from 'react';
import { Languages, Mail, Lock, Apple } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between border-b border-primary/10 px-6 md:px-40 py-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="size-8 text-primary">
            <Languages size={32} />
          </div>
          <h2 className="text-slate-900 text-xl font-bold tracking-tight">Nihongo Master</h2>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 bg-background-light">
        <div className="w-full max-w-[480px] bg-white rounded-xl shadow-sm border border-primary/5 p-8 flex flex-col gap-8">
          <div className="flex flex-col gap-2 items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-2 overflow-hidden">
              <img 
                src="https://picsum.photos/seed/japan/200/200" 
                alt="Japan" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500">Continue your path to fluency</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-background-light border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-400" 
                  placeholder="you@example.com" 
                  type="email"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <a className="text-xs font-medium text-primary hover:underline" href="#">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-background-light border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-400" 
                  placeholder="••••••••" 
                  type="password"
                  required
                />
              </div>
            </div>
            <button 
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg transition-colors shadow-lg shadow-primary/20 mt-2" 
              type="submit"
            >
              Login to Nihongo Master
            </button>
          </form>



          <div className="text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account? 
              <a className="text-primary font-bold hover:underline ml-1" href="#">Sign Up</a>
            </p>
          </div>
        </div>
      </main>

      <footer className="px-6 md:px-40 py-8 text-center border-t border-slate-200">
        <p className="text-xs text-slate-400 uppercase tracking-widest">© 2024 Nihongo Master • Master Japanese with Ease</p>
      </footer>
    </div>
  );
};
