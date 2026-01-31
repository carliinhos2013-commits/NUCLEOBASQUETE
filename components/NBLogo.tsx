
import React from 'react';

interface NBLogoProps {
  size?: number;
  className?: string;
}

const NBLogo: React.FC<NBLogoProps> = ({ size = 64, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Background Glow Contextual */}
      <div className="absolute inset-0 bg-orange-600/20 blur-2xl rounded-full animate-pulse pointer-events-none"></div>
      
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="relative z-10 w-full h-full drop-shadow-[0_0_8px_rgba(234,88,12,0.6)]"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* NÚCLEO (BOLA DE BASQUETE) - Centralizado Perfeitamente em 50,50 */}
        <g transform="translate(50 50)">
          <circle cx="0" cy="0" r="14" fill="#ea580c" className="opacity-90" />
          <circle cx="0" cy="0" r="14" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.2" />
          
          {/* Linhas da Bola */}
          <path d="M-14 0 Q 0 -8 14 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M0 -14 L 0 14" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M-8 -10 Q -4 0 -8 10" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 -10 Q 4 0 8 10" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* ORBITAS (ELÉTRONS) - Reduzidas para não cortar (rx=38) */}
        {/* Simetria 0º, 60º, 120º */}
        <g stroke="#ea580c" strokeWidth="2" strokeLinecap="round" className="opacity-90">
           {/* Órbita Horizontal */}
           <ellipse cx="50" cy="50" rx="38" ry="12" transform="rotate(0 50 50)" />
           {/* Órbita Diagonal 1 */}
           <ellipse cx="50" cy="50" rx="38" ry="12" transform="rotate(60 50 50)" />
           {/* Órbita Diagonal 2 */}
           <ellipse cx="50" cy="50" rx="38" ry="12" transform="rotate(120 50 50)" />
        </g>
        
        {/* Partícula na órbita para dar movimento */}
        <circle cx="88" cy="50" r="2.5" fill="#fff" className="animate-ping" style={{animationDuration: '3s'}} />
      </svg>
    </div>
  );
};

export default NBLogo;
