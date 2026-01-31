
import React, { useState } from 'react';
import { View } from '../types';
import { supabase } from '../services/supabase';
import { ArrowLeft, Loader2, AlertCircle, Mail, CheckCircle2, ChevronRight } from 'lucide-react';

interface SignupProps {
  onComplete: () => void;
  goBack: () => void;
}

const Signup: React.FC<SignupProps> = ({ onComplete, goBack }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    city: '',
    goal: 'Profissionalizar'
  });

  const next = () => {
    setError(null);
    if (step === 1 && (!formData.name || !formData.email)) {
      setError("Preencha nome e email para continuar.");
      return;
    }
    if (step === 2 && (!formData.city || !formData.age)) {
      setError("Preencha cidade e idade.");
      return;
    }
    setStep(s => s + 1);
  };

  const prev = () => (step === 1 ? goBack() : setStep(s => s - 1));

  const handleSignup = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum)) throw new Error("A idade deve ser um número.");

      // 1. Registro no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Criação do Perfil
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: authData.user.id,
          name: formData.name,
          age: ageNum,
          city: formData.city,
          goal: formData.goal,
          points: 0,
          streak: 0,
          total_workouts: 0,
          level: 'Novato'
        });

        if (profileError) {
          console.error("Erro ao salvar perfil:", profileError);
        }
        
        // Se o e-mail não precisar de confirmação (configuração no Supabase), authData.session existirá
        if (authData.session) {
          onComplete();
        } else {
          setNeedsEmailConfirmation(true);
        }
      }
    } catch (err: any) {
      setError(err.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  if (needsEmailConfirmation) {
    return (
      <div className="h-screen w-full bg-neutral-900 p-8 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-orange-600 blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative w-24 h-24 bg-orange-600/10 border border-orange-500/30 rounded-full flex items-center justify-center">
            <Mail size={48} className="text-orange-500" />
          </div>
        </div>
        
        <h2 className="text-4xl font-black italic uppercase text-white mb-4 tracking-tighter leading-none">
          VERIFIQUE SEU<br/><span className="text-orange-500">E-MAIL</span>
        </h2>
        
        <p className="text-neutral-400 mb-8 max-w-xs text-sm">
          Enviamos um link de ativação para <strong className="text-white">{formData.email}</strong>.<br/><br/>
          <span className="text-[10px] uppercase tracking-widest text-neutral-500">
            Dica: Se quiser entrar direto sem validar e-mail, desative "Confirm Email" nas configurações de Auth do seu Supabase.
          </span>
        </p>
        
        <button 
          onClick={goBack} 
          className="w-full bg-white text-black font-black py-5 rounded-2xl uppercase italic flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-95 transition-all shadow-2xl"
        >
          VOLTAR AO LOGIN <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-neutral-900 p-8 flex flex-col justify-center relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full"></div>
      
      <button onClick={prev} className="absolute top-12 left-8 text-neutral-500 hover:text-white flex items-center gap-2 font-black uppercase text-[10px] tracking-widest z-20 transition-colors">
        <ArrowLeft size={16} /> Voltar
      </button>

      <div className="mb-12 relative z-10">
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.4)]' : 'bg-neutral-800'}`}></div>
          ))}
        </div>
        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-[0.9] animate-in slide-in-from-left duration-300">
          {step === 1 && "Seu acesso\ne nome"}
          {step === 2 && "Sua origem\ne idade"}
          {step === 3 && "Sua missão"}
          {step === 4 && "Defina sua\nsenha"}
        </h2>
      </div>

      <div className="space-y-6 relative z-10">
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <input type="text" placeholder="Nome Completo" className="w-full bg-neutral-800 border border-neutral-700 rounded-2xl p-6 text-white outline-none focus:border-orange-500 font-bold transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input type="email" placeholder="Email" className="w-full bg-neutral-800 border border-neutral-700 rounded-2xl p-6 text-white outline-none focus:border-orange-500 font-bold transition-all" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <input type="text" placeholder="Cidade" className="w-full bg-neutral-800 border border-neutral-700 rounded-2xl p-6 text-white outline-none focus:border-orange-500 font-bold transition-all" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            <input type="number" placeholder="Idade" className="w-full bg-neutral-800 border border-neutral-700 rounded-2xl p-6 text-white outline-none focus:border-orange-500 font-bold transition-all" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-3 animate-in fade-in slide-in-from-bottom-4">
            {['Profissionalizar', 'Melhorar Fundamentos', 'Lazer'].map(g => (
              <button 
                key={g} 
                onClick={() => setFormData({...formData, goal: g})} 
                className={`p-6 rounded-2xl border text-left font-black italic uppercase text-sm transition-all ${
                  formData.goal === g ? 'bg-orange-600 border-orange-400 text-white shadow-xl translate-x-1' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-500'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <input type="password" placeholder="Senha Mestra" className="w-full bg-neutral-800 border border-neutral-700 rounded-2xl p-6 text-white outline-none focus:border-orange-500 font-bold transition-all" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
        )}

        <button 
          onClick={step === 4 ? handleSignup : next} 
          disabled={loading} 
          className="w-full bg-white text-black font-black py-6 rounded-2xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all uppercase italic text-lg disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : step === 4 ? "CRIAR CONTA PRO" : "PRÓXIMO PASSO"}
        </button>
      </div>
    </div>
  );
};

export default Signup;
