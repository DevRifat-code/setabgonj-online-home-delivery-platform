import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lock, Mail, ArrowRight, Github, Settings, LogOut, RefreshCw } from 'lucide-react';
import AdminPanel from './AdminPanel';
import UserDashboard from './UserDashboard';
import { useLanguage } from '../lib/LanguageContext';
import { getSupabase } from '../lib/supabase';

type AuthState = 'logged-out' | 'user-dashboard' | 'admin-dashboard';

export default function Account() {
  const [isLogin, setIsLogin] = useState(true);
  const [authState, setAuthState] = useState<AuthState>('logged-out');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminView, setAdminView] = useState<'admin' | 'user'>('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    try {
      const client = getSupabase();
      
      // Get the existing active session on mount
      client.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setEmail(session.user.email || '');
          setAuthState('user-dashboard');
        }
      });

      // Handle session state changes automatically
      const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setEmail(session.user.email || '');
          setAuthState('user-dashboard');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (e) {
      console.warn('Supabase auth state listener initialization skipped:', e);
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const client = getSupabase();
      
      // Attempt to check credentials dynamically in "admins" table
      const { data, error: dbError } = await client
        .from('admins')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .eq('password', password);

      if (dbError) {
        console.warn('Database admin query failed:', dbError);
        // Fallback checks for administrative access if DB is not configured/synced yet
        if (
          (email.trim().toLowerCase() === 'mdrifathossainpersonal@gmail.com' || email.trim().toLowerCase() === 'admin@brishtys.com') && 
          password === 'Admin@143'
        ) {
          setAuthState('admin-dashboard');
          return;
        }
        throw dbError;
      }

      if (data && data.length > 0) {
        setAuthState('admin-dashboard');
      } else {
        // If not matching an admin row, check master fallback for admin setup recovery
        if (
          (email.trim().toLowerCase() === 'mdrifathossainpersonal@gmail.com' || email.trim().toLowerCase() === 'admin@brishtys.com') && 
          password === 'Admin@143'
        ) {
          setAuthState('admin-dashboard');
        } else {
          setAuthState('user-dashboard');
        }
      }
    } catch (err: any) {
      console.error('Database Admin check failed:', err);
      
      // Master local bypass fallback for unconfigured/error-prone DB setups
      if (
        (email.trim().toLowerCase() === 'mdrifathossainpersonal@gmail.com' || email.trim().toLowerCase() === 'admin@brishtys.com') && 
        password === 'Admin@143'
      ) {
        setAuthState('admin-dashboard');
        return;
      }

      setError(
        language === 'bn' 
          ? `লগইন ব্যর্থ হয়েছে: ${err.message || err.code || 'কানেকশন সমস্যা'}। অনুগ্রহ করে ডাটাবেজ টেবিল বা ক্রেডেনশিয়াল পরীক্ষা করুন।` 
          : `Database authentication check failed: ${err.message || err.code || 'Connection issue'}. Please confirm credentials exist or run database setup.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const client = getSupabase();
      await client.auth.signOut();
    } catch (e) {
      console.warn('Supabase sign out error:', e);
    }
    setAuthState('logged-out');
    setEmail('');
    setPassword('');
    setError(null);
  };



  if (authState === 'admin-dashboard') {
    return (
      <section id="account" className="py-32 px-6 bg-warm-beige/30 min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-deep text-white rounded-full flex items-center justify-center">
                <Settings size={32} />
              </div>
              <div>
                <h2 className="font-serif text-4xl text-emerald-deep">Admin Dashboard</h2>
                <div className="flex gap-4 mt-2">
                  <button 
                    onClick={() => setAdminView('admin')}
                    className={`text-xs uppercase tracking-widest font-bold transition-colors ${adminView === 'admin' ? 'text-rose-gold' : 'text-emerald-deep/40 hover:text-emerald-deep'}`}
                  >
                    Business Control
                  </button>
                  <button 
                    onClick={() => setAdminView('user')}
                    className={`text-xs uppercase tracking-widest font-bold transition-colors ${adminView === 'user' ? 'text-rose-gold' : 'text-emerald-deep/40 hover:text-emerald-deep'}`}
                  >
                    User View
                  </button>
                </div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 border border-emerald-deep/10 rounded-full text-emerald-deep font-medium hover:bg-emerald-deep/5 transition-colors"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>

          <div className="glass p-8 md:p-12 rounded-[3rem] shadow-2xl">
            {adminView === 'admin' ? (
              <AdminPanel />
            ) : (
              <UserDashboard email={email} onLogout={handleLogout} />
            )}
          </div>
        </motion.div>
      </section>
    );
  }

  if (authState === 'user-dashboard') {
    return (
      <section id="account" className="py-32 px-6 bg-warm-beige/30 min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <UserDashboard email={email} onLogout={handleLogout} />
        </motion.div>
      </section>
    );
  }

  return (
    <section id="account" className="py-32 px-6 bg-warm-beige/30 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-emerald-deep/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="text-emerald-deep" size={32} />
          </div>
          <h2 className="font-serif text-5xl text-emerald-deep mb-4">
            {isLogin 
              ? (language === 'bn' ? 'স্বাগতম' : 'Welcome Back') 
              : (language === 'bn' ? 'যুক্ত হোন' : 'Join the Club')}
          </h2>
          <p className="text-emerald-deep/60 font-light">
            {isLogin 
              ? (language === 'bn' ? 'আপনার অর্ডার ও পছন্দ নিয়ন্ত্রণ ও ট্র্যাক করুন।' : 'Manage your orders and preferences.') 
              : (language === 'bn' ? 'আপনার নিজস্ব মেহেদি ডিজাইন ট্র্যাক করতে নিবন্ধন করুন।' : 'Register to track your custom henna designs.')}
          </p>
          {isLogin && (
            <p className="mt-2 text-[10px] text-emerald-deep/30 uppercase tracking-widest animate-pulse">
              {language === 'bn' ? 'ডাটাবেজে নিবন্ধিত এডমিন অ্যাকাউন্ট দিয়ে লগইন করুন।' : 'Secure database authentication for administrative profiles.'}
            </p>
          )}
        </div>

        <motion.div 
          layout
          className="glass p-12 rounded-[3rem] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8">
            <div className="w-24 h-24 bg-rose-gold/10 rounded-full blur-2xl" />
          </div>

          <form onSubmit={handleAuth} className="space-y-6 relative z-10">
            {error && (
              <div className="p-4 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-100 italic">
                {error}
              </div>
            )}
            {!isLogin && (
              <div className="space-y-1">
                <label htmlFor="reg-name" className="sr-only">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-deep/40" size={18} aria-hidden="true" />
                  <input 
                    id="reg-name"
                    type="text" 
                    placeholder={language === 'bn' ? 'সম্পূর্ণ নাম' : 'Full Name'}
                    className="w-full pl-12 pr-6 py-4 bg-white/50 border border-emerald-deep/10 rounded-2xl focus:border-rose-gold outline-none transition-all focus:ring-2 focus:ring-rose-gold/20"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="login-email" className="sr-only">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-deep/40" size={18} aria-hidden="true" />
                <input 
                  id="login-email"
                  required
                  type="email" 
                  placeholder={language === 'bn' ? 'ইমেইল এড্রেস' : 'Email Address'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white/50 border border-emerald-deep/10 rounded-2xl focus:border-rose-gold outline-none transition-all focus:ring-2 focus:ring-rose-gold/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="login-password" className="sr-only">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-deep/40" size={18} aria-hidden="true" />
                <input 
                  id="login-password"
                  required
                  type="password" 
                  placeholder={language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white/50 border border-emerald-deep/10 rounded-2xl focus:border-rose-gold outline-none transition-all focus:ring-2 focus:ring-rose-gold/20"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-emerald-deep text-white rounded-full font-bold hover:bg-rose-gold transition-all duration-500 flex items-center justify-center gap-2 shadow-xl shadow-emerald-deep/10 focus:outline-none focus:ring-4 focus:ring-rose-gold/50 cursor-pointer disabled:opacity-50 text-sm"
            >
              {loading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : isLogin ? (
                language === 'bn' ? 'লগ ইন করুন' : 'Sign In'
              ) : (
                language === 'bn' ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account'
              )}
              {!loading && <ArrowRight size={18} />}
            </button>


          </form>

          <p className="mt-8 text-center text-emerald-deep/60">
            {isLogin 
              ? (language === 'bn' ? 'কোনো অ্যাকাউন্ট নেই? ' : "Don't have an account? ")
              : (language === 'bn' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? ' : "Already have an account? ")}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-rose-gold font-bold hover:underline"
            >
              {isLogin ? (language === 'bn' ? 'নিবন্ধন করুন' : 'Sign Up') : (language === 'bn' ? 'লগ ইন করুন' : 'Log In')}
            </button>
          </p>
        </motion.div>
      </div>


    </section>
  );
}

