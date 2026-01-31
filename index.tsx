
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { View, User, ThemeType } from './types';
import { supabase } from './services/supabase';
import Login from './components/Login';
import Signup from './components/Signup';
import Lobby from './components/Lobby';
import TrainingSession from './components/TrainingSession';
import Ranking from './components/Ranking';
import Education from './components/Education';
import Tutor from './components/Tutor';
import Locations from './components/Locations';
import Profile from './components/Profile';
import NavBar from './components/NavBar';
import Settings from './components/Settings';
import Community from './components/Community';
import Tryouts from './components/Tryouts';
import VisionBoard from './components/VisionBoard';
import MatchPlay from './components/MatchPlay';
import ThemeSwitcher from './components/ThemeSwitcher';
import AvatarCreator from './components/AvatarCreator';

const App = () => {
  const [currentView, setCurrentView] = useState<View>(View.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<ThemeType>('dark');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setCurrentView(View.LOGIN);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleTestLogin = () => {
    // RESET: Simulação de Primeiro Uso / Usuário Novo
    setUser({
      id: 'new-user-test-id',
      name: 'Visitante',
      age: 0,
      city: 'Localização Desconhecida',
      points: 0,
      streak: 0,
      totalWorkouts: 0,
      level: 'Novato',
      role: 'PLAYER',
      goal: 'Iniciar Jornada',
      workoutHistory: [],
      attributes: {
        ninjutsu: 10,
        taijutsu: 10,
        genjutsu: 10,
        dojutsu: 10
      },
      avatarSpecs: undefined // Força a criação do avatar
    });
    setCurrentView(View.LOBBY);
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          age: data.age,
          city: data.city,
          points: data.points || 0,
          streak: data.streak || 0,
          total_workouts: data.total_workouts || 0,
          level: data.level || 'Novato',
          role: data.role || 'PLAYER',
          goal: data.goal || 'Evoluir no Basquete',
          avatar: data.avatar,
          workoutHistory: [],
          attributes: data.attributes || {
            ninjutsu: 50,
            taijutsu: 50,
            genjutsu: 50,
            dojutsu: 50
          },
          avatarSpecs: data.avatar_specs || undefined // Carrega as specs salvas
        });
        
        if (currentView === View.LOGIN || currentView === View.SIGNUP) {
          setCurrentView(View.LOBBY);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center theme-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 theme-primary-text"></div>
      </div>
    );
  }

  const renderView = () => {
    if (!user) {
      if (currentView === View.SIGNUP) return <Signup onComplete={() => setCurrentView(View.LOBBY)} goBack={() => setCurrentView(View.LOGIN)} />;
      return <Login setView={setCurrentView} onTestLogin={handleTestLogin} />;
    }

    switch (currentView) {
      case View.LOBBY: return <Lobby user={user} setView={setCurrentView} />;
      case View.TRAINING: return <TrainingSession user={user} goBack={() => setCurrentView(View.LOBBY)} onComplete={() => fetchUserProfile(user.id)} />;
      case View.RANKING: return <Ranking />;
      case View.EDUCATION: return <Education />;
      case View.TUTOR: return <Tutor />;
      case View.LOCATIONS: return <Locations />;
      case View.TRYOUTS: return <Tryouts goBack={() => setCurrentView(View.LOBBY)} />;
      case View.VISION_BOARD: return <VisionBoard goBack={() => setCurrentView(View.LOBBY)} />;
      case View.MATCH_PLAY: return <MatchPlay goBack={() => setCurrentView(View.LOBBY)} user={user} />;
      case View.PROFILE: return <Profile user={user} onLogout={() => setUser(null)} setView={setCurrentView} />;
      case View.SETTINGS: return <Settings user={user} onUpdate={() => fetchUserProfile(user.id)} goBack={() => setCurrentView(View.PROFILE)} />;
      case View.COMMUNITY: return <Community goBack={() => setCurrentView(View.LOBBY)} />;
      case View.AVATAR_CREATOR: return <AvatarCreator user={user} goBack={() => setCurrentView(View.LOBBY)} onUpdate={() => fetchUserProfile(user.id)} />;
      default: return <Lobby user={user} setView={setCurrentView} />;
    }
  };

  return (
    <div className="h-screen flex flex-col theme-bg theme-text overflow-hidden">
      <main className="flex-1 overflow-hidden relative">
        {renderView()}
        {user && currentView !== View.TRAINING && currentView !== View.AVATAR_CREATOR && (
          <ThemeSwitcher current={theme} onChange={setTheme} />
        )}
      </main>
      {user && currentView !== View.TRAINING && currentView !== View.AVATAR_CREATOR && (
        <NavBar currentView={currentView} setView={setCurrentView} />
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
