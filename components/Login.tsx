
import React, { useState } from 'react';
import { View } from '../types';
import { supabase } from '../services/supabase';
import { Loader2, AlertTriangle, Facebook, Chrome, Github, UserPlus, PlayCircle, Server } from 'lucide-react';
import NBLogo from './NBLogo';

interface LoginProps {
  setView: (view: View) => void;
  onTestLogin?: () => void;
}

const Login: React.FC<LoginProps> = ({ setView, onTestLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Erro ao entrar. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'facebook' | 'github') => {
    setError(null);
    setLoading(true);
    try {
      // Pega a URL atual do sistema (seja localhost ou produção/deploy)
      const currentUrl = window.location.origin;
      
      const { error } = await supabase.auth.signInWithOAuth({ 
        provider,
        options: {
          redirectTo: currentUrl,
          skipBrowserRedirect: false
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Erro OAuth:", err);
      setError(`Falha ao conectar com ${provider}. Verifique se a URL "${window.location.origin}" está autorizada no painel do Supabase (Authentication > URL Configuration).`);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-orange-900/10 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-orange-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="absolute top-8 right-8 flex gap-2 opacity-50">
        <div className="flex items-center gap-1 bg-neutral-900/50 px-3 py-1 rounded-full border border-neutral-800">
           <Server size={10} className="text-green-500" />
           <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">System Online</span>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        
        {/* NEW LOGO IMPLEMENTATION */}
        <div className="mb-8 scale-125 animate-in fade-in zoom-in duration-1000">
           <NBLogo size={120} />
        </div>
        
        <h1 className="text-3xl font-black text-white mb-2 tracking-tighter italic uppercase leading-none">
          SISTEMA<br/><span className="text-orange-600 drop-shadow-[0_0_15px_rgba(234,88,12,0.5)]">NÚCLEO</span>
        </h1>
        <p className="text-neutral-500 mb-10 text-[9px] font-bold uppercase tracking-[0.4em]">Gestão de Alta Performance</p>

        {error && (
          <div className="mb-6 w-full p-4 border rounded-2xl flex items-start gap-3 text-xs font-bold text-left animate-in fade-in slide-in-from-top-2 bg-red-950/30 border-red-500/30 text-red-400">
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-3 text-left w-full mb-6">
          <input 
            type="email" 
            placeholder="ID Corporativo ou Email" 
            className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 text-white outline-none focus:border-orange-600 focus:bg-neutral-900 transition-all font-medium text-sm placeholder-neutral-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Chave de Acesso" 
            className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 text-white outline-none focus:border-orange-600 focus:bg-neutral-900 transition-all font-medium text-sm placeholder-neutral-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.3)] flex items-center justify-center gap-2 uppercase italic transition-all active:scale-95 disabled:opacity-50 tracking-wider"
          >
            {loading ? <Loader2 className="animate-spin" /> : "ACESSAR SISTEMA"}
          </button>
        </form>

        {/* Start Fresh Button (Test Login) */}
        {onTestLogin && (
          <div className="w-full mb-6">
            <button 
              onClick={onTestLogin}
              className="w-full border border-white/10 hover:bg-white/5 py-3 px-4 rounded-xl flex items-center justify-center gap-3 group transition-all"
            >
              <PlayCircle size={18} className="text-neutral-400 group-hover:text-orange-500 transition-colors" />
              <span className="text-xs font-black text-neutral-400 group-hover:text-white uppercase tracking-widest">
                Modo Visitante / Teste
              </span>
            </button>
          </div>
        )}

        <div className="w-full space-y-4">
          <div className="flex items-center gap-4 py-2 opacity-50">
            <div className="h-[1px] bg-neutral-800 flex-1"></div>
            <span className="text-neutral-600 text-[8px] font-black uppercase tracking-widest">Integração Externa</span>
            <div className="h-[1px] bg-neutral-800 flex-1"></div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => handleOAuthLogin('google')}
              className="flex flex-col items-center justify-center gap-1 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-white p-3 rounded-xl transition-all active:scale-95 group"
            >
              <Chrome size={18} className="group-hover:text-orange-500 transition-colors" />
              <span className="text-[8px] font-black uppercase tracking-wider">Google</span>
            </button>
            <button 
              onClick={() => handleOAuthLogin('facebook')}
              className="flex flex-col items-center justify-center gap-1 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-white p-3 rounded-xl transition-all active:scale-95 group"
            >
              <Facebook size={18} className="group-hover:text-orange-500 transition-colors" />
              <span className="text-[8px] font-black uppercase tracking-wider">Facebook</span>
            </button>
            <button 
              onClick={() => handleOAuthLogin('github')}
              className="flex flex-col items-center justify-center gap-1 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-white p-3 rounded-xl transition-all active:scale-95 group"
            >
              <Github size={18} className="group-hover:text-orange-500 transition-colors" />
              <span className="text-[8px] font-black uppercase tracking-wider">GitHub</span>
            </button>
          </div>

          <div className="mt-8">
            <button 
              onClick={() => setView(View.SIGNUP)}
              className="text-neutral-500 text-[10px] font-bold hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <UserPlus size={14} />
              NOVO ATLETA? <span className="text-orange-500 border-b border-orange-500">CADASTRAR PERFIL</span>
            </button>
          </div>
        </div>
        
        <div className="mt-8 opacity-30">
           <p className="text-[7px] text-neutral-600 uppercase tracking-[0.3em]">System v2.4.0 • Secure Connection</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
