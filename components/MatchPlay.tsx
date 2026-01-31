
import React, { useState } from 'react';
import { User, MatchContra } from '../types';
import { ArrowLeft, Dribbble, MapPin, Calendar, Users, Plus, ChevronRight, Filter } from 'lucide-react';

interface MatchPlayProps {
  goBack: () => void;
  user: User;
}

const MatchPlay: React.FC<MatchPlayProps> = ({ goBack, user }) => {
  const [matches] = useState<MatchContra[]>([
    {
      id: '1',
      creator: 'Rodrigo "Cestinha"',
      location: 'Quadra do Ibirapuera',
      date: 'Hoje, 19:30',
      playersNeeded: 4,
      level: 'Avançado'
    },
    {
      id: '2',
      creator: 'Ana Paula',
      location: 'Parque Madureira',
      date: 'Amanhã, 09:00',
      playersNeeded: 2,
      level: 'Intermediário'
    },
    {
      id: '3',
      creator: 'Vini Dunk',
      location: 'Praça da Liberdade',
      date: 'Sábado, 16:00',
      playersNeeded: 6,
      level: 'Qualquer Nível'
    }
  ]);

  return (
    <div className="h-full theme-bg overflow-y-auto pb-24 no-scrollbar">
      {/* Header */}
      <div className="p-6 pt-12 flex items-center justify-between sticky top-0 theme-bg z-10 border-b theme-border">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="theme-surface p-2 rounded-xl theme-border border shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black italic uppercase theme-text tracking-tighter leading-none">Arena de Contras</h1>
            <p className="theme-text-muted text-[10px] font-bold uppercase tracking-widest mt-1">Marque seu próximo jogo</p>
          </div>
        </div>
        <button className="theme-surface p-2 rounded-xl theme-border border">
          <Filter size={18} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Call to Action */}
        <button className="w-full bg-gradient-to-r from-green-600 to-emerald-700 p-6 rounded-[2rem] flex items-center justify-between shadow-lg active:scale-[0.98] transition-all">
          <div className="text-left">
            <h3 className="text-xl font-black italic uppercase text-white leading-none">Criar Novo Contra</h3>
            <p className="text-[10px] text-green-100 font-bold uppercase mt-1">Convoque a galera</p>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
            <Plus size={24} />
          </div>
        </button>

        {/* List of Matches */}
        <div className="space-y-4">
          <h2 className="text-sm font-black italic uppercase theme-text-muted tracking-[0.2em] px-2">Jogos em Aberto</h2>
          
          {matches.map((match) => (
            <div key={match.id} className="theme-surface border-2 theme-border rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 theme-bg border theme-border rounded-xl flex items-center justify-center font-black italic theme-primary-text">
                    {match.creator.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black italic uppercase theme-text leading-none">{match.creator}</h4>
                    <span className="text-[9px] theme-primary-text font-black uppercase tracking-widest">{match.level}</span>
                  </div>
                </div>
                <div className="bg-neutral-800 px-3 py-1 rounded-full flex items-center gap-1">
                   <Users size={12} className="text-neutral-500" />
                   <span className="text-[10px] font-black text-white">{match.playersNeeded} Vagas</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 theme-text-muted text-xs font-bold">
                  <MapPin size={14} className="text-red-500" />
                  {match.location}
                </div>
                <div className="flex items-center gap-2 theme-text-muted text-xs font-bold">
                  <Calendar size={14} className="text-blue-500" />
                  {match.date}
                </div>
              </div>

              <button className="w-full bg-neutral-900 border theme-border py-4 rounded-2xl font-black italic uppercase text-xs tracking-widest theme-text flex items-center justify-center gap-2 group-hover:border-green-500 transition-colors">
                QUERO JOGAR <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        {/* Empty state simulation / more */}
        <div className="text-center p-10 mt-4 border-2 border-dashed theme-border rounded-[2.5rem] opacity-40">
           <Dribbble size={32} className="mx-auto mb-2 text-neutral-500" />
           <p className="text-[10px] theme-text-muted font-black uppercase tracking-widest">Mais jogos em breve na sua região</p>
        </div>
      </div>
    </div>
  );
};

export default MatchPlay;
