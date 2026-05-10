import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu } from 'lucide-react';
import avatarImg from '../assets/pic1.jpeg';

const Lanyard = () => {
  return (
    <div className="lanyard-standalone-wrapper relative flex justify-center items-start pt-6 md:pt-10 h-[300px] sm:h-[350px] md:h-[400px] pointer-events-none">
      <motion.div 
        className="relative group cursor-grab active:cursor-grabbing pointer-events-auto"
        animate={{ y: [-10, 10, -10], rotate: [-1, 1, -1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ y: -15, scale: 1.05, rotate: 0 }}
        style={{ transformOrigin: "top center" }}
      >
        {/* Thick Lanyard Strap */}
        <div className="absolute -top-[300px] sm:-top-[350px] md:-top-[400px] left-1/2 -translate-x-1/2 w-6 sm:w-8 md:w-12 h-[300px] sm:h-[350px] md:h-[400px] bg-highlight z-20 flex flex-col items-center justify-end pb-4 sm:pb-6 md:pb-8 overflow-hidden border-x border-white/5 shadow-[inset_0_4px_15px_rgba(0,0,0,0.5)]">
          {/* Subtle woven texture */}
          <div className="absolute inset-0 opacity-10 flex space-x-[1px] md:space-x-[2px] justify-center pointer-events-none">
            <div className="w-[1px] h-full bg-white"></div>
            <div className="w-[1px] h-full bg-white"></div>
            <div className="w-[1px] h-full bg-transparent mx-0.5"></div>
            <div className="w-[1px] h-full bg-white"></div>
            <div className="w-[1px] h-full bg-white"></div>
          </div>
          {/* Repeating Logos */}
          <div className="flex flex-col items-center space-y-8 sm:space-y-12 md:space-y-16 text-white/20 z-10 pointer-events-none">
            <Terminal size={10} className="sm:w-[12px] sm:h-[12px] md:w-[14px] md:h-[14px]" />
            <Cpu size={10} className="sm:w-[12px] sm:h-[12px] md:w-[14px] md:h-[14px]" />
            <Terminal size={10} className="sm:w-[12px] sm:h-[12px] md:w-[14px] md:h-[14px]" />
          </div>
        </div>
        
        {/* Lanyard Hardware / ID Clasp */}
        <div className="absolute -top-[35px] sm:-top-[45px] md:-top-[60px] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center drop-shadow-[0_8px_8px_rgba(0,0,0,0.25)] cursor-pointer pointer-events-none group-hover:-translate-y-1 transition-transform duration-300">
          {/* Strap Fold over the D-Ring */}
          <div className="w-6 sm:w-8 md:w-12 h-4 sm:h-5 md:h-7 bg-highlight rounded-b-[3px] md:rounded-b-[4px] shadow-md z-20 flex flex-col justify-end items-center pb-0.5 md:pb-1 border-b border-black/50">
            <div className="w-4 sm:w-5 md:w-8 h-[1px] bg-white/10 mb-[2px] md:mb-1"></div>
            <div className="w-4 sm:w-5 md:w-8 h-[1px] bg-white/10"></div>
          </div>
          
          {/* D-Ring Loop */}
          <div className="w-5 sm:w-6 md:w-9 h-4 sm:h-5 md:h-7 border-[2px] sm:border-[3px] md:border-[4px] border-[#222] rounded-b-[6px] sm:rounded-b-[8px] md:rounded-b-[12px] -mt-1.5 md:-mt-3 z-10 shadow-sm relative backdrop-blur-sm"></div>
          
          {/* Swivel Mechanism */}
          <div className="w-1.5 sm:w-2 md:w-3 h-3 sm:h-4 md:h-[18px] bg-gradient-to-b from-[#333] to-[#111] rounded-[1px] md:rounded-[2px] z-20 -mt-1 md:-mt-2 border border-[#444] relative shadow-md">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[1px] md:h-[2px] bg-[#1a1a1a] rounded-full"></div>
          </div>

          {/* Clasp Hook */}
          <div className="w-2.5 sm:w-3 md:w-[18px] h-5 sm:h-6 md:h-[35px] border-[2px] sm:border-[3px] md:border-[4px] border-[#222] rounded-b-[6px] sm:rounded-b-[8px] md:rounded-b-[10px] border-t-0 -mt-0.5 md:-mt-1 z-10 relative box-border">
            <div className="absolute right-[-2.5px] sm:right-[-3px] md:right-[-4px] top-1 w-[2.5px] sm:w-[3px] md:w-[4px] h-[55%] bg-[#2a2a2a] rounded-full border-l border-white/5"></div>
          </div>
        </div>

        {/* Decorative Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-gold/5 rounded-[1.5rem] md:rounded-[2rem] rotate-3 group-hover:rotate-6 transition-all duration-500 scale-95 md:scale-100 blur-[2px] opacity-80"></div>

        {/* The Main Card Container */}
        <div className="relative z-10 w-[160px] h-[220px] sm:w-[200px] sm:h-[280px] md:w-[280px] md:h-[360px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08),_0_0_30px_rgba(255,255,255,0.8)_inset] group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12),_0_0_25px_rgba(255,255,255,0.9)_inset] p-2 pt-6 sm:p-3 sm:pt-8 md:p-4 md:pt-12 transition-all duration-500">
          {/* The Punch Hole */}
          <div className="absolute top-2 sm:top-3 md:top-4 left-1/2 -translate-x-1/2 w-8 sm:w-10 md:w-14 h-1.5 sm:h-2 md:h-[10px] bg-black/10 rounded-full shadow-[inset_0_4px_6px_rgba(0,0,0,0.4),_0_1px_1px_rgba(255,255,255,0.9)] border border-black/5 z-20 pointer-events-none"></div>

          <div className="w-full h-full rounded-[1.2rem] md:rounded-[1.5rem] overflow-hidden relative bg-gray-50 flex items-center justify-center">
            <img
              src={avatarImg}
              alt="Avatar"
              className="w-full h-full object-cover filter drop-shadow-sm group-hover:scale-[1.05] transition-transform duration-700 origin-center"
            />
          </div>

          {/* Floating Badge */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 bg-gold/95 backdrop-blur-md text-white px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl shadow-lg z-30"
          >
            <span className="text-[10px] sm:text-xs md:text-sm font-black">99.9%</span>
            <span className="text-[6px] sm:text-[7px] md:text-[8px] ml-1 uppercase font-bold text-white/80 leading-tight">Uptime</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Lanyard;
