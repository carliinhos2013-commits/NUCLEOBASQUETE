
import React, { useState } from 'react';
import { getPlayerModeling, generatePlayerArt } from '../services/geminiService';
import { BookOpen, BrainCircuit, Loader2, Scale, Target, Search, Sparkles, Zap, Swords, Shield, Anchor, Repeat, CircleDot, ChevronRight, Dribbble, Hourglass, Gavel, History, ScrollText } from 'lucide-react';

interface PlayerCardData {
  name: string;
  nickname: string;
  mentality: string;
  keyMove: string;
  trainingDrill: string;
  rating: number;
  image?: string;
}

const Education: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'BASICS' | 'DRIBBLES' | 'COMBOS' | 'RULES' | 'HISTORY' | 'MODEL'>('BASICS');
  const [modelPlayer, setModelPlayer] = useState('');
  const [modelResult, setModelResult] = useState<PlayerCardData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleModeling = async (player: string = modelPlayer) => {
    const target = player || modelPlayer;
    if (!target.trim()) return;
    
    setLoading(true);
    setModelResult(null);
    
    try {
      const [analysis, image] = await Promise.all([
        getPlayerModeling(target),
        generatePlayerArt(target)
      ]);

      if (analysis) {
        setModelResult({ ...analysis, image: image || undefined });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // --- DATA SOURCES ---

  const fundamentalsData = [
    {
      title: "Triple Threat (Ameaça Tripla)",
      icon: Anchor,
      desc: "A posição base de tudo. Joelhos flexionados, bola protegida no 'bolso' do quadril. Daqui você pode: 1. Arremessar, 2. Passar, 3. Driblar. É o início de qualquer ataque efetivo."
    },
    {
      title: "Pound Dribble (Controle de Força)",
      icon: Target,
      desc: "O segredo do controle. Não acaricie a bola, soque o chão com ela. Quanto mais forte o drible, mais rápido a bola volta para sua mão e mais difícil é de ser roubada."
    },
    {
      title: "Defensive Stance (Base Defensiva)",
      icon: Shield,
      desc: "Pés mais largos que os ombros, quadril baixo, costas retas. Mãos ativas o tempo todo (uma alta, uma baixa). Deslize os pés, nunca cruze as pernas na defesa."
    },
    {
      title: "Pivoting (Pivô)",
      icon: CircleDot,
      desc: "Manter um pé fixo no chão enquanto move o outro. Essencial para criar espaço sem cometer andada. Use para proteger a bola ou alinhar para o arremesso."
    },
    {
      title: "B.E.E.F (Arremesso)",
      icon: Zap,
      desc: "Balance (Equilíbrio), Eyes (Olhos no alvo), Elbow (Cotovelo alinhado em L), Follow-through (Quebra de munheca). A receita para um arremesso consistente."
    }
  ];

  const dribblesData = [
    {
      en: "Crossover",
      pt: "Cruzado pela Frente",
      desc: "Mudança de mão rápida pela frente do corpo. Baixe o quadril e exploda para o lado oposto do drible.",
      level: "Básico"
    },
    {
      en: "Between the Legs",
      pt: "Entre as Pernas",
      desc: "Passar a bola entre as pernas protege a bola do defensor enquanto você muda de direção ou velocidade. Mantenha a base larga.",
      level: "Intermediário"
    },
    {
      en: "Behind the Back",
      pt: "Por Trás das Costas",
      desc: "Movimento fluido onde a bola envolve suas costas. Ótimo para avançar em contra-ataque ou proteger a bola sob pressão extrema.",
      level: "Intermediário"
    },
    {
      en: "In and Out",
      pt: "Dentro e Fora (Finta)",
      desc: "Drible com uma mão só. Você finge que vai cruzar (in), mas traz a bola de volta (out) rapidamente. Vende a mudança de direção com o ombro.",
      level: "Avançado"
    },
    {
      en: "Hesitation (Hesi)",
      pt: "Hesitação",
      desc: "Você finge que vai parar ou arremessar (levanta o corpo e olha pro aro) e explode em velocidade quando o defensor relaxa.",
      level: "Pro"
    },
    {
      en: "Spin Move",
      pt: "Giro",
      desc: "Girar o corpo sobre o defensor, protegendo a bola com o corpo. Requer bom trabalho de pés (reverse pivot) e leitura de contato.",
      level: "Avançado"
    },
    {
      en: "Pocket Dribble",
      pt: "Drible de Bolso",
      desc: "Puxar a bola para trás do quadril ('bolso') para protegê-la ou preparar um arremesso/passe sem parar o drible vivo.",
      level: "Elite"
    },
    {
      en: "Shammgod",
      pt: "Shammgod",
      desc: "Lançar a bola para frente com uma mão e trazê-la de volta agressivamente com a outra mão. O 'quebra-tornozelos' definitivo.",
      level: "Lendário"
    }
  ];

  const combosData = [
    {
      name: "Cross Jab",
      items: ["In and Out", "Crossover"],
      desc: "Finta com In and Out para congelar, seguido de um Crossover explosivo."
    },
    {
      name: "The Glide",
      items: ["Between Legs", "Hesitation", "Cross"],
      desc: "Entre as pernas para avançar, hesitação para ler a defesa, crossover para finalizar."
    },
    {
      name: "Kyrie's Package",
      items: ["Double Cross", "Behind the Back", "Spin"],
      desc: "Sequência rápida para sair de dobras de marcação em espaço curto."
    },
    {
      name: "Harden Step",
      items: ["Between Legs", "Step Back", "Shot"],
      desc: "Entre as pernas para criar ritmo, seguido de um passo para trás para criar separação."
    }
  ];

  const rulesData = [
    {
      category: "Violações de Tempo",
      icon: Hourglass,
      rules: [
        { name: "3 Segundos", desc: "Um jogador ofensivo não pode ficar mais de 3 segundos consecutivos dentro do garrafão inimigo." },
        { name: "5 Segundos", desc: "Tempo máximo para repor a bola em jogo ou segurar a bola sendo marcado de perto." },
        { name: "8 Segundos", desc: "Tempo para a equipe cruzar a bola da quadra de defesa para o ataque (Regra FIBA/NBA)." },
        { name: "24 Segundos", desc: "Tempo limite de posse de bola para tentar um arremesso que toque o aro." }
      ]
    },
    {
      category: "Infrações de Manejo",
      icon: Dribbble,
      rules: [
        { name: "Andada (Traveling)", desc: "Mover o pé de pivô sem driblar ou dar mais de 2 passos com a bola na mão." },
        { name: "Duplo Drible", desc: "Driblar, segurar a bola e voltar a driblar, ou driblar com as duas mãos ao mesmo tempo." },
        { name: "Carregada (Carry)", desc: "Colocar a mão excessivamente por baixo da bola durante o drible." }
      ]
    },
    {
      category: "Faltas e Pontuação",
      icon: Gavel,
      rules: [
        { name: "Falta Pessoal", desc: "Contato ilegal com o adversário. 5 faltas (FIBA) ou 6 (NBA) eliminam o jogador." },
        { name: "Pontuação", desc: "Lance Livre = 1 ponto. Dentro da linha de 3 = 2 pontos. Fora da linha = 3 pontos." },
        { name: "Falta Técnica", desc: "Infração de conduta (ex: reclamar agressivamente). Gera lance livre para o adversário." }
      ]
    }
  ];

  const historyData = [
    { year: "1891", title: "A Criação", desc: "Dr. James Naismith inventa o basquete em Springfield, MA, usando cestas de pêssego e uma bola de futebol." },
    { year: "1936", title: "Olimpíadas", desc: "O basquete torna-se esporte olímpico oficial nos Jogos de Berlim." },
    { year: "1946", title: "Nascimento da NBA", desc: "Fundada como BAA, fundiu-se depois com a NBL para criar a maior liga do mundo." },
    { year: "1980s", title: "Era de Ouro", desc: "Rivalidade Magic Johnson vs Larry Bird salva a audiência e populariza o esporte." },
    { year: "1992", title: "Dream Team", desc: "Jordan, Magic e Bird em Barcelona. O mundo descobre o basquete de elite." },
    { year: "2010s", title: "Revolução dos 3Pts", desc: "Stephen Curry e o Warriors mudam a geometria do jogo, priorizando o arremesso de longa distância." }
  ];

  return (
    <div className="h-full theme-bg flex flex-col pb-24 overflow-hidden">
      {/* Header */}
      <div className="p-6 pt-12 pb-2">
        <h1 className="text-3xl font-black italic uppercase theme-text mb-1 tracking-tighter">Academia NB</h1>
        <p className="theme-text-muted text-[10px] font-black uppercase tracking-widest">Enciclopédia de Basquete</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-3 px-6 overflow-x-auto no-scrollbar py-4 sticky top-0 bg-neutral-900/95 backdrop-blur z-20 border-b border-neutral-800">
        {[
          { id: 'BASICS', icon: Anchor, label: 'Fundamentos' },
          { id: 'DRIBBLES', icon: Dribbble, label: 'Dribles' },
          { id: 'COMBOS', icon: Repeat, label: 'Combos' },
          { id: 'RULES', icon: Scale, label: 'Regras' },
          { id: 'HISTORY', icon: ScrollText, label: 'História' },
          { id: 'MODEL', icon: BrainCircuit, label: 'Modelagem' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-3 rounded-2xl flex items-center gap-2 transition-all flex-shrink-0 border ${
              activeTab === tab.id 
                ? 'theme-primary-bg text-white border-transparent shadow-lg' 
                : 'theme-surface text-neutral-400 border-neutral-800'
            }`}
          >
            <tab.icon size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        
        {/* FUNDAMENTALS TAB */}
        {activeTab === 'BASICS' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/20 border border-blue-500/30 p-6 rounded-[2.5rem] mb-6">
               <h3 className="text-blue-400 font-black italic uppercase text-lg mb-2">A Base do Jogo</h3>
               <p className="text-xs text-blue-200 leading-relaxed">
                 Antes de correr, você precisa andar. Domine estes 5 pilares para construir um jogo sólido e à prova de falhas.
               </p>
            </div>
            
            {fundamentalsData.map((item, idx) => (
              <div key={idx} className="theme-surface border theme-border rounded-[2rem] p-6 shadow-md hover:border-orange-500/50 transition-colors">
                <div className="flex items-start gap-4">
                   <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner flex-shrink-0">
                      <item.icon size={24} />
                   </div>
                   <div>
                      <h4 className="font-black italic uppercase theme-text text-lg leading-none mb-2">{item.title}</h4>
                      <p className="text-sm theme-text-muted leading-relaxed font-medium">{item.desc}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DRIBBLES TAB */}
        {activeTab === 'DRIBBLES' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
             {dribblesData.map((drible, idx) => (
               <div key={idx} className="theme-surface border theme-border rounded-[2.5rem] p-6 shadow-lg relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                     <Dribbble size={100} />
                  </div>
                  
                  <div className="flex justify-between items-start mb-3">
                     <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                        drible.level === 'Básico' ? 'bg-green-500/20 text-green-500' :
                        drible.level === 'Intermediário' ? 'bg-yellow-500/20 text-yellow-500' :
                        drible.level === 'Avançado' ? 'bg-orange-500/20 text-orange-500' :
                        'bg-purple-500/20 text-purple-500'
                     }`}>{drible.level}</span>
                  </div>

                  <h3 className="text-2xl font-black italic uppercase theme-text leading-none mb-1">{drible.en}</h3>
                  <p className="text-[10px] theme-primary-text font-black uppercase tracking-widest mb-4">{drible.pt}</p>
                  
                  <div className="bg-neutral-900/50 p-4 rounded-2xl border border-white/5">
                     <p className="text-sm text-neutral-300 leading-relaxed italic">"{drible.desc}"</p>
                  </div>
               </div>
             ))}
          </div>
        )}

        {/* COMBOS TAB */}
        {activeTab === 'COMBOS' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
             <div className="text-center mb-6">
                <h3 className="text-orange-500 font-black italic uppercase text-xl">Arquitetura de Jogadas</h3>
                <p className="text-[10px] theme-text-muted uppercase tracking-widest">Encadear para Destruir defesas</p>
             </div>

             {combosData.map((combo, idx) => (
               <div key={idx} className="bg-neutral-800 border-2 border-neutral-700 rounded-[2rem] p-6 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white">
                        <Swords size={20} />
                     </div>
                     <h3 className="text-xl font-black italic uppercase text-white">{combo.name}</h3>
                  </div>

                  <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
                     {combo.items.map((step, i) => (
                        <React.Fragment key={i}>
                           <div className="bg-neutral-900 px-4 py-2 rounded-xl border border-neutral-600 text-xs font-bold text-white whitespace-nowrap">
                              {step}
                           </div>
                           {i < combo.items.length - 1 && <ChevronRight size={14} className="text-neutral-500 flex-shrink-0" />}
                        </React.Fragment>
                     ))}
                  </div>

                  <p className="text-xs text-neutral-400 font-medium italic border-t border-neutral-700 pt-4">
                     {combo.desc}
                  </p>
               </div>
             ))}
          </div>
        )}

        {/* RULES TAB */}
        {activeTab === 'RULES' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-neutral-800/50 p-6 rounded-[2.5rem] border theme-border text-center">
               <h3 className="text-lg font-black italic uppercase theme-text mb-2">Código de Conduta</h3>
               <p className="text-xs theme-text-muted leading-relaxed">
                 O basquete é governado por tempo e espaço. Domine as regras para usar o sistema a seu favor.
               </p>
            </div>

            {rulesData.map((section, idx) => (
              <div key={idx} className="theme-surface border theme-border rounded-[2rem] overflow-hidden shadow-lg">
                <div className="bg-neutral-900/50 p-4 border-b theme-border flex items-center gap-3">
                   <div className="p-2 bg-orange-600/20 rounded-lg text-orange-500">
                     <section.icon size={20} />
                   </div>
                   <h3 className="text-base font-black italic uppercase theme-text">{section.category}</h3>
                </div>
                <div className="p-2">
                  {section.rules.map((rule, rIdx) => (
                    <div key={rIdx} className="p-4 border-b border-neutral-800/50 last:border-0 hover:bg-white/5 transition-colors">
                       <h4 className="text-xs font-black uppercase theme-primary-text mb-1">{rule.name}</h4>
                       <p className="text-xs theme-text-muted font-medium leading-relaxed">{rule.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'HISTORY' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <div className="relative pl-6 border-l-2 border-neutral-800 space-y-8 py-4">
               {historyData.map((item, idx) => (
                 <div key={idx} className="relative group">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-neutral-900 border-2 border-orange-600 group-hover:scale-125 transition-transform"></div>
                    
                    <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest mb-1 block">{item.year}</span>
                    <div className="theme-surface border theme-border p-5 rounded-2xl shadow-lg group-hover:border-orange-500/50 transition-colors">
                       <h3 className="text-xl font-black italic uppercase theme-text mb-2 leading-none">{item.title}</h3>
                       <p className="text-xs theme-text-muted leading-relaxed">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-orange-600 to-red-600 rounded-[2rem] text-white shadow-2xl">
               <div className="flex items-center gap-4 mb-4">
                  <History size={24} className="text-white" />
                  <h3 className="font-black italic uppercase text-lg">Legado Contínuo</h3>
               </div>
               <p className="text-xs font-medium leading-relaxed opacity-90">
                 A história do basquete não acabou. A cada drible, a cada treino registrado no Núcleo Basquete, você escreve o próximo capítulo.
               </p>
            </div>
          </div>
        )}

        {/* MODELING TAB (Formerly IA Lab) */}
        {activeTab === 'MODEL' && (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-6 theme-surface p-6 rounded-[2.5rem] border theme-border">
              <h2 className="text-lg font-black italic uppercase theme-text mb-2 flex items-center gap-2">
                <BrainCircuit className="theme-primary-text" /> Modelagem de Jogo
              </h2>
              <p className="text-[10px] theme-text-muted font-black uppercase tracking-widest mb-4">
                Analise o estilo de qualquer jogador do mundo para moldar seu jogo
              </p>
              
              <div className="flex gap-2 mb-4">
                <div className="flex-1 bg-neutral-900 rounded-2xl border theme-border flex items-center px-4">
                  <Search size={18} className="theme-text-muted" />
                  <input 
                    className="bg-transparent border-none outline-none text-white text-sm font-bold p-3 w-full"
                    placeholder="Ex: Stephen Curry"
                    value={modelPlayer}
                    onChange={(e) => setModelPlayer(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => handleModeling()}
                  disabled={loading || !modelPlayer}
                  className="bg-white text-black w-14 rounded-2xl flex items-center justify-center disabled:opacity-50 hover:scale-105 transition-transform"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                </button>
              </div>
            </div>

            {modelResult && (
              <div className="theme-surface border-2 theme-border rounded-[3rem] overflow-hidden shadow-2xl relative">
                {modelResult.image && (
                  <div className="h-64 w-full relative">
                    <img src={modelResult.image} alt={modelResult.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-6">
                      <h2 className="text-4xl font-black italic text-white uppercase leading-none">{modelResult.name}</h2>
                      <p className="text-orange-500 text-xs font-black uppercase tracking-[0.3em]">{modelResult.nickname}</p>
                    </div>
                  </div>
                )}
                
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-900/50 p-4 rounded-2xl border border-white/5">
                      <p className="text-[8px] theme-text-muted uppercase font-black tracking-widest mb-1">Mentalidade</p>
                      <p className="text-sm font-bold theme-text leading-tight">{modelResult.mentality}</p>
                    </div>
                    <div className="bg-neutral-900/50 p-4 rounded-2xl border border-white/5">
                      <p className="text-[8px] theme-text-muted uppercase font-black tracking-widest mb-1">Movimento Chave</p>
                      <p className="text-sm font-bold theme-text leading-tight">{modelResult.keyMove}</p>
                    </div>
                  </div>

                  <div className="bg-orange-600 p-6 rounded-[2rem] shadow-lg shadow-orange-600/20">
                    <div className="flex justify-between items-center mb-2">
                       <h3 className="text-white font-black italic uppercase text-sm">Treino Recomendado</h3>
                       <Target size={18} className="text-white" />
                    </div>
                    <p className="text-orange-100 text-xs font-bold leading-relaxed">
                      {modelResult.trainingDrill}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 justify-center pt-2">
                    <Scale size={16} className="theme-text-muted" />
                    <span className="text-[10px] theme-text-muted font-black uppercase tracking-widest">Nível de Dificuldade: {modelResult.rating}/100</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Education;
