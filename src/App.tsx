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
import { Bell, Menu, LogOut, Sun, Moon, Camera, LayoutDashboard, BookOpen, HelpCircle, Trophy, PenTool } from 'lucide-react';
import { auth, signInWithGoogle, logOut, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
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
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: '🔥 Daily Streak!', message: "You're on a 5-day streak. Keep it up!", time: '2 mins ago', read: false },
    { id: 2, title: '📚 New Lesson', message: 'JLPT N5 Grammar Lesson 4 is now available.', time: '1 hour ago', read: false },
    { id: 3, title: '🏆 Weekly Leaderboard', message: 'You ranked #3 this week! Great job.', time: '5 hours ago', read: false },
    { id: 4, title: '⏰ Practice Reminder', message: 'It\'s time for your daily writing practice.', time: '1 day ago', read: false },
    { id: 5, title: '⭐ Achievement Unlocked', message: 'Mastered 50 Hiragana characters!', time: '2 days ago', read: true },
  ]);
  const unreadCount = notifications.filter(n => !n.read).length;

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

  const handleUpdateUsername = async () => {
    if (newUsername.trim() && user) {
      setUser({
        ...user,
        displayName: newUsername.trim()
      } as User);
      setIsEditingUsername(false);
      
      try {
        await updateDoc(doc(db, 'users', user.uid), { displayName: newUsername.trim() });
      } catch (err) {
        console.error("Failed to update display name", err);
      }
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
              <div>
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight dark:text-white break-all">Konnichiwa, {user.displayName?.split(' ')[0]}! 👋</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm hidden sm:block">Welcome back to your N5 study session.</p>
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
              
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsProfileOpen(false); // Close profile if open
                  }}
                  className="p-2 rounded-full bg-white dark:bg-dark-surface border border-primary/10 dark:border-dark-border text-slate-600 dark:text-slate-300 relative hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full"></span>
                  )}
                </button>
                {isNotificationsOpen && (
                  <div className="absolute top-14 -right-10 md:right-0 w-80 bg-white dark:bg-dark-surface border border-primary/10 dark:border-dark-border rounded-xl shadow-xl flex flex-col z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-primary/5 dark:border-dark-border flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                      <h3 className="font-bold text-slate-800 dark:text-white text-sm">Notifications {unreadCount > 0 && `(${unreadCount})`}</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                          className="text-xs text-primary font-semibold hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">No notifications</div>
                      ) : (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`p-4 border-b border-primary/5 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notification.read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                            onClick={() => setNotifications(notifications.map(n => n.id === notification.id ? {...n, read: true} : n))}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h4 className={`text-sm font-semibold ${!notification.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                {notification.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{notification.time}</span>
                            </div>
                            <p className={`text-xs mt-1 ${!notification.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                              {notification.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsNotificationsOpen(false); // Close notifications if open
                  }}
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
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900 dark:text-white text-sm">{user.displayName}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 break-all">{user.email}</span>
                            </div>
                            <button onClick={() => { setIsEditingUsername(true); setNewUsername(user.displayName || ''); }} className="text-primary text-xs font-bold hover:underline">Edit</button>
                          </div>
                          
                          <label htmlFor="avatar-upload" className="flex items-center gap-1 text-slate-600 dark:text-slate-300 text-xs font-bold hover:text-primary dark:hover:text-primary transition-colors cursor-pointer w-fit mt-1 bg-slate-100 dark:bg-slate-800 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-primary/50">
                            <Camera size={14} /> Change Picture
                          </label>
                          <input 
                            type="file" 
                            id="avatar-upload" 
                            className="hidden" 
                            accept="image/*" 
                            capture="user"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = async () => {
                                  if (user) {
                                    const photoData = reader.result as string;
                                    setUser({ ...user, photoURL: photoData } as User);
                                    try {
                                      await updateDoc(doc(db, 'users', user.uid), { photoURL: photoData });
                                    } catch (err) {
                                      console.error("Failed to update photo", err);
                                    }
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }} 
                          />
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

          <div className="pb-20 md:pb-0">
            {renderView()}
          </div>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface border-t border-primary/10 flex justify-around items-center p-3 pb-safe-area-inset-bottom z-50">
          <button onClick={() => handleViewChange('dashboard')} className={`flex flex-col items-center gap-1 ${currentView === 'dashboard' ? 'text-primary' : 'text-slate-400'}`}>
            <LayoutDashboard size={20} className={currentView === 'dashboard' ? 'fill-primary/20' : ''} />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button onClick={() => handleViewChange('lessons')} className={`flex flex-col items-center gap-1 ${currentView === 'lessons' ? 'text-primary' : 'text-slate-400'}`}>
            <BookOpen size={20} className={currentView === 'lessons' ? 'fill-primary/20' : ''} />
            <span className="text-[10px] font-bold">Lessons</span>
          </button>
          <button onClick={() => handleViewChange('writing')} className={`flex flex-col items-center gap-1 ${currentView === 'writing' ? 'text-primary' : 'text-slate-400'}`}>
            <PenTool size={20} className={currentView === 'writing' ? 'fill-primary/20' : ''} />
            <span className="text-[10px] font-bold">Write</span>
          </button>
          <button onClick={() => handleViewChange('quiz')} className={`flex flex-col items-center gap-1 ${currentView === 'quiz' ? 'text-primary' : 'text-slate-400'}`}>
            <HelpCircle size={20} className={currentView === 'quiz' ? 'fill-primary/20' : ''} />
            <span className="text-[10px] font-bold">Quiz</span>
          </button>
          <button onClick={() => handleViewChange('leaderboard')} className={`flex flex-col items-center gap-1 ${currentView === 'leaderboard' ? 'text-primary' : 'text-slate-400'}`}>
            <Trophy size={20} className={currentView === 'leaderboard' ? 'fill-primary/20' : ''} />
            <span className="text-[10px] font-bold">Rank</span>
          </button>
        </nav>
      </div>
    </ErrorBoundary>
  );
}
