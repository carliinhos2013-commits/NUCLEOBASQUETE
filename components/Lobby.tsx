
import React from 'react';
import { User, View } from '../types';
import { Flame, Play, Bot, MapPin, Trophy, ChevronRight, Users, Dribbble, UserCircle, Zap } from 'lucide-react';
import NBLogo from './NBLogo';

interface LobbyProps {
  user: User;
  setView: (view: View) => void;
}

const Lobby: React.FC<LobbyProps> = ({ user, setView }) => {
  return (
    <div className="flex flex-col h-full theme-bg pb-32 overflow-y-auto no-scrollbar animate-in fade-in duration-500 relative">
      
      {/* Background Watermark - Novo Branding */}
      <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none scale-150 translate-x-1/4 -translate-y-1/4">
         <NBLogo size={400} />
      </div>

      {/* Header & Profile */}
      <div className="p-6 pt-12 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-neutral-900 rounded-full p-2 border border-white/5 shadow-lg">
             <NBLogo size={32} />
          </div>
          <div>
            <p className="theme-text-muted text-[8px] font-black uppercase tracking-[0.2em] mb-0.5">Olá, {user.level}</p>
            <h1 className="text-2xl font-black theme-text italic uppercase leading-none tracking-tighter">
              {user.name.split(' ')[0]}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-center gap-1 theme-primary-text bg-orange-900/10 px-3 py-1.5 rounded-full border border-orange-500/20">
            <Flame size={14} fill="currentColor" className="animate-pulse" />
            <span className="font-black text-xs">{user.streak} <span className="text-[8px] opacity-70">DIAS</span></span>
          </div>
          <button 
            onClick={() => setView(View.PROFILE)}
            className="w-10 h-10 rounded-full theme-surface border-2 theme-border flex items-center justify-center overflow-hidden shadow-lg active:scale-90 transition-transform"
          >
            {user.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
            ) : (
              <span className="font-black italic theme-text">{user.name.charAt(0)}</span>
            )}
          </button>
        </div>
      </div>

      {/* MYPLAYER CARD (Avatar) */}
      <div className="px-6 mt-4 relative z-10">
        <button 
          onClick={() => setView(View.AVATAR_CREATOR)}
          className="w-full theme-surface border-2 theme-border rounded-[2.5rem] p-5 flex items-center gap-5 shadow-2xl relative overflow-hidden group active:scale-[0.98] transition-all"
        >
          {/* Background FX */}
          <div className="absolute top-0 right-0 p-2 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
             <UserCircle size={140} />
          </div>

          <div className="w-20 h-24 bg-neutral-900 rounded-2xl border border-neutral-700 flex-shrink-0 overflow-hidden shadow-inner relative">
             {user.avatar ? (
               <img src={user.avatar} className="w-full h-full object-cover" alt="MyPlayer" />
             ) : (
               <div className="w-full h-full flex items-center justify-center">
                 <UserCircle size={32} className="text-neutral-700" />
               </div>
             )}
             <div className="absolute bottom-0 left-0 w-full bg-orange-600 py-0.5 text-center">
                <span className="text-[8px] font-black text-white uppercase tracking-wider">LVL {user.level}</span>
             </div>
          </div>
          
          <div className="text-left flex-1 relative z-10">
            <div className="flex items-center gap-2 mb-1">
               <span className="bg-orange-600/10 text-orange-500 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                 <Zap size={8} fill="currentColor" /> Digital Twin
               </span>
            </div>
            <h3 className="text-xl font-black italic uppercase theme-text leading-none">Identidade<br/>Digital</h3>
            <p className="text-[10px] theme-text-muted font-bold uppercase mt-1 tracking-wider group-hover:text-orange-500 transition-colors">
              Customizar DNA & Estilo
            </p>
          </div>
          
          <div className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center group-hover:bg-orange-600 group-hover:border-orange-600 group-hover:text-white transition-colors">
             <ChevronRight size={16} className="theme-text-muted group-hover:text-white" />
          </div>
        </button>
      </div>

      {/* 1º: HERO TRAINING (Treino) */}
      <div className="px-6 mt-6 relative z-10">
        <button 
          onClick={() => setView(View.TRAINING)}
          className="w-full h-56 rounded-[2.5rem] relative overflow-hidden group shadow-2xl active:scale-[0.98] transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-red-700"></div>
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>
          
          <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 group-hover:scale-110 duration-700">
             <NBLogo size={180} />
          </div>
          <div className="absolute inset-0 p-8 flex flex-col justify-between text-left">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
              <Play size={28} fill="white" className="ml-1 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white italic uppercase leading-none tracking-tighter">TREINO<br/>PRO</h2>
              <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">REGISTRAR EVOLUÇÃO <span className="w-2 h-2 bg-white rounded-full animate-ping"></span></p>
            </div>
          </div>
        </button>
      </div>

      {/* 2º: BUSCAR QUADRAS & COACH VIRTUAL */}
      <div className="px-6 grid grid-cols-2 gap-4 mt-6 relative z-10">
        <button onClick={() => setView(View.LOCATIONS)} className="theme-surface border-2 theme-border rounded-[2rem] p-6 flex flex-col items-start gap-4 shadow-xl active:scale-95 transition-all group hover:border-blue-500">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"><MapPin size={24} /></div>
          <div className="text-left">
            <h3 className="font-black italic uppercase theme-text leading-none text-lg">Buscar<br/>Quadras</h3>
            <p className="text-[8px] theme-text-muted font-bold uppercase mt-1">Locais NB</p>
          </div>
        </button>

        <button onClick={() => setView(View.TUTOR)} className="theme-surface border-2 theme-border rounded-[2rem] p-6 flex flex-col items-start gap-4 shadow-xl active:scale-95 transition-all group hover:border-orange-500">
          <div className="w-12 h-12 theme-primary-bg rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"><Bot size={24} /></div>
          <div className="text-left">
            <h3 className="font-black italic uppercase theme-text leading-none text-lg">Coach<br/>Virtual</h3>
            <p className="text-[8px] theme-text-muted font-bold uppercase mt-1">Dicas de IA</p>
          </div>
        </button>
      </div>

      {/* 3º: RADAR DE ELITE (Peneiras) & COMUNIDADE */}
      <div className="px-6 grid grid-cols-2 gap-4 mt-4 relative z-10">
        <button onClick={() => setView(View.TRYOUTS)} className="bg-neutral-900 border-2 border-orange-600/30 rounded-[2rem] p-6 flex flex-col items-start gap-4 shadow-xl active:scale-95 transition-all hover:bg-neutral-800">
          <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Trophy size={24} /></div>
          <div className="text-left">
            <h3 className="font-black italic uppercase text-white leading-none text-lg">Radar de<br/>Elite</h3>
            <p className="text-[8px] text-orange-500 font-bold uppercase mt-1">Peneiras</p>
          </div>
        </button>

        <button onClick={() => setView(View.COMMUNITY)} className="theme-surface border-2 theme-border rounded-[2rem] p-6 flex flex-col items-start gap-4 shadow-xl active:scale-95 transition-all hover:border-pink-500">
          <div className="w-12 h-12 bg-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Users size={24} /></div>
          <div className="text-left">
            <h3 className="font-black italic uppercase theme-text leading-none text-lg">Comunidade</h3>
            <p className="text-[8px] theme-text-muted font-bold uppercase mt-1">Conectar</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Lobby;
