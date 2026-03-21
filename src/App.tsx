import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Quiz } from './components/Quiz';
import { Leaderboard } from './components/Leaderboard';
import { Writing } from './components/Writing';
import { Listening } from './components/Listening';
import { Login } from './components/Login';
import { Lessons } from './components/Lessons';
import { View } from './types';
import { Bell, Menu, LogOut, Sun, Moon } from 'lucide-react';
import { auth, signInWithGoogle, logOut, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Cursor } from './components/Cursor';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  useEffect(() => {
    // Check local storage for theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync user to Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            createdAt: serverTimestamp(),
            role: 'user'
          });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Firebase login failed, falling back to mock user:', error);
      // Create a mock user so the preview still works
      setUser({
        uid: 'mock-user-123',
        displayName: 'Guest Learner',
        email: 'guest@example.com',
        photoURL: 'https://ui-avatars.com/api/?name=Guest+Learner&background=bd002c&color=fff'
      } as User);
      setCurrentView('dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      if (auth.currentUser) {
        await logOut();
      }
      setUser(null);
      setCurrentView('dashboard');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleUpdateUsername = () => {
    if (newUsername.trim() && user) {
      setUser({
        ...user,
        displayName: newUsername.trim()
      } as User);
      setIsEditingUsername(false);
      setNewUsername('');
    }
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Cursor />
        <Login onLogin={handleLogin} />
      </>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={handleViewChange} />;
      case 'lessons':
        return <Lessons />;
      case 'quiz':
        return <Quiz onViewChange={handleViewChange} />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'writing':
        return <Writing />;
      case 'listening':
        return <Listening />;
      default:
        return <Dashboard onViewChange={handleViewChange} />;
    }
  };

  return (
    <ErrorBoundary>
      <Cursor />
      <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-500">
        <Sidebar currentView={currentView} onViewChange={handleViewChange} />
        
        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-primary/5 dark:border-dark-border">
            <div className="flex items-center gap-4">
              <div className="md:hidden text-primary">
                <Menu size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight dark:text-white">Konnichiwa, {user.displayName?.split(' ')[0]}! 👋</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Welcome back to your N5 study session.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white dark:bg-dark-surface border border-primary/10 dark:border-dark-border text-slate-600 dark:text-slate-300 relative hover:text-primary dark:hover:text-primary transition-colors"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button className="p-2 rounded-full bg-white dark:bg-dark-surface border border-primary/10 dark:border-dark-border text-slate-600 dark:text-slate-300 relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full"></span>
              </button>
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold border-2 border-white dark:border-dark-surface shadow-sm overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer"
                >
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
                {isProfileOpen && (
                  <div className="absolute top-14 right-0 w-64 bg-white dark:bg-dark-surface border border-primary/10 dark:border-dark-border rounded-xl shadow-xl flex flex-col p-4 z-50">
                    <div className="flex flex-col border-b border-primary/5 dark:border-dark-border pb-3 mb-3">
                      {isEditingUsername ? (
                        <div className="flex flex-col gap-2">
                          <input 
                            type="text" 
                            className="w-full border border-primary/20 dark:border-dark-border rounded-lg px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdateUsername()}
                            placeholder="New Username"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button onClick={handleUpdateUsername} className="flex-1 bg-primary text-white text-xs font-bold py-2 rounded-lg">Save</button>
                            <button onClick={() => setIsEditingUsername(false)} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white text-xs font-bold py-2 rounded-lg">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 dark:text-white text-sm">{user.displayName}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 break-all">{user.email}</span>
                          </div>
                          <button onClick={() => { setIsEditingUsername(true); setNewUsername(user.displayName || ''); }} className="text-primary text-xs font-bold hover:underline">Edit</button>
                        </div>
                      )}
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition-colors w-full text-left text-sm font-bold">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {renderView()}
        </main>
      </div>
    </ErrorBoundary>
  );
}
