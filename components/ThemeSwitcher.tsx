
import React from 'react';
import { ThemeType } from '../types';

interface ThemeSwitcherProps {
  current: ThemeType;
  onChange: (theme: ThemeType) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ current, onChange }) => {
  const nextTheme = () => {
    if (current === 'dark') onChange('orange');
    else if (current === 'orange') onChange('white');
    else onChange('dark');
  };

  return (
    <button 
      onClick={nextTheme}
      title="Mudar Tema"
      className="fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-2xl z-50 flex items-center justify-center transition-all active:scale-90 theme-surface border-4 theme-border hover:border-orange-500 group overflow-hidden"
    >
      <div className="absolute inset-0 bg-orange-600/10 group-hover:bg-orange-600/20 transition-colors"></div>
      <svg viewBox="0 0 24 24" className="w-8 h-8 theme-primary-text relative z-10 group-hover:rotate-12 transition-transform" fill="currentColor">
        <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,0,1-8-8H6a6,6,0,0,0,12,0h2A8,8,0,0,1,12,20ZM12,4A8,8,0,0,0,4,12H2A10,10,0,0,1,12,2V4ZM12,12a4,4,0,1,1,4-4A4,4,0,0,1,12,12Z" />
      </svg>
    </button>
  );
};

export default ThemeSwitcher;
