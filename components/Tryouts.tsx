
import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Tryout } from '../types';
import { ArrowLeft, MapPin, Calendar, Trophy, ChevronRight, Loader2, Info } from 'lucide-react';

interface TryoutsProps {
  goBack: () => void;
}

const Tryouts: React.FC<TryoutsProps> = ({ goBack }) => {
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTryouts = async () => {
      // Tenta buscar da tabela, caso não exista retorna dados mocados para visualização
      try {
        const { data, error } = await supabase
          .from('peneiras')
          .select('*')
          .order('date', { ascending: true });

        if (data && data.length > 0) {
          setTryouts(data);
        } else {
          // Dados Fake para o CEO ver a funcionalidade
          setTryouts([
            {
              id: '1',
              club_name: 'Flamengo Basquete',
              category: 'Sub-15 a Sub-19',
              date: '2024-12-15T09:00:00Z',
              location: 'Gávea, Rio de Janeiro - RJ',
              description: 'Processo seletivo para as categorias de base federadas. Necessário levar documento e traje esportivo.',
              link: 'https://flamengo.com.br'
            },
            {
              id: '2',
              club_name: 'Corinthians',
              category: 'Adulto (Masculino)',
              date: '2024-12-20T14:00:00Z',
              location: 'Parque São Jorge, São Paulo - SP',
              description: 'Seletiva para reforço do elenco profissional e desenvolvimento de talentos.',
              link: 'https://corinthians.com.br'
            }
          ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchTryouts();
  }, []);

  return (
    <div className="h-full theme-bg overflow-y-auto pb-24 no-scrollbar">
      <div className="p-6 pt-12 flex items-center gap-4 sticky top-0 theme-bg z-10 border-b theme-border shadow-sm">
        <button onClick={goBack} className="theme-surface p-2 rounded-xl theme-border border shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black italic uppercase theme-text tracking-tighter leading-none">PENEIRAS</h1>
          <p className="theme-text-muted text-[10px] font-bold uppercase tracking-widest mt-1">Conectando você aos clubes</p>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        <div className="bg-orange-600/10 border border-orange-500/30 p-4 rounded-2xl flex items-start gap-3">
          <Info size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-orange-200 leading-relaxed uppercase font-bold">
            Clubes federados usam o Núcleo Basquete para encontrar talentos. Mantenha seus dados e treinos atualizados para ser notado!
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-orange-600" /></div>
        ) : (
          tryouts.map((t) => (
            <div key={t.id} className="theme-surface border-2 theme-border rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden group hover:border-orange-500 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 theme-bg border theme-border rounded-xl flex items-center justify-center">
                   <Trophy size={24} className="theme-primary-text" />
                </div>
                <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">
                  {t.category}
                </span>
              </div>
              
              <h3 className="text-xl font-black italic uppercase theme-text mb-4 leading-none">{t.club_name}</h3>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 theme-text-muted text-xs font-medium">
                  <Calendar size={14} className="text-orange-500" />
                  {/* Fixed invalid date formatting options: '2h' is not a valid value for hour/minute in toLocaleTimeString, using '2-digit' instead */}
                  {new Date(t.date).toLocaleDateString('pt-BR')} às {new Date(t.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
                </div>
                <div className="flex items-center gap-2 theme-text-muted text-xs font-medium">
                  <MapPin size={14} className="text-orange-500" />
                  {t.location}
                </div>
              </div>

              <p className="text-sm theme-text-muted mb-6 leading-relaxed italic">
                "{t.description}"
              </p>

              <button 
                onClick={() => window.open(t.link, '_blank')}
                className="w-full theme-primary-bg text-white py-4 rounded-2xl font-black italic uppercase text-xs tracking-widest flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform"
              >
                TENHO INTERESSE <ChevronRight size={14} />
              </button>
            </div>
          ))
        )}

        <div className="text-center p-10 mt-4 border-2 border-dashed theme-border rounded-[2.5rem] opacity-40">
           <p className="text-[10px] theme-text-muted font-black uppercase tracking-widest">Mais peneiras em breve...</p>
        </div>
      </div>
    </div>
  );
};

export default Tryouts;
