
import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Camera, CheckCircle, Loader2, ArrowLeft, Dribbble, Target, Shield, Zap, ChevronRight, CheckSquare, X } from 'lucide-react';
import { supabase } from '../services/supabase';
import { User, WorkoutSeries, Exercise } from '../types';
import NBLogo from './NBLogo';

interface TrainingSessionProps {
  user: User;
  goBack: () => void;
  onComplete: () => void;
}

const TrainingSession: React.FC<TrainingSessionProps> = ({ user, goBack, onComplete }) => {
  const [step, setStep] = useState<'INITIAL' | 'PHOTO' | 'SELECTOR' | 'WORKOUT_LIST' | 'SUCCESS'>('INITIAL');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState<WorkoutSeries | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const getWorkouts = (level: string): Record<string, WorkoutSeries> => {
    const isPro = level === 'Pro' || level === 'MVP';
    const isMVP = level === 'MVP';

    return {
      ARREMESSO: {
        id: 'ARREMESSO',
        category: 'FOCO: ARREMESSO',
        exercises: [
          { name: 'Arremesso de Molde', reps: '3 x 10', description: 'Mecânica pura a 1m do aro.' },
          { name: isPro ? 'Catch & Shoot Mid' : 'Arremesso Próximo', reps: '20 acertos', description: 'Finalização controlada.' },
          ...(isMVP ? [{ name: 'Step-back 3s', reps: '10 acertos', description: 'Criar separação e disparar.' }] : []),
          { name: isPro ? 'Corte + Arremesso' : 'Tabela e Aro', reps: '15 reps', description: 'Uso da tabela em movimento.' }
        ]
      },
      DRIBLE: {
        id: 'DRIBLE',
        category: 'FOCO: CONTROLE (GENJUTSU)',
        exercises: [
          { name: 'Pound Dribble', reps: '2 min cada mão', description: 'Força e controle de altura.' },
          { name: isPro ? 'Crossover + Entre Pernas' : 'Crossover Simples', reps: '50 reps', description: 'Mudança de direção.' },
          { name: isMVP ? 'Combos Estilo Kyrie' : 'Drible em V', reps: '3 min', description: 'Fluidez e criatividade.' }
        ]
      },
      DEFESA: {
        id: 'DEFESA',
        category: 'FOCO: LOCKDOWN (TAIJUTSU)',
        exercises: [
          { name: 'Slides Laterais', reps: '4 x 10m', description: 'Postura baixa e explosão.' },
          { name: isPro ? 'Closeout Explosivo' : 'Pés de Agilidade', reps: '12 reps', description: 'Recuperação defensiva.' },
          { name: 'Box Out e Rebote', reps: '15 reps', description: 'Proteção física do garrafão.' }
        ]
      }
    };
  };

  const academyWorkouts = getWorkouts(user.level);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  const startTraining = () => {
    setStep('PHOTO');
    startCamera();
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: { ideal: 'environment' } } 
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      alert("Câmera não disponível.");
      setStep('INITIAL');
    }
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        setPhoto(canvas.toDataURL('image/jpeg', 0.8));
        setStep('SELECTOR');
        if (stream) stream.getTracks().forEach(t => t.stop());
      }
    }
  };

  const finishWorkout = async () => {
    setLoading(true);
    try {
      const xpGain = 150;
      const newPoints = user.points + xpGain;
      const newWorkouts = user.totalWorkouts + 1;
      
      // Lógica de Level Up
      let newLevel = user.level;
      if (newWorkouts >= 50) newLevel = 'MVP';
      else if (newWorkouts >= 15) newLevel = 'Pro';

      const { error } = await supabase
        .from('profiles')
        .update({
          points: newPoints,
          total_workouts: newWorkouts,
          streak: user.streak + 1,
          level: newLevel
        })
        .eq('id', user.id);

      if (error) throw error;
      setStep('SUCCESS');
      setTimeout(onComplete, 2500);
    } catch (e) {
      console.error(e);
      alert("Erro ao registrar treino.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full theme-bg relative overflow-hidden">
      {/* Botão Voltar */}
      <button onClick={goBack} className="absolute top-6 left-6 theme-text z-20 p-3 theme-surface border-2 theme-border rounded-2xl shadow-xl active:scale-90 transition-transform">
        <ArrowLeft size={20} />
      </button>

      {step === 'INITIAL' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-500 relative">
          
          <div className="absolute top-0 right-0 opacity-[0.05] scale-150 pointer-events-none">
             <NBLogo size={300} />
          </div>

          <div className="mb-8 scale-110">
            <NBLogo size={80} />
          </div>
          
          <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 theme-text">CHECK-IN NB</h2>
          <p className="theme-text-muted mb-12 text-[10px] uppercase tracking-widest font-black max-w-[200px]">Valide sua presença na quadra para liberar sua série</p>
          <button onClick={startTraining} className="w-full max-w-xs theme-primary-bg text-white font-black py-6 rounded-[2.5rem] text-lg shadow-2xl uppercase italic active:scale-95 transition-all">ESTOU NA QUADRA</button>
        </div>
      )}

      {step === 'PHOTO' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 pt-20">
          <div className="w-full aspect-[3/4] theme-surface rounded-[2.5rem] overflow-hidden border-4 theme-border shadow-2xl relative">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            <div className="absolute inset-0 border-[20px] border-white/5 pointer-events-none"></div>
          </div>
          <button onClick={takePhoto} className="mt-10 w-24 h-24 bg-white rounded-full border-[12px] border-neutral-800 flex items-center justify-center shadow-2xl active:scale-90 transition-transform">
            <div className="w-12 h-12 theme-primary-bg rounded-full"></div>
          </button>
          <p className="mt-6 text-[10px] theme-text-muted font-black uppercase tracking-widest">Capture o momento do treino</p>
        </div>
      )}

      {step === 'SELECTOR' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-sm theme-surface border-2 theme-border rounded-[3rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-bottom-10 relative">
             <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <NBLogo size={64} />
             </div>
             <div className="flex justify-between items-start mb-6 mt-4">
                <div>
                   <h3 className="text-2xl font-black italic uppercase theme-text leading-tight">TREINO DE HOJE</h3>
                   <p className="text-[10px] theme-primary-text font-black uppercase tracking-widest mt-1">Série Nível: {user.level}</p>
                </div>
                <button onClick={() => setStep('INITIAL')} className="theme-text-muted hover:theme-text"><X size={20}/></button>
             </div>
             
             <div className="grid gap-3">
                {[
                  { id: 'ARREMESSO', icon: Target, color: 'bg-orange-600', label: 'Arremesso Técnico', desc: 'Precisão e Mecânica' },
                  { id: 'DRIBLE', icon: Zap, color: 'bg-blue-600', label: 'Handle Masters', desc: 'Controle e Fintas' },
                  { id: 'DEFESA', icon: Shield, color: 'bg-green-600', label: 'Lockdown Drill', desc: 'Físico e Reação' }
                ].map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => { setSelectedSeries(academyWorkouts[opt.id]); setStep('WORKOUT_LIST'); }}
                    className="theme-bg border-2 theme-border rounded-[1.5rem] p-5 flex items-center gap-4 shadow-lg active:scale-95 transition-all group hover:border-orange-500"
                  >
                     <div className={`w-12 h-12 ${opt.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                        <opt.icon size={24} />
                     </div>
                     <div className="text-left flex-1">
                        <h4 className="font-black italic uppercase theme-text leading-none text-sm">{opt.label}</h4>
                        <p className="text-[8px] theme-text-muted font-bold uppercase mt-1 tracking-widest">{opt.desc}</p>
                     </div>
                     <ChevronRight size={16} className="theme-text-muted group-hover:theme-primary-text" />
                  </button>
                ))}
             </div>
          </div>
        </div>
      )}

      {step === 'WORKOUT_LIST' && selectedSeries && (
        <div className="flex-1 flex flex-col p-6 pt-24 overflow-y-auto no-scrollbar animate-in fade-in duration-500">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 theme-primary-bg rounded-2xl flex items-center justify-center text-white shadow-xl rotate-3"><Dribbble size={28} /></div>
              <div>
                 <h3 className="text-2xl font-black italic uppercase theme-text leading-none">{selectedSeries.category}</h3>
                 <p className="text-[10px] theme-text-muted font-black uppercase tracking-widest mt-1">Status: Em Treinamento</p>
              </div>
           </div>

           <div className="space-y-4 mb-10">
              {selectedSeries.exercises.map((ex, i) => (
                <div key={i} className="theme-surface border theme-border rounded-[2rem] p-6 flex gap-5 hover:border-orange-500/50 transition-colors">
                   <div className="w-10 h-10 theme-bg border theme-border rounded-xl flex items-center justify-center text-[10px] font-black theme-text italic flex-shrink-0">#{i+1}</div>
                   <div className="flex-1">
                      <h4 className="font-black italic uppercase theme-text leading-none text-sm mb-1.5">{ex.name}</h4>
                      <p className="text-[9px] theme-primary-text font-black uppercase tracking-[0.2em] mb-3">{ex.reps}</p>
                      <p className="text-[10px] theme-text-muted font-medium italic leading-relaxed">{ex.description}</p>
                   </div>
                   <div className="flex items-center"><CheckSquare size={20} className="theme-text-muted" /></div>
                </div>
              ))}
           </div>

           <button 
            onClick={finishWorkout} 
            disabled={loading}
            className="w-full theme-primary-bg text-white font-black py-6 rounded-[2.5rem] shadow-2xl uppercase italic text-lg flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 mt-auto"
           >
             {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle size={24} /> CONCLUIR SÉRIE (+150 XP)</>}
           </button>
        </div>
      )}

      {step === 'SUCCESS' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-in zoom-in duration-500">
          <div className="w-32 h-32 bg-green-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(22,163,74,0.4)]">
            <CheckCircle size={64} className="text-white" />
          </div>
          <h2 className="text-5xl font-black italic uppercase theme-text leading-none tracking-tighter mb-4">MECÂNICA<br/>APRIMORADA!</h2>
          <div className="space-y-2 mb-10">
             <p className="text-green-500 font-black italic uppercase tracking-widest text-sm">+150 XP • SKILLS UP</p>
             <p className="text-orange-500 font-black italic uppercase text-xs">{user.streak + 1} DIAS DE FOGO 🔥</p>
          </div>
          <p className="theme-text-muted text-[10px] font-black uppercase tracking-[0.3em]">Sincronizando com o Panteão...</p>
        </div>
      )}
    </div>
  );
};

export default TrainingSession;
