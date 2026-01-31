
import React from 'react';
import { ArrowLeft, MessageSquare, Heart, Share2, PlusCircle } from 'lucide-react';

const Community: React.FC<{ goBack: () => void }> = ({ goBack }) => {
  return (
    <div className="h-full theme-bg flex flex-col pb-24">
      <div className="p-6 pt-12 flex justify-between items-center bg-gradient-to-b from-neutral-800/10 to-transparent">
        <button onClick={goBack} className="theme-surface p-2 rounded-xl theme-border border">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-black italic uppercase theme-text">Comunidade</h1>
        <button className="theme-primary-text">
          <PlusCircle size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-6 no-scrollbar">
        {[
          { user: "Carlos G.", text: "Treino insano hoje na quadra central! Alguém para um 2x2 amanhã?", time: "2h" },
          { user: "Duda Dunk", text: "Finalmente acertei 10 lances livres seguidos. Foco total!", time: "5h" }
        ].map((post, i) => (
          <div key={i} className="theme-surface border theme-border rounded-[2rem] p-6 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 theme-primary-bg rounded-xl flex items-center justify-center text-white font-black italic">{post.user.charAt(0)}</div>
              <div>
                <p className="font-black italic uppercase text-sm theme-text">{post.user}</p>
                <p className="text-[8px] theme-text-muted font-bold uppercase tracking-widest">{post.time} atrás</p>
              </div>
            </div>
            <p className="theme-text text-sm leading-relaxed mb-6">{post.text}</p>
            <div className="flex gap-6 pt-4 border-t theme-border">
              <button className="flex items-center gap-2 theme-text-muted text-[10px] font-black"><Heart size={16} /> 12</button>
              <button className="flex items-center gap-2 theme-text-muted text-[10px] font-black"><MessageSquare size={16} /> 4</button>
              <button className="flex items-center gap-2 theme-text-muted ml-auto"><Share2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
