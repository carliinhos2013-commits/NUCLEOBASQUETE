
import React from 'react';
import { User, View, NinjaAttributes, PlaystyleType } from '../types';
import { MapPin, Settings as SettingsIcon, LogOut, Flame, Trophy, Activity, Zap, Swords, Eye, Shield, Crown, Star, Target, Dribbble, ChevronRight, PenTool, Palette, Crosshair, Anchor } from 'lucide-react';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  setView: (view: View) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout, setView }) => {
  const defaultAttrs: NinjaAttributes = {
    ninjutsu: 50, taijutsu: 50, genjutsu: 50, dojutsu: 50
  };

  const attrs = user.attributes || defaultAttrs;

  // Lógica de determinação de Playstyle baseado em Atributos (Hierarquia NB)
  const getPlaystyle = (u: User): PlaystyleType => {
    if (u.playstyle) return u.playstyle;
    
    // Regras de Classificação
    if (attrs.ninjutsu >= 85 && attrs.genjutsu >= 70) return 'ARMADOR_SHOOTER'; // Armador com chute
    if (attrs.taijutsu >= 90) return 'PIVOT_MASTER'; // Força física dominante
    if (attrs.genjutsu >= 85 && attrs.taijutsu >= 80) return 'FLASH_WING'; // Rápido e Habilidoso (Ala)
    if (attrs.ninjutsu >= 80 && attrs.dojutsu >= 80 && attrs.taijutsu >= 80) return 'TWO_WAY'; // Completo
    
    return 'HOOPER'; // Padrão
  };

  const currentPlaystyle = getPlaystyle(user);

  const playstyleInfo: Record<PlaystyleType, { label: string, color: string, icon: any, desc: string }> = {
    'HOOPER': { 
        label: 'Estilo Hooper', 
        color: 'text-blue-500', 
        icon: Star, 
        desc: 'Criatividade pura. Você joga com instinto e estilo de rua.' 
    },
    'ARMADOR_SHOOTER': { 
        label: 'Armador Shooter', 
        color: 'text-orange-500', 
        icon: Crosshair, 
        desc: 'Gatilho de elite com controle de jogo. Ameaça constante do perímetro.' 
    },
    'FLASH_WING': { 
        label: 'Flash Ala', 
        color: 'text-yellow-500', 
        icon: Zap, 
        desc: 'Explosão e velocidade nas alas. Imparável em transição.' 
    },
    'PIVOT_MASTER': { 
        label: 'Pivot Dominante', 
        color: 'text-red-600', 
        icon: Anchor, 
        desc: 'Dono do garrafão. Força física e proteção de aro absoluta.' 
    },
    'TWO_WAY': { 
        label: 'Two-Way Elite', 
        color: 'text-purple-600', 
        icon: Crown, 
        desc: 'Elite absoluta em ataque e defesa. O jogador completo.' 
    }
  };

  const style = playstyleInfo[currentPlaystyle];

  // Intensidade visual do foguinho baseada no Streak
  const getFlameClass = (streak: number) => {
    if (streak >= 50) return 'text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.9)] scale-125';
    if (streak >= 15) return 'text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)] scale-110';
    return 'text-red-500';
  };

  return (
    <div className="h-full theme-bg pb-32 overflow-y-auto no-scrollbar animate-in fade-in duration-500">
      {/* Header Banner Estilizado */}
      <div className="h-64 theme-primary-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 rotate-12 scale-150">
           <Dribbble size={400} />
        </div>
        
        <div className="absolute top-12 right-6 flex gap-3 z-10">
          <button onClick={() => setView(View.SETTINGS)} className="p-4 bg-white/20 backdrop-blur-md rounded-[1.2rem] text-white border border-white/20 active:scale-90 transition-all">
            <SettingsIcon size={20} />
          </button>
          <button onClick={onLogout} className="p-4 bg-black/30 backdrop-blur-md rounded-[1.2rem] text-white border border-white/10 active:scale-90 transition-all">
            <LogOut size={20} />
          </button>
        </div>

        {/* Perfil Picture & Badge de Estilo */}
        <div className="absolute -bottom-16 left-6 flex items-end gap-5">
          <div className="relative group">
            <div className="w-40 h-40 rounded-[3.5rem] theme-surface border-[6px] theme-border flex items-center justify-center text-5xl font-black italic shadow-2xl overflow-hidden relative">
              {user.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
              ) : (
                <span className="theme-text">{user.name.charAt(0)}</span>
              )}
              {/* Edit Overlay */}
              <button 
                onClick={() => setView(View.AVATAR_CREATOR)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-10"
              >
                <div className="bg-orange-600 p-2 rounded-full text-white">
                  <Palette size={24} />
                </div>
              </button>
            </div>
            {/* Badge de Nível Flutuante */}
            <div className="absolute -top-3 -right-3 bg-neutral-900 border-2 theme-border px-4 py-1.5 rounded-full shadow-xl">
               <span className="text-[10px] font-black text-orange-500 italic uppercase">{user.level}</span>
            </div>
            {/* Foguinho de Streak */}
            <div className={`absolute -bottom-2 -right-2 bg-neutral-900 w-12 h-12 rounded-2xl border-2 theme-border flex items-center justify-center shadow-2xl transition-all duration-500 ${getFlameClass(user.streak)}`}>
               <Flame size={24} fill="currentColor" className="animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-20 px-6">
        <div className="flex justify-between items-start">
          <div className="animate-in slide-in-from-left duration-500">
            <h1 className="text-4xl font-black theme-text italic uppercase leading-none tracking-tighter mb-2">{user.name}</h1>
            <div className="flex items-center gap-3">
              <p className="theme-text-muted flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                <MapPin size={10} /> {user.city}
              </p>
              <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
              <p className="theme-primary-text text-[10px] font-black uppercase italic tracking-[0.2em]">STREAK: {user.streak} DIAS</p>
            </div>
          </div>
          <button 
             onClick={() => setView(View.AVATAR_CREATOR)}
             className="theme-surface border theme-border px-4 py-2 rounded-xl text-[10px] font-black uppercase theme-text flex items-center gap-2 shadow-sm hover:border-orange-500 transition-colors"
          >
             <Palette size={14} /> Editar Avatar
          </button>
        </div>

        {/* Card de Arquétipo / Estilo de Jogo */}
        <div className="mt-10 theme-surface border-2 theme-border rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-[-20%] right-[-10%] opacity-5 group-hover:rotate-12 transition-transform duration-1000">
              <style.icon size={200} className={style.color} />
           </div>
           
           <div className="flex items-center gap-4 mb-4">
              <div className={`w-14 h-14 bg-neutral-900 border theme-border rounded-2xl flex items-center justify-center ${style.color} shadow-inner`}>
                 <style.icon size={32} />
              </div>
              <div>
                 <p className="text-[8px] theme-text-muted font-black uppercase tracking-widest mb-1">Arquétipo Atual</p>
                 <h2 className={`text-2xl font-black italic uppercase leading-none ${style.color}`}>{style.label}</h2>
              </div>
           </div>
           <p className="theme-text-muted text-[11px] font-medium italic leading-relaxed max-w-[80%]">
             "{style.desc}"
           </p>
        </div>

        {/* DNA de Combate (Atributos) */}
        <div className="mt-8 theme-surface border-2 theme-border rounded-[2.5rem] p-8 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black italic uppercase theme-text flex items-center gap-2 tracking-widest">
              <Zap size={14} className="text-yellow-500" /> Skills de Atleta
            </h3>
            <span className="text-[8px] font-black theme-text-muted uppercase tracking-[0.2em]">Sincronia IA</span>
          </div>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-8">
            {[
              { label: 'Ninjutsu', val: attrs.ninjutsu, icon: Target, color: 'bg-orange-600', sub: 'Arremesso' },
              { label: 'Taijutsu', val: attrs.taijutsu, icon: Swords, color: 'bg-green-600', sub: 'Físico/Defesa' },
              { label: 'Genjutsu', val: attrs.genjutsu, icon: Zap, color: 'bg-purple-600', sub: 'Handle/Drible' },
              { label: 'Dojutsu', val: attrs.dojutsu, icon: Eye, color: 'bg-blue-600', sub: 'Visão/IQ' }
            ].map((attr) => (
              <div key={attr.label} className="group">
                <div className="flex justify-between items-end mb-2">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase theme-text leading-none group-hover:theme-primary-text transition-colors">{attr.label}</span>
                      <span className="text-[7px] font-bold theme-text-muted uppercase mt-0.5 tracking-tighter">{attr.sub}</span>
                   </div>
                   <span className="text-sm font-black theme-text italic leading-none">{attr.val}</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden border border-white/5 p-[1px]">
                   <div 
                    className={`h-full ${attr.color} rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.5)]`} 
                    style={{ width: `${attr.val}%` }}
                   ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Barra de Progresso XP */}
        <div className="mt-8 theme-surface border theme-border rounded-[2.5rem] p-8">
          <div className="flex justify-between items-end mb-4">
            <div>
               <p className="text-[8px] theme-text-muted font-black uppercase tracking-widest mb-1">Caminho do Guerreiro</p>
               <h3 className="text-xl font-black italic uppercase theme-text leading-none">XP Total: {user.points.toLocaleString()}</h3>
            </div>
            <div className="text-right">
               <span className="block text-[10px] theme-primary-text font-black uppercase">Próximo: {Math.ceil((user.points + 1000) / 1000) * 1000}</span>
            </div>
          </div>
          <div className="w-full h-4 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800 p-1">
            <div 
              className="h-full theme-primary-bg rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(234,88,12,0.5)]" 
              style={{ width: `${(user.points % 1000) / 10}%` }}
            ></div>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 gap-4 mt-6">
           <div className="theme-surface border theme-border rounded-[2rem] p-6 flex flex-col items-center justify-center gap-2 group hover:border-orange-500/50 transition-all">
              <Activity size={24} className="theme-primary-text group-hover:scale-110 transition-transform" />
              <p className="text-2xl font-black italic theme-text leading-none">{user.totalWorkouts}</p>
              <p className="text-[8px] theme-text-muted font-black uppercase tracking-widest">Treinos Pagos</p>
           </div>
           <div className="theme-surface border theme-border rounded-[2rem] p-6 flex flex-col items-center justify-center gap-2 group hover:border-orange-500/50 transition-all">
              <Trophy size={24} className="theme-primary-text group-hover:scale-110 transition-transform" />
              <p className="text-2xl font-black italic theme-text leading-none">#{user.points > 10000 ? '4' : '15'}</p>
              <p className="text-[8px] theme-text-muted font-black uppercase tracking-widest">Ranking Global</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
