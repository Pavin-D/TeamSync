import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const TeamSyncLandingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to login after 3 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-xy">
      <style>
        {`
          @keyframes gradient-xy {
            0%, 100% {
              background-size: 400% 400%;
              background-position: left center;
            }
            50% {
              background-size: 200% 200%;
              background-position: right center;
            }
          }
          .animate-gradient-xy {
            animation: gradient-xy 3s ease infinite;
          }
        `}
      </style>
      
      <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-1000">
        <h1 
          className="text-7xl sm:text-9xl font-black text-white tracking-tighter drop-shadow-2xl"
          style={{ fontFamily: "'Montserrat', 'Inter', sans-serif" }}
        >
          TeamSync
        </h1>
      </div>
    </div>
  );
};
