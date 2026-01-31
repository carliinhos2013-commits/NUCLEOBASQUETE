
import React, { useEffect, useState } from 'react';
import { PlayerRank } from '../types';
import { supabase } from '../services/supabase';
import { Trophy, Medal, MapPin, Loader2, Flame, Star, ChevronRight, Crown, TrendingUp, Sparkles, Zap } from 'lucide-react';

type RankingTab = 'GLOBAL' | 'CONSISTENCY' | 'LEGENDS';

const Ranking: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RankingTab>('GLOBAL');
  const [ranking, setRanking] = useState<PlayerRank[]>([]);
  const [loading, setLoading] = useState(true);

  const legends = [
    {
      id: 'jordan',
      name: 'Michael Jordan',
      points: 32292,
      titles: '6x NBA Champion',
      nickname: 'Air Jordan',
      color: 'from-red-600 to-black',
      avatar: 'MJ'
    },
    {
      id: 'lebron',
      name: 'LeBron James',
      points: 40474,
      titles: '4x NBA Champion',
      nickname: 'The King',
      color: 'from-purple-600 to-yellow-500',
      avatar: 'LBJ'
    },
    {
      id: 'curry',
      name: 'Stephen Curry',
      points: 23668,
      titles: '4x NBA Champion',
      nickname: 'Chef Curry',
      color: 'from-blue-600 to-yellow-400',
      avatar: 'SC'
    }
  ];

  useEffect(() => {
    if (activeTab === 'LEGENDS') {
      setLoading(false);
      return;
    }
    
    const fetchRanking = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order(activeTab === 'GLOBAL' ? 'points' : 'streak', { ascending: false })
        .limit(20);

      if (data) {
        setRanking(data.map(p => ({
          id: p.id,
          name: p.name,
          points: p.points || 0,
          streak: p.streak || 0,
          lastWorkout: 'Recentemente',
          avatar: p.name.charAt(0),
          city: p.city
        })));
      }
      setLoading(false);
    };

    fetchRanking();
  }, [activeTab]);

  const renderPodium = () => {
    if (ranking.length < 3) return null;
    const top3 = ranking.slice(0, 3);
    const podiumOrder = [top3[1], top3[0], top3[2]];

    return (
      <div className="flex items-end justify-center gap-2 mb-10 mt-6 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* 2º Lugar */}
        <div className="flex flex-col items-center flex-1">
          <div className="relative mb-2">
            <div className="w-16 h-16 rounded-2xl bg-neutral-800 border-2 border-slate-400 flex items-center justify-center overflow-hidden shadow-lg">
              <span className="text-xl font-black theme-text italic">{podiumOrder[0].name.charAt(0)}</span>
            </div>
            <div className="absolute -top-2 -right-2 bg-slate-400 text-neutral-900 w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px]">2</div>
          </div>
          <p className="text-[10px] font-black theme-text uppercase italic truncate w-20 text-center">{podiumOrder[0].name}</p>
          <div className="h-16 w-full bg-slate-400/20 rounded-t-xl mt-2 flex items-center justify-center">
             <Medal size={20} className="text-slate-400" />
          </div>
        </div>

        {/* 1º Lugar */}
        <div className="flex flex-col items-center flex-1 -mt-8">
          <div className="relative mb-3">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce">
              <Crown size={32} className="text-yellow-500 fill-yellow-500" />
            </div>
            <div className="w-24 h-24 rounded-[2rem] bg-neutral-800 border-4 border-yellow-500 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(234,179,8,0.3)]">
              <span className="text-3xl font-black theme-text italic">{podiumOrder[1].name.charAt(0)}</span>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-neutral-900 px-3 py-0.5 rounded-full font-black text-[10px]">MVP</div>
          </div>
          <p className="text-xs font-black theme-text uppercase italic truncate w-24 text-center">{podiumOrder[1].name}</p>
          <div className="h-28 w-full bg-yellow-500/20 rounded-t-2xl mt-2 flex flex-col items-center justify-center border-t-2 border-yellow-500/50">
             <Trophy size={28} className="text-yellow-500 mb-1" />
             <span className="text-[10px] font-black text-yellow-500">{podiumOrder[1].points} pts</span>
          </div>
        </div>

        {/* 3º Lugar */}
        <div className="flex flex-col items-center flex-1">
          <div className="relative mb-2">
            <div className="w-14 h-14 rounded-2xl bg-neutral-800 border-2 border-orange-700 flex items-center justify-center overflow-hidden shadow-lg">
              <span className="text-lg font-black theme-text italic">{podiumOrder[2].name.charAt(0)}</span>
            </div>
            <div className="absolute -top-2 -right-2 bg-orange-700 text-white w-5 h-5 rounded-full flex items-center justify-center font-black text-[9px]">3</div>
          </div>
          <p className="text-[10px] font-black theme-text uppercase italic truncate w-16 text-center">{podiumOrder[2].name}</p>
          <div className="h-12 w-full bg-orange-700/20 rounded-t-xl mt-2 flex items-center justify-center">
             <Medal size={16} className="text-orange-700" />
          </div>
        </div>
      </div>
    );
  };

  const renderLegends = () => (
    <div className="px-6 space-y-6 mt-8 pb-10 animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-yellow-500 font-black italic uppercase text-lg tracking-widest flex items-center justify-center gap-2">
          <Sparkles size={20} /> HALL DA FAMA <Sparkles size={20} />
        </h2>
        <p className="text-[8px] theme-text-muted uppercase font-black tracking-[0.3em]">As maiores lendas da história</p>
      </div>
      
      {legends.map((legend) => (
        <div 
          key={legend.id}
          className={`relative overflow-hidden rounded-[2.5rem] border-2 border-white/10 bg-gradient-to-br ${legend.color} p-8 shadow-2xl group transition-all active:scale-95`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
             <Trophy size={120} />
          </div>
          
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
               <span className="text-3xl font-black italic text-white leading-none">{legend.avatar}</span>
            </div>
            <div className="flex-1">
               <p className="text-[10px] text-white/60 font-black uppercase tracking-widest leading-none mb-1">{legend.nickname}</p>
               <h3 className="text-2xl font-black italic uppercase text-white leading-none mb-2">{legend.name}</h3>
               <div className="flex gap-2">
                 <span className="bg-black/30 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase">{legend.titles}</span>
               </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black italic text-white leading-none">{legend.points.toLocaleString()}</p>
              <p className="text-[8px] text-white/50 font-black uppercase tracking-widest">PTS CARREIRA</p>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
             <div className="h-full bg-white/40 w-full animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full theme-bg pb-24 overflow-y-auto no-scrollbar">
      {/* Header Estilo Pantheon - Clicável */}
      <div 
        onClick={() => setActiveTab(activeTab === 'LEGENDS' ? 'GLOBAL' : 'LEGENDS')}
        className="p-6 pt-12 text-center bg-gradient-to-b from-orange-600/10 to-transparent cursor-pointer active:scale-95 transition-transform"
      >
        <p className="theme-primary-text text-[9px] font-black uppercase tracking-[0.4em] mb-2 flex items-center justify-center gap-2">
          <Zap size={10} fill="currentColor" /> The Elite Circle <Zap size={10} fill="currentColor" />
        </p>
        <h1 className="text-4xl font-black italic uppercase theme-text tracking-tighter leading-none mb-2">
          PANTEÃO<br/>DE DEUSES
        </h1>
        <p className="theme-text-muted text-[10px] font-bold uppercase tracking-widest max-w-[200px] mx-auto opacity-60">
          {activeTab === 'LEGENDS' ? 'Você está entre os imortais.' : 'Sua evolução, seu nome. Toque para ver as lendas.'}
        </p>
      </div>

      {/* Tabs Customizadas */}
      <div className="flex px-6 gap-2 mt-6 sticky top-0 theme-bg z-20 py-4 border-b theme-border shadow-md">
        {[
          { id: 'GLOBAL', icon: Trophy, label: 'Global' },
          { id: 'CONSISTENCY', icon: Flame, label: 'Constância' },
          { id: 'LEGENDS', icon: Crown, label: 'Lendas' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as RankingTab)}
            className={`flex-1 py-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border ${
              activeTab === tab.id 
                ? 'theme-primary-bg text-white border-transparent shadow-lg scale-105' 
                : 'theme-surface text-neutral-500 border-neutral-800'
            }`}
          >
            <tab.icon size={16} />
            <span className="text-[8px] font-black uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="theme-primary-text animate-spin" size={32} />
        </div>
      ) : activeTab === 'LEGENDS' ? (
        renderLegends()
      ) : (
        <div className="pb-10">
          {activeTab === 'GLOBAL' && renderPodium()}

          <div className="px-6 space-y-3 mt-4">
            {ranking.slice(activeTab === 'GLOBAL' ? 3 : 0).map((player, index) => {
              const actualRank = activeTab === 'GLOBAL' ? index + 4 : index + 1;
              return (
                <div 
                  key={player.id}
                  className="theme-surface border theme-border rounded-[2rem] p-5 flex items-center shadow-lg hover:border-orange-500/50 transition-all group"
                >
                  <div className="w-8 font-black text-neutral-600 italic text-sm">
                    #{actualRank}
                  </div>
                  
                  <div className="relative">
                    <div className="w-12 h-12 theme-bg border theme-border rounded-xl flex items-center justify-center font-black theme-text italic text-lg shadow-inner">
                      {player.avatar}
                    </div>
                    {player.streak > 10 && (
                      <div className="absolute -top-1 -right-1">
                        <TrendingUp size={14} className="text-green-500 drop-shadow-sm" />
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black italic uppercase theme-text leading-none text-sm">{player.name}</h3>
                      {actualRank <= 10 && <Crown size={10} className="text-yellow-500" />}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center gap-0.5 text-neutral-600 text-[8px] font-black uppercase tracking-tighter">
                        <MapPin size={8} /> {player.city}
                      </div>
                      <div className="w-1 h-1 bg-neutral-700 rounded-full"></div>
                      <div className="flex items-center gap-0.5 text-orange-500 text-[8px] font-black uppercase tracking-tighter">
                        <Flame size={8} fill="currentColor" /> {player.streak}D
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block font-black theme-primary-text text-lg leading-none">
                      {activeTab === 'CONSISTENCY' ? player.streak : player.points}
                    </span>
                    <span className="text-[7px] theme-text-muted font-black uppercase tracking-[0.2em]">
                      {activeTab === 'CONSISTENCY' ? 'DIAS' : 'PTS'}
                    </span>
                  </div>
                  
                  <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={14} className="theme-text-muted" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mx-6 mt-8 p-6 bg-neutral-900 border-2 border-dashed theme-border rounded-[2.5rem] text-center">
            <p className="text-[10px] theme-text-muted font-black uppercase tracking-widest mb-3">Sua jornada para o topo</p>
            <h4 className="text-lg font-black italic uppercase theme-text leading-tight mb-4">TORNE-SE UM MVP<br/>NO PANTEÃO</h4>
            <div className="w-12 h-1 w-12 bg-orange-600 mx-auto rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ranking;
