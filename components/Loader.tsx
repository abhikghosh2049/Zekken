import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="text-center p-8 flex flex-col justify-center items-center space-y-6">
      <div className="w-full max-w-sm h-24 overflow-hidden relative bg-zinc-800/50 rounded-lg">
        {/* Road Surface */}
        <div className="absolute bottom-0 left-0 w-full h-10 bg-zinc-700"></div>

        {/* Road lines moving */}
        <div 
          className="absolute bottom-8 left-0 w-full h-1"
          style={{
            backgroundImage: 'linear-gradient(to right, #a1a1aa 25%, transparent 25%)', // zinc-400
            backgroundSize: '80px 100%',
            animation: 'road-lines 0.15s linear infinite',
          }}
        ></div>
        
        {/* Car driving */}
        <div 
          className="absolute bottom-1.5 left-0"
          style={{ animation: 'drive 1.5s ease-in-out infinite' }}
        >
          <svg className="w-40 h-auto" viewBox="0 0 120 45" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Car body, which will have the bounce animation */}
              <g style={{ animation: 'subtle-bounce 0.4s ease-in-out infinite' }}>
                  {/* Main Body */}
                  <path d="M113 21H7C5.89543 21 5 21.8954 5 23V31C5 32.1046 5.89543 33 7 33H113C114.105 33 115 32.1046 115 31V23C115 21.8954 114.105 21 113 21Z" fill="#DC2626"/>
                  <path d="M116 29.5L113.5 22.5C113 21.5 112 21 111 21H89L82 14H38L31 21H9C8 21 7 21.5 6.5 22.5L4 29.5H116Z" fill="#B91C1C"/>
                  
                  {/* Windows */}
                  <path d="M79 15L87 21H33L41 15H79Z" fill="#111827"/>
                  <path d="M78 16.5L85.5 21H34.5L42 16.5H78Z" fill="#374151"/>
                  
                  {/* Spoiler */}
                  <path d="M4 25H9V27H4V25Z" fill="#111827"/>
                  
                  {/* Lights */}
                  <rect x="111" y="24" width="5" height="3" fill="#FBBF24" rx="1"/>
                  <rect x="4" y="24" width="5" height="3" fill="#F87171" rx="1"/>
              </g>
              
              {/* Wheels - separate for spinning */}
              <g className="wheel" style={{ transformOrigin: '24px 33px' }}>
                  <circle cx="24" cy="33" r="9" fill="#111827"/>
                  <circle cx="24" cy="33" r="6" fill="#4B5563"/>
                  <path d="M24 28.5V37.5M28.2426 29.7574L19.7574 38.2426M28.2426 36.2426L19.7574 27.7574" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="24" cy="33" r="2" fill="#111827"/>
              </g>
              <g className="wheel" style={{ transformOrigin: '96px 33px' }}>
                  <circle cx="96" cy="33" r="9" fill="#111827"/>
                  <circle cx="96" cy="33" r="6" fill="#4B5563"/>
                  <path d="M96 28.5V37.5M100.243 29.7574L91.7574 38.2426M100.243 36.2426L91.7574 27.7574" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="96" cy="33" r="2" fill="#111827"/>
              </g>
          </svg>
        </div>
      </div>
      
      <div>
        <p className="mt-4 text-zinc-400 text-lg">Zekken is analyzing the routes...</p>
        <p className="text-zinc-500 text-sm">Finding you the best ride, just a moment!</p>
      </div>
    </div>
  );
};