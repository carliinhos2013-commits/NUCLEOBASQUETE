
import React, { useState } from 'react';
import { User, AvatarSpecs } from '../types';
import { supabase } from '../services/supabase';
import { generatePlayerArt } from '../services/geminiService';
import { ArrowLeft, User as UserIcon, Palette, Globe, Ruler, Sparkles, Loader2, Save, RefreshCw } from 'lucide-react';
import NBLogo from './NBLogo';

interface AvatarCreatorProps {
  user: User;
  goBack: () => void;
  onUpdate: () => void;
}

const AvatarCreator: React.FC<AvatarCreatorProps> = ({ user, goBack, onUpdate }) => {
  const [specs, setSpecs] = useState<AvatarSpecs>(user.avatarSpecs || {
    skinTone: 'Light',
    hairStyle: 'Short Fade',
    jerseyColor: 'Orange',
    nationality: 'Brazilian',
    height: '180',
    weight: '75'
  });
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(user.avatar || null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const img = await generatePlayerArt(user.name, specs);
    if (img) {
      setGeneratedImage(img);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!generatedImage) return;
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          avatar: generatedImage,
          avatar_specs: specs // Salvando as especificações
        })
        .eq('id', user.id);

      if (error) throw error;
      
      onUpdate(); // Atualiza o contexto global
      goBack();
    } catch (e) {
      console.error(e);
      // Fallback para caso a coluna não exista, tenta salvar só o avatar
      try {
         await supabase.from('profiles').update({ avatar: generatedImage }).eq('id', user.id);
         onUpdate();
         goBack();
      } catch (err) {
         alert("Erro ao salvar avatar.");
      }
    } finally {
      setSaving(false);
    }
  };

  const colors = ['Orange', 'Black', 'White', 'Blue', 'Red', 'Purple', 'Green', 'Yellow'];
  const skinTones = ['Pale', 'Light', 'Tan', 'Brown', 'Dark Brown', 'Black'];

  return (
    <div className="h-full theme-bg flex flex-col pb-6 overflow-hidden relative">
      {/* Watermark Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none scale-[2]">
        <NBLogo size={400} />
      </div>

      {/* Header */}
      <div className="p-6 pt-12 flex items-center gap-4 sticky top-0 theme-bg z-10 border-b theme-border shadow-sm">
        <button onClick={goBack} className="theme-surface p-2 rounded-xl theme-border border shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-black italic uppercase theme-text tracking-tighter leading-none flex items-center gap-2">
            MyPlayer Lab
            <NBLogo size={24} />
          </h1>
          <p className="theme-text-muted text-[10px] font-bold uppercase tracking-widest mt-1">Crie sua Identidade Digital</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 relative z-10">
        
        {/* Preview Area */}
        <div className="flex justify-center">
          <div className="relative w-64 h-80 rounded-[3rem] theme-surface border-4 theme-border shadow-2xl overflow-hidden group">
            {loading ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 backdrop-blur-sm z-20">
                  <div className="relative">
                     <NBLogo size={64} className="animate-spin mb-4" />
                  </div>
                  <p className="text-[10px] font-black uppercase text-white tracking-widest animate-pulse">Gerando DNA...</p>
               </div>
            ) : generatedImage ? (
               <img src={generatedImage} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-neutral-700">
                  <UserIcon size={80} />
               </div>
            )}
            
            {/* Overlay Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-4 left-0 w-full text-center">
               <span className="bg-orange-600 px-3 py-1 rounded-full text-[8px] font-black uppercase text-white shadow-lg">Level {user.level}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
           
           {/* Physical Stats */}
           <div className="theme-surface p-5 rounded-[2rem] border theme-border">
              <div className="flex items-center gap-2 mb-4 text-theme-text">
                 <Ruler size={16} className="text-blue-500" />
                 <span className="font-black italic uppercase text-sm">Físico</span>
              </div>
              <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase theme-text-muted mb-1">
                       <span>Altura</span>
                       <span>{specs.height} cm</span>
                    </div>
                    <input 
                      type="range" min="150" max="230" 
                      value={specs.height} 
                      onChange={(e) => setSpecs({...specs, height: e.target.value})}
                      className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                 </div>
                 <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase theme-text-muted mb-1">
                       <span>Peso</span>
                       <span>{specs.weight} kg</span>
                    </div>
                    <input 
                      type="range" min="50" max="150" 
                      value={specs.weight} 
                      onChange={(e) => setSpecs({...specs, weight: e.target.value})}
                      className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                 </div>
              </div>
           </div>

           {/* Appearance */}
           <div className="theme-surface p-5 rounded-[2rem] border theme-border">
              <div className="flex items-center gap-2 mb-4 text-theme-text">
                 <Palette size={16} className="text-purple-500" />
                 <span className="font-black italic uppercase text-sm">Estilo</span>
              </div>
              
              <div className="space-y-4">
                 <div>
                    <span className="text-[10px] font-bold uppercase theme-text-muted block mb-2">Tom de Pele</span>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                       {skinTones.map(tone => (
                          <button 
                            key={tone}
                            onClick={() => setSpecs({...specs, skinTone: tone})}
                            className={`h-8 w-8 rounded-full border-2 flex-shrink-0 transition-all ${specs.skinTone === tone ? 'border-white scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: tone === 'Pale' ? '#f5e0d3' : tone === 'Light' ? '#eecfb4' : tone === 'Tan' ? '#dcb693' : tone === 'Brown' ? '#8d5524' : tone === 'Dark Brown' ? '#4f311c' : '#281e16' }}
                          />
                       ))}
                    </div>
                 </div>

                 <div>
                    <span className="text-[10px] font-bold uppercase theme-text-muted block mb-2">Cor do Uniforme</span>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                       {colors.map(color => (
                          <button 
                            key={color}
                            onClick={() => setSpecs({...specs, jerseyColor: color})}
                            className={`h-8 w-8 rounded-full border-2 flex-shrink-0 transition-all ${specs.jerseyColor === color ? 'border-white scale-110' : 'border-transparent'}`}
                            style={{ backgroundColor: color.toLowerCase() }}
                          />
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           {/* Identity */}
           <div className="theme-surface p-5 rounded-[2rem] border theme-border">
              <div className="flex items-center gap-2 mb-4 text-theme-text">
                 <Globe size={16} className="text-green-500" />
                 <span className="font-black italic uppercase text-sm">Origem</span>
              </div>
              <input 
                 type="text" 
                 placeholder="Nacionalidade (ex: Brasileiro, USA)"
                 value={specs.nationality}
                 onChange={(e) => setSpecs({...specs, nationality: e.target.value})}
                 className="w-full bg-neutral-900 border theme-border rounded-xl p-3 text-white text-sm font-bold outline-none focus:border-green-500"
              />
           </div>

        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 pt-4 border-t theme-border bg-neutral-900/95 backdrop-blur-sm">
        <div className="flex gap-3">
          <button 
             onClick={handleGenerate}
             disabled={loading}
             className="flex-1 bg-neutral-800 border theme-border text-white py-4 rounded-2xl font-black italic uppercase text-xs tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
             {loading ? <Loader2 className="animate-spin" /> : <RefreshCw size={16} />}
             GERAR PREVIEW
          </button>
          
          <button 
             onClick={handleSave}
             disabled={saving || !generatedImage}
             className="flex-1 theme-primary-bg text-white py-4 rounded-2xl font-black italic uppercase text-xs tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg disabled:opacity-50"
          >
             {saving ? <Loader2 className="animate-spin" /> : <Save size={16} />}
             SALVAR AVATAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarCreator;
