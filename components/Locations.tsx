
import React, { useState } from 'react';
import { findNearbyCourts } from '../services/geminiService';
import { MapPin, Navigation, Search, Loader2, ExternalLink, Trophy, Star, Zap } from 'lucide-react';

const Locations: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{text: string, links: {uri: string, title: string}[]} | null>(null);

  const hubPolos = [
    {
      name: "Ibirapuera",
      city: "São Paulo - SP",
      level: "Elite / Hustle",
      color: "from-blue-600 to-blue-800",
      rating: "High"
    },
    {
      name: "Madureira",
      city: "Rio de Janeiro - RJ",
      level: "Street / Pro",
      color: "from-green-600 to-green-800",
      rating: "Very High"
    },
    {
      name: "Nossa Arena",
      city: "São Paulo - SP",
      level: "Training Center",
      color: "from-orange-600 to-orange-800",
      rating: "Ultimate"
    }
  ];

  const handleSearch = () => {
    setLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const data = await findNearbyCourts(latitude, longitude);
          setResults(data);
          setLoading(false);
        },
        (error) => {
          console.error(error);
          alert("Não foi possível obter sua localização.");
          setLoading(false);
        }
      );
    } else {
      alert("Geolocalização não suportada.");
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-neutral-900 pb-24 overflow-y-auto no-scrollbar">
      <div className="p-6 pt-12">
        <h1 className="text-3xl font-black italic uppercase theme-text mb-2 tracking-tighter">MAPA NB</h1>
        <p className="text-neutral-400 text-[10px] font-black uppercase tracking-widest mb-8">Onde a evolução acontece.</p>
        
        {/* Polos Lendários Section */}
        <section className="mb-10">
           <h2 className="text-xs font-black italic uppercase theme-text-muted mb-4 tracking-[0.2em] flex items-center gap-2">
             <Trophy size={14} className="text-orange-500" /> Polos Lendários
           </h2>
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {hubPolos.map((polo, i) => (
                <div 
                  key={i} 
                  className={`min-w-[200px] aspect-[16/10] relative rounded-[2rem] overflow-hidden bg-gradient-to-br ${polo.color} border-2 border-white/10 shadow-xl group cursor-pointer transition-all active:scale-95`}
                >
                   {/* Court Layout Background Overlay */}
                   <div className="absolute inset-0 opacity-20 pointer-events-none">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 border-2 border-white rounded-full -translate-y-1/2"></div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-24 border-2 border-white rounded-full translate-y-1/2"></div>
                      <div className="absolute inset-0 border-2 border-white m-2 rounded-xl"></div>
                   </div>

                   <div className="absolute inset-0 p-5 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                         <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-lg border border-white/30 text-[7px] text-white font-black uppercase tracking-widest">{polo.rating}</div>
                         <Star size={14} className="text-white/60 fill-white/20" />
                      </div>
                      <div>
                         <h3 className="text-lg font-black italic uppercase text-white leading-none tracking-tighter">{polo.name}</h3>
                         <p className="text-[8px] text-white/70 font-bold uppercase mt-1 flex items-center gap-1">
                           <MapPin size={8} /> {polo.city}
                         </p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* Radar Search Button */}
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="w-full theme-surface border-2 theme-border p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all active:scale-95 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-orange-600/5 group-hover:bg-orange-600/10 transition-colors"></div>
          {loading ? (
             <Loader2 size={32} className="theme-primary-text animate-spin" />
          ) : (
             <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]">
                <Navigation size={32} />
             </div>
          )}
          <div className="text-center relative z-10">
            <span className="font-black italic uppercase text-xl theme-text block leading-none">Radar de Quadras</span>
            <p className="text-[10px] theme-text-muted font-black uppercase mt-2 tracking-widest">Localizar Atividade Próxima</p>
          </div>
        </button>

        {results && (
          <div className="mt-8 animate-fade-in">
            <h2 className="text-lg font-black italic uppercase theme-text mb-4">Resultados Encontrados</h2>
            <div className="p-6 theme-surface border theme-border rounded-[2rem] theme-text-muted text-sm mb-6 whitespace-pre-wrap leading-relaxed italic">
              {results.text}
            </div>

            <div className="space-y-3">
              {results.links.map((link, idx) => (
                <a 
                  key={idx} 
                  href={link.uri} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-5 theme-surface border theme-border rounded-2xl hover:border-orange-500 transition-colors shadow-md active:scale-95"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center">
                      <MapPin size={20} className="text-red-500" />
                    </div>
                    <span className="font-black italic uppercase text-xs theme-text truncate max-w-[200px]">{link.title}</span>
                  </div>
                  <ExternalLink size={16} className="text-neutral-500" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Locations;
