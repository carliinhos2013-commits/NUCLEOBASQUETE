
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ArrowLeft, Sparkles, Loader2, Play, AlertCircle, Info } from 'lucide-react';

const VisionBoard: React.FC<{ goBack: () => void }> = ({ goBack }) => {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState('');

  const loadingMessages = [
    "Analisando biomecânica de elite...",
    "Calibrando o arco do arremesso...",
    "Renderizando visão de campeão...",
    "Calculando trajetória perfeita...",
    "Sincronizando com o Núcleo Basquete..."
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setGenerating(true);
    setError(null);
    setVideoUrl(null);
    
    try {
      // Regra: Verificar se existe chave de API selecionada
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
        // Após abrir o diálogo, prosseguimos assumindo que a chave está disponível via process.env.API_KEY
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let msgIndex = 0;
      const interval = setInterval(() => {
        setStatusMsg(loadingMessages[msgIndex % loadingMessages.length]);
        msgIndex++;
      }, 3000);

      setStatusMsg(loadingMessages[0]);

      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `High quality cinematic basketball highlight, close up shot, professional lighting: ${prompt}`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '9:16'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({operation: operation});
      }

      clearInterval(interval);
      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      
      if (downloadLink) {
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      } else {
        throw new Error("Vídeo não pôde ser gerado.");
      }

    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setError("Erro na chave de API. Por favor, selecione novamente.");
        await (window as any).aistudio.openSelectKey();
      } else {
        setError("Não conseguimos processar sua visão agora. Tente novamente.");
      }
    } finally {
      setGenerating(false);
      setStatusMsg('');
    }
  };

  return (
    <div className="h-full theme-bg overflow-y-auto pb-24 no-scrollbar">
      <div className="p-6 pt-12 flex items-center gap-4 sticky top-0 theme-bg z-10 border-b theme-border shadow-sm">
        <button onClick={goBack} className="theme-surface p-2 rounded-xl theme-border border shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black italic uppercase theme-text tracking-tighter leading-none">Vision Board</h1>
          <p className="theme-text-muted text-[10px] font-bold uppercase tracking-widest mt-1">Mentalize o sucesso</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="theme-surface border-2 theme-border rounded-[2.5rem] p-6 shadow-xl">
          <div className="flex items-start gap-3 mb-6 bg-indigo-600/10 p-4 rounded-2xl border border-indigo-500/20">
             <Info size={18} className="text-indigo-400 mt-0.5 flex-shrink-0" />
             <p className="text-[10px] text-indigo-200 font-bold uppercase leading-relaxed">
               Descreva uma jogada perfeita para nossa IA gerar. A visualização é o primeiro passo para a execução de elite.
             </p>
          </div>

          <div className="space-y-4">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Arremesso de 3 pontos do canto caindo seco na rede..."
              className="w-full bg-neutral-900 border theme-border rounded-2xl p-5 theme-text font-bold text-sm min-h-[120px] outline-none focus:border-indigo-500 transition-all resize-none"
            />
            
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase px-2">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={generating || !prompt.trim()}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black italic uppercase text-xs tracking-widest flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20"
            >
              {generating ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
              {generating ? "GERANDO VISÃO..." : "MATERIALIZAR JOGADA"}
            </button>
          </div>
        </div>

        <div className="relative aspect-[9/16] w-full max-w-[300px] mx-auto bg-neutral-900 rounded-[2.5rem] border-4 theme-border overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center p-8">
          {generating ? (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
                <Loader2 size={32} className="text-indigo-500 animate-spin" />
              </div>
              <p className="text-xs font-black italic uppercase text-white animate-pulse">{statusMsg}</p>
              <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Isso pode levar até 2 minutos</p>
            </div>
          ) : videoUrl ? (
            <video 
              src={videoUrl} 
              autoPlay 
              loop 
              controls 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="opacity-30">
              <Play size={64} className="mx-auto mb-4 text-neutral-700" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Aguardando sua<br/>primeira visão</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
           <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-[9px] text-neutral-500 underline uppercase font-bold">Documentação de Faturamento Gemini</a>
        </div>
      </div>
    </div>
  );
};

export default VisionBoard;
