
import React, { useState } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabase';
import { ArrowLeft, Check, Loader2, UserCircle } from 'lucide-react';

interface SettingsProps {
  user: User;
  onUpdate: () => void;
  goBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdate, goBack }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    city: user.city,
    goal: user.goal
  });

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);
      if (error) throw error;
      onUpdate();
      goBack();
    } catch (e) {
      alert("Erro ao atualizar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full theme-bg p-6 flex flex-col">
      <div className="flex items-center gap-4 mb-10 pt-6">
        <button onClick={goBack} className="theme-surface p-2 rounded-xl theme-border border">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-black italic uppercase theme-text">Personalizar</h1>
      </div>

      <div className="space-y-6 flex-1">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase theme-text-muted ml-2">Nome de Atleta</label>
          <input 
            className="w-full theme-surface theme-text theme-border border p-5 rounded-2xl font-bold outline-none focus:border-orange-500 transition-all"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase theme-text-muted ml-2">Cidade Base</label>
          <input 
            className="w-full theme-surface theme-text theme-border border p-5 rounded-2xl font-bold outline-none focus:border-orange-500 transition-all"
            value={formData.city}
            onChange={e => setFormData({...formData, city: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase theme-text-muted ml-2">Missão Principal</label>
          <select 
            className="w-full theme-surface theme-text theme-border border p-5 rounded-2xl font-bold outline-none appearance-none"
            value={formData.goal}
            onChange={e => setFormData({...formData, goal: e.target.value})}
          >
            <option>Profissionalizar</option>
            <option>Melhorar Fundamentos</option>
            <option>Lazer e Networking</option>
          </select>
        </div>
      </div>

      <button 
        onClick={handleUpdate}
        disabled={loading}
        className="w-full theme-primary-bg text-white py-6 rounded-3xl font-black italic uppercase shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
      >
        {loading ? <Loader2 className="animate-spin" /> : <>SALVAR ALTERAÇÕES <Check size={20} /></>}
      </button>
    </div>
  );
};

export default Settings;
