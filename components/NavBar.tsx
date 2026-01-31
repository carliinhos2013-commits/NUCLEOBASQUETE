import React from 'react';
import { Home, Trophy, BookOpen, MapPin, UserCircle } from 'lucide-react';
import { View } from '../types';

interface NavBarProps {
  currentView: View;
  setView: (view: View) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentView, setView }) => {
  const navItems = [
    { view: View.LOBBY, icon: Home, label: 'Lobby' },
    { view: View.RANKING, icon: Trophy, label: 'Ranking' },
    { view: View.EDUCATION, icon: BookOpen, label: 'Aprender' },
    { view: View.LOCATIONS, icon: MapPin, label: 'Locais' },
    { view: View.PROFILE, icon: UserCircle, label: 'Perfil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-neutral-900 border-t border-neutral-800 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
              currentView === item.view ? 'text-orange-500' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <item.icon size={24} />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavBar;
