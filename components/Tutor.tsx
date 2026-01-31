import React, { useState, useRef, useEffect } from 'react';
import { getTutorAdvice } from '../services/geminiService';
import { Send, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';

const Tutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'E aí, atleta! Sou seu Tutor NB. Quer dicas sobre arremesso, defesa ou tática hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Prepare history
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await getTutorAdvice(userMsg.text, history);

    const modelMsg: ChatMessage = { 
      id: (Date.now() + 1).toString(), 
      role: 'model', 
      text: response.text 
    };

    setMessages(prev => [...prev, modelMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 pb-20">
      <div className="p-4 bg-neutral-900 border-b border-neutral-800 shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white">Coach NB</h2>
            <p className="text-xs text-green-500 flex items-center gap-1">● Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
              msg.role === 'user' 
                ? 'bg-orange-600 text-white rounded-br-none' 
                : 'bg-neutral-800 text-neutral-200 rounded-bl-none border border-neutral-700'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-neutral-800 p-4 rounded-2xl rounded-bl-none flex gap-2 items-center">
              <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-neutral-900 border-t border-neutral-800">
        <div className="flex gap-2 items-center bg-neutral-800 p-2 rounded-full border border-neutral-700 focus-within:border-orange-500 transition-colors">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte sobre treinos..."
            className="flex-1 bg-transparent px-4 text-white focus:outline-none placeholder-neutral-500"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-neutral-700"
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutor;