import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { PetSpecies } from '@/src/types';
import { Utensils, Bath, Gamepad2, Sparkles as SparkleIcon, BookOpen, Moon, Map, Wind, Sparkles, Zap } from 'lucide-react';

interface PetDisplayProps {
  species: PetSpecies;
  stage: 'baby' | 'child' | 'teen' | 'adult' | 'legendary' | 'mythical' | 'celestial' | 'sanctuary' | 'eternal';
  happiness: number;
  energy: number;
  hygiene: number;
  isThinking?: boolean;
  message?: string;
  activeAction?: 'feeding' | 'cleaning' | 'playing' | 'studying' | 'sleeping' | 'adventure' | 'meditation' | 'magic' | 'skill' | null;
  isEvolving?: boolean;
  level?: number;
}

const getSlimeStageConfig = (level: number = 1) => {
  if (level <= 20) {
    return {
      name: '初级史莱姆',
      color: 'bg-gradient-to-b from-sky-300 to-sky-500', 
      radius: 'rounded-[50%_50%_45%_45%/60%_60%_40%_40%]',
      border: 'border-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.5)]',
      element: null,
      customFace: (isHungry: boolean, isVeryHappy: boolean, activeAction: any, happiness: number) => {
        return (
          <div className="flex flex-col items-center gap-2 select-none relative z-10 scale-95">
            {/* Eyes: cute crossed eyes ✕ ✕ */}
            <div className="flex gap-7">
              <span className="font-sans font-black text-[#1a2e3b] text-xl select-none leading-none animate-pulse">✕</span>
              <span className="font-sans font-black text-[#1a2e3b] text-xl select-none leading-none animate-pulse">✕</span>
            </div>
            {/* Blushes */}
            <div className="flex justify-between w-full px-2 absolute top-1 pointer-events-none">
              <div className="w-4 h-2 bg-rose-400/60 rounded-full blur-[1px]" />
              <div className="w-4 h-2 bg-rose-400/60 rounded-full blur-[1px]" />
            </div>
            {/* Cute W Mouth SVG */}
            <div className="mt-1">
              <svg className="w-6 h-3 text-[#1a2e3b]" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M 4,3 Q 8,9 12,3 Q 16,9 20,3" />
              </svg>
            </div>
          </div>
        );
      }
    };
  } else if (level <= 35) {
    return {
      name: '水雾',
      color: 'bg-gradient-to-b from-[#B2EBF2]/80 via-[#00ACC1]/85 to-[#00838F]/95 backdrop-blur-md',
      radius: 'rounded-[50%_50%_40%_40%/60%_60%_40%_40%]',
      border: 'border-[#E0F7FA]/70 shadow-[0_0_30px_rgba(38,198,218,0.85)]',
      element: (
        <div className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
          {/* Left Horn */}
          <div className="absolute -top-5 left-[15%] w-5 h-7 bg-gradient-to-t from-[#00ACC1] to-white rounded-[70%_30%_30%_10%/100%_40%_60%_10%] rotate-[-20deg] shadow-[0_0_12px_#B2EBF2]" />
          {/* Right Horn */}
          <div className="absolute -top-5 right-[15%] w-5 h-7 bg-gradient-to-t from-[#00ACC1] to-white rounded-[30%_70%_10%_30%/40%_100%_10%_60%] rotate-[20deg] shadow-[0_0_12px_#B2EBF2]" />
          
          <motion.div 
            animate={{ y: [-10, 10, -10], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-white/20 blur-[6px] rounded-full"
          />
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/40 rounded-full blur-[1px]" />
          <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-white/30 rounded-full blur-[2px]" />
        </div>
      ),
      customFace: (isHungry: boolean, isVeryHappy: boolean, activeAction: any, happiness: number) => {
        return (
          <div className="flex flex-col items-center gap-3 select-none relative z-10 scale-95">
            {/* Eyes: Glowing White-Aqua vertical ovals */}
            <div className="flex gap-6 relative">
              <div className="w-3.5 h-6 bg-white rounded-full shadow-[0_0_12px_#ffffff]" />
              <div className="w-3.5 h-6 bg-white rounded-full shadow-[0_0_12px_#ffffff]" />
            </div>
            {/* Blushes */}
            <div className="flex justify-between w-full px-1 absolute top-1 pointer-events-none">
              <div className="w-4 h-2 bg-cyan-300/40 rounded-full blur-[1.5px]" />
              <div className="w-4 h-2 bg-cyan-300/40 rounded-full blur-[1.5px]" />
            </div>
            {/* Happy wave mouth */}
            <svg className="w-5 h-3.5 text-white/95" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M 6,3 Q 12,8 18,3" />
            </svg>
          </div>
        );
      }
    };
  } else if (level <= 45) {
    return {
      name: '燃珠',
      color: 'bg-gradient-to-b from-[#FFEE58] via-[#FFCA28] to-[#EF6C00]',
      radius: 'rounded-full', 
      border: 'border-yellow-200 shadow-[0_0_35px_rgba(255,167,38,0.85)]',
      element: (
        <div className="absolute inset-0 rounded-[inherit] pointer-events-none">
          {/* Forehead Stripe */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[70px] h-6 border-t-4 border-x-4 border-white/50 rounded-t-lg" />
          
          {/* Candle Wick Stack */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
            {/* Wick stem */}
            <div className="w-1.5 h-4 bg-amber-900 rounded-full" />
            {/* Flame */}
            <motion.div 
              animate={{ scale: [1, 1.25, 1], y: [0, -1.5, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-4 h-6 bg-gradient-to-t from-red-500 via-orange-400 to-yellow-200 rounded-full shadow-[0_0_20px_rgba(253,216,53,1)] -mt-1.5"
            />
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 bg-yellow-300 blur-[2px] rounded-full opacity-70 flex items-center justify-center border-4 border-amber-400 border-dashed"
            />
          </div>
        </div>
      ),
      customFace: (isHungry: boolean, isVeryHappy: boolean, activeAction: any, happiness: number) => {
        return (
          <div className="flex flex-col items-center gap-3 select-none relative z-10 scale-95">
            {/* Glowing vertical gold ovals */}
            <div className="flex gap-6 relative">
              <div className="w-3.5 h-6 bg-white rounded-full border border-yellow-200 shadow-[0_0_12px_#FFF59D]" />
              <div className="w-3.5 h-6 bg-white rounded-full border border-yellow-200 shadow-[0_0_12px_#FFF59D]" />
            </div>
            {/* Cute blushing cheeks */}
            <div className="flex justify-between w-full px-1 absolute top-[30%] pointer-events-none">
              <div className="w-4 h-3 bg-amber-400/40 rounded-full blur-[1px]" />
              <div className="w-4 h-3 bg-amber-400/40 rounded-full blur-[1px]" />
            </div>
            {/* Gentle smile */}
            <div className="w-5 h-2.5 border-b-3 border-amber-950 rounded-b-full bg-transparent" />
          </div>
        );
      }
    };
  } else if (level <= 55) {
    return {
      name: '熔岩',
      color: 'bg-gradient-to-b from-[#E64A19] via-[#BF360C] to-[#210400]',
      radius: 'rounded-[48%_48%_44%_44%/55%_55%_45%_45%]',
      border: 'border-[#FF7043] shadow-[0_0_35px_rgba(230,74,25,0.9)]',
      element: (
        <div className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
          {/* Devil Horns */}
          <div className="absolute -top-5 left-[20%] w-5 h-8 bg-gradient-to-t from-[#FF3D00] to-[#FFEA00] rounded-[70%_30%_30%_10%/100%_40%_60%_10%] rotate-[-25deg] shadow-[0_0_12px_#FF8F00]" />
          <div className="absolute -top-5 right-[20%] w-5 h-8 bg-gradient-to-t from-[#FF3D00] to-[#FFEA00] rounded-[30%_70%_10%_30%/40%_100%_10%_60%] rotate-[25deg] shadow-[0_0_12px_#FF8F00]" />

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-1/2 flex flex-col gap-1.5 opacity-80">
            <motion.div 
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-2 w-full bg-red-600 rounded-full blur-[1px]"
            />
            <motion.div 
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-1.5 w-4/5 mx-auto bg-orange-500 rounded-full blur-[1px]"
            />
          </div>
        </div>
      ),
      customFace: (isHungry: boolean, isVeryHappy: boolean, activeAction: any, happiness: number) => {
        return (
          <div className="flex flex-col items-center gap-3 select-none relative z-10 scale-95">
            {/* Glowing golden ovals */}
            <div className="flex gap-6 relative">
              <div className="w-3.5 h-6 bg-[#FFFF33] rounded-full shadow-[0_0_15px_#FFEA00]" />
              <div className="w-3.5 h-6 bg-[#FFFF33] rounded-full shadow-[0_0_15px_#FFEA00]" />
            </div>
            {/* Happy flaming lava smile */}
            <div className="w-6 h-3 border-b-3 border-[#FFFF33] rounded-b-full bg-transparent" />
          </div>
        );
      }
    };
  } else if (level <= 65) {
    return {
      name: '冰晶史',
      color: 'bg-gradient-to-b from-[#E0F7FA] via-[#4DD0E1] to-[#0288D1]',
      radius: 'rounded-[45%_45%_45%_45%/50%_50%_50%_50%]',
      border: 'border-white shadow-[0_0_25px_rgba(77,208,225,0.8)]',
      element: (
        <div className="absolute inset-0 pointer-events-none">
          {/* Spiky Ice Crown */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-end gap-0.5 z-10">
            <div className="w-3.5 h-6 bg-gradient-to-t from-[#B2EBF2] to-white rounded-t-full rotate-[-15deg] border-b border-[#00BCD4]/30" />
            <div className="w-4 h-8 bg-gradient-to-t from-[#B2EBF2] to-white rounded-t-full z-10 border-b border-[#00BCD4]/30" />
            <div className="w-3.5 h-6 bg-gradient-to-t from-[#B2EBF2] to-white rounded-t-full rotate-[15deg] border-b border-[#00BCD4]/30" />
          </div>

          {/* Snowflake tattoos */}
          <div className="absolute left-2.5 top-1/2 text-[10px] text-white/80 select-none font-sans">❄️</div>
          <div className="absolute right-2.5 top-1/2 text-[10px] text-white/80 select-none font-sans">❄️</div>

          <motion.div 
            animate={{ x: [-100, 200] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent rotate-[30deg] pointer-events-none skew-x-12"
          />
        </div>
      ),
      customFace: (isHungry: boolean, isVeryHappy: boolean, activeAction: any, happiness: number) => {
        return (
          <div className="flex flex-col items-center gap-2.5 select-none relative z-10 scale-95">
            {/* Surprised eyes */}
            <div className="flex gap-5 relative">
              <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
              <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
            </div>
            {/* Shocked cute O mouth */}
            <div className="w-3.5 h-3.5 bg-[#E0F7FA]/60 border-2 border-white rounded-full shadow-inner animate-pulse" />
          </div>
        );
      }
    };
  } else if (level <= 75) {
    return {
      name: '风刃',
      color: 'bg-gradient-to-b from-[#E0F2F1] via-[#26A69A] to-[#004D40]',
      radius: 'rounded-[60%_60%_40%_40%/50%_50%_50%_50%]',
      border: 'border-[#80CBC4] shadow-[0_0_25px_rgba(38,166,154,0.8)]',
      element: (
        <div className="absolute inset-0 pointer-events-none">
          {/* Flowing Wind Cloud Hair / Tail on top-back */}
          <div className="absolute -top-12 -right-8 w-20 h-20 bg-gradient-to-br from-[#80CBC4] to-[#26A69A]/40 rounded-full blur-[1px] opacity-80 rotate-45 -z-10" style={{ borderRadius: '100% 0 100% 100%' }}>
            <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="w-full h-full border-t-4 border-r-4 border-white/40 rounded-[inherit]" />
          </div>
          <div className="absolute -top-8 -left-2 w-12 h-12 bg-gradient-to-br from-[#80CBC4] to-[#26A69A]/40 rounded-full blur-[1px] opacity-70 -rotate-45 -z-10" style={{ borderRadius: '0 100% 100% 100%' }} />

          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-4 border-2 border-dashed border-emerald-300/60 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-2 border border-dotted border-white/50 rounded-full"
          />
        </div>
      ),
      customFace: (isHungry: boolean, isVeryHappy: boolean, activeAction: any, happiness: number) => {
        return (
          <div className="flex flex-col items-center gap-3 select-none relative z-10 scale-95">
            {/* Glowing mint-white ovals */}
            <div className="flex gap-6 relative">
              <div className="w-3.5 h-5 bg-white rounded-full shadow-[0_0_10px_#B2DFDB]" />
              <div className="w-3.5 h-5 bg-white rounded-full shadow-[0_0_10px_#B2DFDB]" />
            </div>
            {/* Peaceful curves */}
            <div className="w-5 h-2 border-b-2.5 border-teal-950 rounded-b-full bg-transparent" />
          </div>
        );
      }
    };
  } else if (level <= 85) {
    return {
      name: '幽紫史',
      color: 'bg-gradient-to-b from-[#BA68C8] via-[#7B1FA2] to-[#311B92]',
      radius: 'rounded-[50%_50%_45%_45%/60%_60%_40%_40%]',
      border: 'border-[#E1BEE7] shadow-[0_0_35px_rgba(123,31,162,0.95)]',
      element: (
        <div className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none p-2">
          {/* Forehead stripes */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[68px] h-6 border-t-4 border-x-4 border-white/30 rounded-t-lg" />

          {/* Lit Candle Wick stack */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
            {/* Wick stem */}
            <div className="w-1.5 h-4 bg-purple-950 rounded-full" />
            {/* Flame */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1], y: [0, -1.5, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-4 h-6 bg-gradient-to-t from-[#9C27B0] via-[#E040FB] to-[#F3E5F5] rounded-full shadow-[0_0_18px_rgba(224,64,251,1)] -mt-1.5"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-fuchsia-500/20 to-transparent" />
          {[1, 2, 3].map(i => (
            <motion.div 
              key={i}
              animate={{ 
                y: [10, -20, 10], 
                x: [Math.random() * 20, Math.random() * -20, Math.random() * 20],
                opacity: [0.2, 0.8, 0.2]
              }}
              transition={{ duration: 2 + i, repeat: Infinity }}
              className="absolute w-2.5 h-2.5 bg-fuchsia-300 rounded-full blur-[0.5px]"
              style={{
                top: `${30 + i * 15}%`,
                left: `${15 + i * 20}%`
              }}
            />
          ))}
        </div>
      ),
      customFace: (isHungry: boolean, isVeryHappy: boolean, activeAction: any, happiness: number) => {
        return (
          <div className="flex flex-col items-center gap-3 select-none relative z-10 scale-95">
            {/* Cosmic purple glowing oval eyes */}
            <div className="flex gap-6 relative">
              <div className="w-3.5 h-6 bg-[#E1BEE7] rounded-full border border-fuchsia-300 shadow-[0_0_12px_#DA70D6]" />
              <div className="w-3.5 h-6 bg-[#E1BEE7] rounded-full border border-fuchsia-300 shadow-[0_0_12px_#DA70D6]" />
            </div>
            {/* Mystic soft curve */}
            <div className="w-5 h-2.5 border-b-2.5 border-fuchsia-100 rounded-b-full bg-transparent" />
          </div>
        );
      }
    };
  } else if (level <= 95) {
    return {
      name: '花叶史',
      color: 'bg-gradient-to-b from-[#C8E6C9] via-[#4CAF50] to-[#1B5E20]',
      radius: 'rounded-[46%_46%_48%_48%/50%_50%_50%_50%]',
      border: 'border-[#A5D6A7] shadow-[0_0_30px_rgba(76,175,80,0.85)]',
      element: (
        <div className="absolute inset-0 pointer-events-none">
          {/* Big blooming sunset flower crown on head */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="relative w-12 h-12 flex items-center justify-center"
            >
              {[0, 60, 120, 180, 240, 300].map(deg => (
                <div 
                  key={deg}
                  className="absolute w-5 h-8 bg-gradient-to-b from-[#FF5722] to-[#FF8A65] rounded-full opacity-90 border-t border-white origin-center shadow-md"
                  style={{ transform: `rotate(${deg}deg) translateY(-8px)` }}
                />
              ))}
              <div className="absolute w-5 h-5 bg-[#FFEB3B] rounded-full shadow-[0_0_10px_#FFF59D] z-10" />
            </motion.div>
          </div>

          {/* Green leaves base */}
          <div className="absolute -top-2 left-[25%] w-6 h-4 bg-[#81C784] rounded-t-full rotate-[-25deg] border-t border-white/40" />
          <div className="absolute -top-2 right-[25%] w-6 h-4 bg-[#81C784] rounded-t-full rotate-[25deg] border-t border-white/40" />

          <div className="absolute bottom-2 right-1 w-5 h-5 bg-emerald-500 rounded-[0px_10px_0px_10px] border border-white rotate-[15deg]" />
          <div className="absolute bottom-2 left-1/2 -translate-x-2.5 w-5 h-5 bg-emerald-500 rounded-[10px_0px_10px_0px] border border-white rotate-[-15deg]" />
        </div>
      ),
      customFace: (isHungry: boolean, isVeryHappy: boolean, activeAction: any, happiness: number) => {
        return (
          <div className="flex flex-col items-center gap-3 select-none relative z-10 scale-95">
            {/* Vibrant orange bordered ovals */}
            <div className="flex gap-6 relative">
              <div className="w-4 h-6 bg-white rounded-full border-2 border-[#FF5722] shadow-[0_0_12px_#FF8A65]" />
              <div className="w-4 h-6 bg-white rounded-full border-2 border-[#FF5722] shadow-[0_0_12px_#FF8A65]" />
            </div>
            {/* Blushes */}
            <div className="flex justify-between w-full px-1 absolute top-[40%] pointer-events-none">
              <div className="w-3.5 h-1.5 bg-[#FF5722]/30 rounded-full blur-[0.5px]" />
              <div className="w-3.5 h-1.5 bg-[#FF5722]/30 rounded-full blur-[0.5px]" />
            </div>
            {/* Curve mouth */}
            <div className="w-5 h-3 border-b-3 border-[#FF5722] rounded-b-full bg-white/20" />
          </div>
        );
      }
    };
  } else {
    return {
      name: '巨型综合体',
      color: 'bg-gradient-to-br from-[#F06292] via-[#E11D48] to-[#3B82F6]',
      radius: 'rounded-[50%_50%_42%_42%/65%_65%_35%_35%]',
      border: 'border-[#F87171] shadow-[0_0_40px_rgba(244,63,94,1),_0_0_20px_rgba(251,191,36,0.85)]',
      element: (
        <div className="absolute inset-0 pointer-events-none">
          {/* Left Butterfly Wing in Magenta-Purple */}
          <motion.div 
            animate={{ rotateY: [0, 45, 0], x: [0, -2, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-16 top-[15%] w-16 h-20 bg-gradient-to-r from-[#D81B60]/85 to-[#8E24AA]/50 origin-right rounded-[100%_10%_100%_40%/80%_10%_100%_40%] -z-10 shadow-[0_0_15px_rgba(216,27,96,0.5)]"
          />
          {/* Right Butterfly Wing in Magenta-Purple */}
          <motion.div 
            animate={{ rotateY: [0, -45, 0], x: [0, 2, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-16 top-[15%] w-16 h-20 bg-gradient-to-l from-[#D81B60]/85 to-[#8E24AA]/50 origin-left rounded-[10%_100%_40%_100%/10%_80%_40%_100%] -z-10 shadow-[0_0_15px_rgba(216,27,96,0.5)]"
          />

          {/* Antennas & Golden crown headpiece */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
            {/* Crown */}
            <div className="flex gap-0.5 justify-center items-end -mb-1">
              <div className="w-2.5 h-4 bg-gradient-to-t from-yellow-600 to-yellow-300 rounded-t-full rotate-[-15deg]" />
              <div className="w-3 h-6 bg-gradient-to-t from-yellow-600 to-yellow-300 rounded-t-full z-10" />
              <div className="w-2.5 h-4 bg-gradient-to-t from-yellow-600 to-yellow-300 rounded-t-full rotate-[15deg]" />
            </div>
            {/* Two curly golden antennas */}
            <div className="absolute -top-8 left-[-15px] w-6 h-8 border-r-4 border-t-4 border-yellow-400 rounded-tr-full origin-bottom-right rotate-[-15deg]">
              <div className="absolute -top-2.5 -left-1 w-3 h-3 bg-yellow-300 rounded-full shadow-[0_0_10px_#ffffff]" />
            </div>
            <div className="absolute -top-8 right-[-15px] w-6 h-8 border-l-4 border-t-4 border-yellow-400 rounded-tl-full origin-bottom-left rotate-[15deg]">
              <div className="absolute -top-2.5 -right-1 w-3 h-3 bg-yellow-300 rounded-full shadow-[0_0_10px_#ffffff]" />
            </div>
          </div>

          {/* Saturn Orbital Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-8 border-4 border-purple-500/20 rounded-full -z-5 pointer-events-none"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-12 border border-dashed border-sky-400/40 rounded-full -z-5 pointer-events-none"
          />

          {/* Left Fluffy Cloud */}
          <div className="absolute -bottom-3 -left-14 w-16 h-8 bg-white/90 rounded-full shadow-md z-10 filter blur-[0.2px] flex items-center justify-center">
            <div className="absolute -top-2 left-3 w-8 h-8 bg-white rounded-full" />
            <div className="absolute -top-1.5 right-3 w-6 h-6 bg-white rounded-full" />
          </div>
          {/* Right Fluffy Cloud */}
          <div className="absolute -bottom-3 -right-14 w-16 h-8 bg-white/90 rounded-full shadow-md z-10 filter blur-[0.2px] flex items-center justify-center">
            <div className="absolute -top-2 right-3 w-8 h-8 bg-white rounded-full" />
            <div className="absolute -top-1.5 left-3 w-6 h-6 bg-white rounded-full" />
          </div>

          {[1, 2, 3, 4].map(i => (
            <motion.div
              key={i}
              animate={{
                scale: [0.6, 1.2, 0.6],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{ duration: 1.5 + i * 0.5, repeat: Infinity }}
              className="absolute w-3 h-3 bg-white rounded-full blur-[0.5px]"
              style={{
                top: `${20 + i * 15}%`,
                right: `${15 + (i%2) * 40}%`
              }}
            />
          ))}
        </div>
      ),
      customFace: (isHungry: boolean, isVeryHappy: boolean, activeAction: any, happiness: number) => {
        return (
          <div className="flex flex-col items-center gap-2.5 select-none relative z-15 scale-95">
            {/* Chimera mismatched eye colors matching user image details! */}
            <div className="flex gap-7 relative">
              {/* Left eye: pitch deep dark glass */}
              <div className="w-4 h-6 bg-slate-900 rounded-full relative shadow-inner border border-rose-300">
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full" />
              </div>
              {/* Right eye: glowing bright crimson neon fire */}
              <div className="w-4 h-6 bg-gradient-to-b from-[#FF1744] to-[#B71C1C] rounded-full relative shadow-[0_0_15px_#FF1744] border border-white/60">
                <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>
            {/* Blushes */}
            <div className="flex justify-between w-full px-1 absolute top-[40%] pointer-events-none">
              <div className="w-4 h-2 bg-rose-400/50 rounded-full blur-[1px]" />
              <div className="w-4 h-2 bg-rose-400/50 rounded-full blur-[1px]" />
            </div>
            {/* Cute fanged smiling mouth */}
            <div className="w-9 h-4 bg-slate-900 relative rounded-b-full overflow-hidden flex justify-center border-b border-rose-400/60 shadow-lg mt-0.5">
              <div className="absolute -top-0.5 left-1.5 w-1.5 h-2 bg-white" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />
              <div className="absolute -top-0.5 right-1.5 w-1.5 h-2 bg-white" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} />
            </div>
          </div>
        );
      }
    };
  }
};

const getCatStageConfig = (level: number = 1) => {
  if (level <= 20) {
    return {
      name: '喵喵',
      pokemonId: 52,
      color: 'bg-gradient-to-b from-[#FFFDF0] via-[#FFF9C4] to-[#FFE082]',
      radius: 'rounded-[1.5rem]',
      border: 'border-[#FFB300] shadow-[0_0_20px_rgba(255,179,0,0.5)]',
      element: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          {/* Sassy floating coins */}
          <motion.div 
            animate={{ y: [0, -6, 0] }} 
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} 
            className="absolute top-2 right-4 text-sm"
          >
            🪙
          </motion.div>
          <motion.div 
            animate={{ y: [0, -8, 0] }} 
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} 
            className="absolute bottom-4 left-4 text-sm"
          >
            🪙
          </motion.div>
        </div>
      )
    };
  } else if (level <= 35) {
    return {
      name: '猫大佬',
      pokemonId: 53,
      color: 'bg-gradient-to-b from-[#FFFDE7] via-[#FFF59D] to-[#FFF176]',
      radius: 'rounded-[2rem]',
      border: 'border-[#FFF176] shadow-[0_0_30px_rgba(255,241,118,0.6)]',
      element: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          {/* Glowing ruby crown vibe */}
          <div className="absolute top-1/2 left-3 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
          <div className="absolute top-3 right-3 text-lg animate-pulse">✨</div>
        </div>
      )
    };
  } else if (level <= 45) {
    return {
      name: '阿罗拉喵喵',
      pokemonId: 10103, // Alolan Vulpix styling matching user image 6
      color: 'bg-gradient-to-b from-[#E0F7FA] via-[#B2EBF2] to-[#80DEEA]',
      radius: 'rounded-[2.5rem]',
      border: 'border-[#4DD0E1] shadow-[0_0_35px_rgba(77,208,225,0.7)]',
      element: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          {/* Whimsical drifting snow flakes */}
          <div className="absolute top-3 left-4 text-sm animate-bounce text-cyan-400">❄️</div>
          <div className="absolute bottom-4 right-4 text-sm animate-pulse text-cyan-200">❄️</div>
        </div>
      )
    };
  } else if (level <= 55) {
    return {
      name: '伽勒尔喵喵 (钢钢)',
      pokemonId: 10161,
      color: 'bg-gradient-to-b from-[#90A4AE] via-[#607D8B] to-[#37474F]',
      radius: 'rounded-[1.75rem]',
      border: 'border-[#B0BEC5] shadow-[0_0_25px_rgba(144,164,174,0.6)]',
      element: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          {/* Iron spikes / screws */}
          <div className="absolute top-3 left-3 text-sm opacity-50">🔩</div>
          <div className="absolute bottom-3 right-3 text-sm opacity-50">🔩</div>
        </div>
      )
    };
  } else if (level <= 65) {
    return {
      name: '喵头目 (狂战士)',
      pokemonId: 863,
      color: 'bg-gradient-to-b from-[#455A64] via-[#37474F] to-[#212121]',
      radius: 'rounded-[1.85rem]',
      border: 'border-[#78909C] shadow-[0_0_35px_rgba(33,33,33,0.9)]',
      element: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] bg-red-950/15">
          {/* Viking steel axes */}
          <div className="absolute -top-1 left-2 text-xl drop-shadow">⚔️</div>
          <div className="absolute -top-1 right-2 text-xl drop-shadow">⚔️</div>
        </div>
      )
    };
  } else if (level <= 75) {
    return {
      name: '超极巨·万金猫',
      pokemonId: 892, // Urshifu style image 7
      color: 'bg-gradient-to-b from-[#FFF59D] via-[#FBC02D] to-[#E65100]',
      radius: 'rounded-[2.85rem]',
      border: 'border-[#FFA726] shadow-[0_0_45px_rgba(251,192,45,0.85)]',
      element: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          {/* Dynamic boxing and wealth cloud aura */}
          <motion.div 
            animate={{ rotate: -360 }} 
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} 
            className="absolute -inset-8 border-4 border-dashed border-red-500/20 rounded-full"
          />
          <div className="absolute top-3 left-4 text-xl">🥋</div>
          <div className="absolute bottom-3 right-4 text-xl animate-bounce">👊</div>
        </div>
      )
    };
  } else if (level <= 85) {
    return {
      name: '雷冥猫 (透视金瞳)',
      pokemonId: 405, // Luxray match image 2
      color: 'bg-gradient-to-b from-[#1A237E] via-[#0D47A1] to-[#121212]',
      radius: 'rounded-[2.25rem]',
      border: 'border-[#448AFF] shadow-[0_0_40px_rgba(68,138,255,0.85)]',
      element: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          {/* Neon electric particles */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-yellow-400 animate-pulse text-lg">⚡</div>
          <motion.div 
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 border-2 border-cyan-400/20 rounded-[inherit]"
          />
          <div className="absolute bottom-2 left-4 text-[8px] font-mono text-cyan-300 tracking-wider">瞳术·透视金瞳</div>
        </div>
      )
    };
  } else if (level <= 95) {
    return {
      name: '帝白金狮 (赫利奥斯)',
      pokemonId: 791, // Solgaleo match image 8
      color: 'bg-gradient-to-b from-[#FFFFFF] via-[#ECEFF1] to-[#B0BEC5]',
      radius: 'rounded-[3rem]',
      border: 'border-[#FFA000] shadow-[0_0_50px_rgba(255,160,0,0.95)]',
      element: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          {/* Sun solar flares */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl opacity-15">🌞</div>
          <div className="absolute bottom-3 left-4 text-sm animate-pulse">🦁</div>
          <div className="absolute top-3 right-4 text-xs font-black text-amber-600">HELIOS</div>
        </div>
      )
    };
  } else {
    return {
      name: '黄昏之鬃·奈克洛兹玛 (天光终焉)',
      pokemonId: 10155, // Dusk Mane Necrozma match image 1
      color: 'bg-gradient-to-br from-[#121212] via-[#212121] to-[#000000]',
      radius: 'rounded-[2.5rem]',
      border: 'border-[#E11D48] shadow-[0_0_55px_rgba(240,98,146,0.6),_0_0_30px_rgba(225,29,72,0.4)]',
      element: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          {/* Dark stars & neon solar flare outline */}
          <div className="absolute top-2 left-3 text-lg animate-ping text-[#F06292]">🌟</div>
          <div className="absolute bottom-3 right-4 text-[9px] font-mono font-black text-rose-500 tracking-wider">天光终焉</div>
        </div>
      )
    };
  }
};

const getRobotStageConfig = (level: number = 1) => {
  // 1-20级：旋律雏机 (初始态)
  if (level <= 20) {
    return {
      name: '旋律雏机 (初始态)',
      image: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/479.png',
      color: 'bg-gradient-to-b from-[#ECEFF1] via-[#D1C4E9] to-[#9575CD]',
      radius: 'rounded-[3rem]',
      border: 'border-[#673AB7] shadow-[0_0_20px_rgba(103,58,183,0.35)]',
      element: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          {/* Subtle audio pulses */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.7, 0.35], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-4 bg-purple-400/10 rounded-full blur-xl -z-10"
          />
          <span className="absolute bottom-3 left-4 text-xs">🔈</span>
          <span className="absolute bottom-3 right-4 text-xs">🔊</span>
        </div>
      )
    };
  }
  // 21-35级：萌动鸣姬 (成长期)
  else if (level <= 35) {
    return {
      name: '萌动鸣姬 (成长期)',
      image: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/648.png',
      color: 'bg-gradient-to-b from-[#E1F5FE] via-[#B2EBF2] to-[#4DD0E1]',
      radius: 'rounded-[3.2rem]',
      border: 'border-[#00ACC1] shadow-[0_0_25px_rgba(0,172,193,0.45)]',
      element: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          <motion.span
            animate={{ y: [0, -15, 0], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-2 left-6 text-lg"
          >
            🎵
          </motion.span>
          <motion.span
            animate={{ y: [0, -20, 0], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1, ease: 'easeInOut' }}
            className="absolute top-4 right-8 text-lg"
          >
            💿
          </motion.span>
        </div>
      )
    };
  }
  // 36-45级：节奏浪客 (滑行态)
  else if (level <= 45) {
    return {
      name: '节奏浪客 (滑行态)',
      image: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/807.png',
      color: 'bg-gradient-to-b from-[#004D40] via-[#00796B] to-[#009688]',
      radius: 'rounded-[2.8rem]',
      border: 'border-[#009688] shadow-[0_0_30px_rgba(0,150,136,0.55)]',
      element: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          {/* Cyber surfing wind effects */}
          <div className="absolute bottom-2 left-1/4 right-1/4 h-1 bg-cyan-300 rounded-full blur-[1px]" />
          <motion.div
            animate={{ x: [-8, 8, -8], scaleX: [1, 1.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-4 left-6 text-sm"
          >
            💨
          </motion.div>
        </div>
      )
    };
  }
  // 46-55级：混奏极客 (DJ武装)
  else if (level <= 55) {
    return {
      name: '混奏极客 (DJ武装)',
      image: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/849.png',
      color: 'bg-gradient-to-b from-[#1A237E] via-[#311B92] to-[#4A148C]',
      radius: 'rounded-[2.4rem]',
      border: 'border-[#BA68C8] shadow-[0_0_35px_rgba(186,104,200,0.65)]',
      element: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          {/* Neon equalizers and lasers */}
          <motion.div
            animate={{ opacity: [0.15, 0.75, 0.15] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute top-0 left-12 w-[2px] h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent rotate-[15deg] blur-[0.5px]"
          />
          <motion.div
            animate={{ opacity: [0.1, 0.65, 0.1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute top-0 right-12 w-[2px] h-full bg-gradient-to-b from-transparent via-pink-400 to-transparent -rotate-[15deg] blur-[0.5px]"
          />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-purple-300 font-mono tracking-widest whitespace-nowrap">DJ GEAR UP</div>
        </div>
      )
    };
  }
  // 56-65级：震天重炮 (重音尊)
  else if (level <= 65) {
    return {
      name: '震天重炮 (重音尊)',
      image: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/649.png',
      color: 'bg-gradient-to-b from-[#212121] via-[#1E3A8A] to-[#3B82F6]',
      radius: 'rounded-[2rem]',
      border: 'border-[#3B82F6] shadow-[0_0_40px_rgba(59,130,246,0.7)]',
      element: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          {/* Subwoofer Bass Blast Rings */}
          <motion.div
            animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeOut' }}
            className="absolute top-6 left-6 w-10 h-10 border-2 border-cyan-300 rounded-full blur-[1px]"
          />
          <motion.div
            animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.3, ease: 'easeOut' }}
            className="absolute top-6 right-6 w-10 h-10 border-2 border-cyan-300 rounded-full blur-[1px]"
          />
        </div>
      )
    };
  }
  // 66-75级：暴风琴羽 (极光流)
  else if (level <= 75) {
    return {
      name: '暴风琴羽 (极光流)',
      image: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/1008.png',
      color: 'bg-gradient-to-b from-[#006064] via-[#0097A7] to-[#80DEEA]',
      radius: 'rounded-[1.6rem]',
      border: 'border-[#4DD0E1] shadow-[0_0_45px_rgba(77,208,225,0.85)]',
      element: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          {/* Equalizer Wave Visualizer Bars */}
          <div className="absolute bottom-2 left-6 right-6 flex justify-between h-5 items-end gap-0.5">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: [3, Math.random() * 15 + 4, 3] }}
                transition={{ duration: 0.4 + Math.random() * 0.4, repeat: Infinity }}
                className="w-1 bg-cyan-300/50 rounded-t-xs"
              />
            ))}
          </div>
        </div>
      )
    };
  }
  // 76-85级:天籁绝音 (神圣姬)
  else if (level <= 85) {
    return {
      name: '天籁绝音 (神圣姬)',
      image: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/801.png',
      color: 'bg-gradient-to-b from-[#FCE4EC] via-[#F8BBD0] to-[#E91E63]',
      radius: 'rounded-[3.8rem]',
      border: 'border-[#E91E63] shadow-[0_0_50px_rgba(233,30,99,0.75)]',
      element: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          {/* Angelic stars and halo */}
          <motion.div
            animate={{ y: [-3, 3, -3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-2 left-1/4 right-1/4 h-2 bg-yellow-300/40 rounded-full blur-[2px]"
          />
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-4 left-4 text-xs"
          >
            ✨
          </motion.span>
          <motion.span
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4], delay: 1 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-4 right-4 text-xs"
          >
            ✨
          </motion.span>
        </div>
      )
    };
  }
  // 86-95级：寰宇天乐尊 (神皇）
  else if (level <= 95) {
    return {
      name: '寰宇天乐尊 (神皇)',
      image: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/493.png',
      color: 'bg-gradient-to-b from-[#0D47A1] via-[#1A237E] to-[#4A148C]',
      radius: 'rounded-[50%/35%_35%_48%_48%]',
      border: 'border-[#FFD54F] shadow-[0_0_55px_rgba(255,213,79,0.95),_0_0_20px_rgba(255,213,79,0.4)]',
      element: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          {/* Space nebulae and cosmic glitter */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/5 border-dashed rounded-full -z-10"
          />
        </div>
      )
    };
  }
  // 96-100级：禅宗琴梵神 (终焉造物主)
  else {
    return {
      name: '禅宗琴梵神 (终焉造物主)',
      image: 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/10156.png',
      color: 'bg-gradient-to-b from-[#212121] via-[#EDC435] to-[#FFE082]',
      radius: 'rounded-[12rem_12rem_6rem_6rem/8rem_8rem_5rem_5rem]',
      border: 'border-[#FFB300] shadow-[0_0_65px_rgba(255,179,0,1)] ring-4 ring-[#FFD54F]/20',
      element: (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          {/* God Aura and rotating circles */}
          <motion.div
            animate={{ scale: [0.98, 1.12, 0.98], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-yellow-400/10 rounded-[inherit] blur-2xl"
          />
          <span className="absolute top-2 left-1/2 -translate-x-1/2 text-sm drop-shadow-[0_0_10px_gold]">🌟 无上绝伦 🌟</span>
        </div>
      )
    };
  }
};

export const PetDisplay: React.FC<PetDisplayProps> = ({ 
  species, 
  stage, 
  happiness, 
  energy,
  hygiene,
  isThinking, 
  message, 
  activeAction,
  isEvolving,
  level = 1
}) => {
  const isHungry = energy < 30;
  const isDirty = hygiene < 30;
  const isVeryHappy = happiness > 85;

  const config = {
    baby: { size: 'w-28 h-28', eyes: 'w-2.5 h-2.5', blush: 'w-3 h-1.5' },
    child: { size: 'w-36 h-36', eyes: 'w-3.5 h-3.5', blush: 'w-4 h-2' },
    teen: { size: 'w-44 h-44', eyes: 'w-4.5 h-4.5', blush: 'w-5 h-2.5' },
    adult: { size: 'w-52 h-52', eyes: 'w-5.5 h-5.5', blush: 'w-6 h-3' },
    legendary: { size: 'w-64 h-64', eyes: 'w-6.5 h-6.5', blush: 'w-8 h-4' },
    mythical: { size: 'w-80 h-80', eyes: 'w-8 h-8', blush: 'w-10 h-5' },
    celestial: { size: 'w-80 h-80', eyes: 'w-8 h-8', blush: 'w-10 h-5' },
    sanctuary: { size: 'w-80 h-80', eyes: 'w-8 h-8', blush: 'w-10 h-5' },
    eternal: { size: 'w-80 h-80', eyes: 'w-8 h-8', blush: 'w-10 h-5' },
  };

  const speciesConfig = {
    slime: { 
      color: 'bg-gradient-to-b from-sky-300 to-sky-500', 
      radius: 'rounded-[50%_50%_45%_45%/60%_60%_40%_40%]',
      border: 'border-sky-200'
    },
    dragon: { 
      color: 'bg-gradient-to-b from-rose-300 to-rose-500', 
      radius: 'rounded-[45%_45%_50%_50%/50%_50%_50%_50%]',
      border: 'border-rose-200'
    },
    cat: { 
      color: 'bg-gradient-to-b from-amber-300 to-amber-500', 
      radius: 'rounded-[48%_48%_45%_45%/55%_55%_45%_45%]',
      border: 'border-amber-200'
    },
    robot: { 
      color: 'bg-gradient-to-b from-slate-300 to-slate-500', 
      radius: 'rounded-3xl',
      border: 'border-slate-200'
    },
    rabbit: { 
      color: 'bg-gradient-to-b from-pink-100 to-pink-300', 
      radius: 'rounded-[50%_50%_45%_45%/60%_60%_40%_40%]',
      border: 'border-pink-50'
    },
    panda: { 
      color: 'bg-gradient-to-b from-slate-50 to-slate-200', 
      radius: 'rounded-[48%_48%_45%_45%/55%_55%_45%_45%]',
      border: 'border-slate-300'
    },
    frog: { 
      color: 'bg-gradient-to-b from-green-300 to-green-500', 
      radius: 'rounded-[55%_55%_45%_45%/50%_50%_50%_50%]',
      border: 'border-green-200'
    },
    pig: { 
      color: 'bg-gradient-to-b from-pink-200 to-pink-400', 
      radius: 'rounded-[50%_50%_48%_48%/55%_55%_45%_45%]',
      border: 'border-pink-100'
    },
    tiger: { 
      color: 'bg-gradient-to-b from-orange-300 to-orange-500', 
      radius: 'rounded-[48%_48%_45%_45%/55%_55%_45%_45%]',
      border: 'border-orange-200'
    },
    elephant: { 
      color: 'bg-gradient-to-b from-blue-100 to-blue-300', 
      radius: 'rounded-[50%_50%_45%_45%/55%_55%_45%_45%]',
      border: 'border-blue-50'
    },
    dinosaur: { 
      color: 'bg-gradient-to-b from-emerald-300 to-emerald-500', 
      radius: 'rounded-[45%_45%_50%_50%/50%_50%_50%_50%]',
      border: 'border-emerald-200'
    },
    fox: { 
      color: 'bg-gradient-to-b from-orange-400 to-orange-600', 
      radius: 'rounded-[48%_48%_45%_45%/55%_55%_45%_45%]',
      border: 'border-orange-300'
    },
    penguin: { 
      color: 'bg-gradient-to-b from-slate-700 to-slate-900', 
      radius: 'rounded-[50%_50%_45%_45%/65%_65%_35%_35%]',
      border: 'border-slate-600'
    },
    lion: { 
      color: 'bg-gradient-to-b from-yellow-500 to-yellow-700', 
      radius: 'rounded-[48%_48%_45%_45%/55%_55%_45%_45%]',
      border: 'border-yellow-400'
    },
    bulbasaur: { color: 'bg-[#E0F2F1]', radius: 'rounded-full', border: 'border-[#4DB6AC]' },
    charmander: { color: 'bg-[#FFF3E0]', radius: 'rounded-full', border: 'border-[#FFB74D]' },
    squirtle: { color: 'bg-[#E3F2FD]', radius: 'rounded-full', border: 'border-[#64B5F6]' },
    pikachu: { color: 'bg-[#FFFDE7]', radius: 'rounded-full', border: 'border-[#FFF176]' },
    pichu: { color: 'bg-[#FFFDE7]', radius: 'rounded-full', border: 'border-[#FFF4B3]' },
    xuanjia_nine: { color: 'bg-[#ECEFF1]', radius: 'rounded-2xl', border: 'border-[#B0BEC5]' },
    raichu: { color: 'bg-[#FFF3E0]', radius: 'rounded-full', border: 'border-[#FFB74D]' },
    wanleizun: { color: 'bg-[#FFFDE7]', radius: 'rounded-2xl', border: 'border-[#FFF176]' },
    leizhu: { color: 'bg-[#FFFDE7]', radius: 'rounded-2xl', border: 'border-[#FFF176]' },
    nulei: { color: 'bg-[#FFFDE7]', radius: 'rounded-2xl', border: 'border-[#FFF176]' },
    ranyuan_leidu: { color: 'bg-[#F3E5F5]', radius: 'rounded-2xl', border: 'border-[#AB47BC]' },
    leimao_huanying: { color: 'bg-[#FFFDE7]', radius: 'rounded-2xl', border: 'border-[#FFF176]' },
    chuan_shuo_shen_qu: { color: 'bg-[#EDE7F6]', radius: 'rounded-2xl', border: 'border-[#9575CD]' },
    meowth: { color: 'bg-[#FAFAFA]', radius: 'rounded-full', border: 'border-[#BDBDBD]' },
    eevee: { color: 'bg-[#EFEBE9]', radius: 'rounded-full', border: 'border-[#A1887F]' },
    jigglypuff: { color: 'bg-[#FCE4EC]', radius: 'rounded-full', border: 'border-[#F06292]' },
    vaporeon: { color: 'bg-[#E3F2FD]', radius: 'rounded-full', border: 'border-[#2196F3]' },
    jolteon: { color: 'bg-[#FFFDE7]', radius: 'rounded-full', border: 'border-[#FBC02D]' },
    flareon: { color: 'bg-[#FFEBEE]', radius: 'rounded-full', border: 'border-[#F44336]' },
    espeon: { color: 'bg-[#F3E5F5]', radius: 'rounded-full', border: 'border-[#AB47BC]' },
    umbreon: { color: 'bg-[#37474F]', radius: 'rounded-full', border: 'border-[#263238]' },
    leafeon: { color: 'bg-[#F1F8E9]', radius: 'rounded-full', border: 'border-[#689F38]' },
    glaceon: { color: 'bg-[#E0F7FA]', radius: 'rounded-full', border: 'border-[#00BCD4]' },
    sylveon: { color: 'bg-[#FCE4EC]', radius: 'rounded-full', border: 'border-[#F48FB1]' },
    mew: { color: 'bg-[#FCE4EC]', radius: 'rounded-full', border: 'border-[#F06292]' },
    ivysaur: { color: 'bg-[#E0F2F1]', radius: 'rounded-3xl', border: 'border-[#4DB6AC]' },
    venusaur: { color: 'bg-[#C8E6C9]', radius: 'rounded-2xl', border: 'border-[#66BB6A]' },
    venusaur_sky: { color: 'bg-[#E8F5E9]', radius: 'rounded-2xl', border: 'border-[#81C784]' },
    mega_venusaur: { color: 'bg-[#A5D6A7]', radius: 'rounded-2xl', border: 'border-[#2E7D32]' },
    zacian_forest: { color: 'bg-[#E3F2FD]', radius: 'rounded-2xl', border: 'border-[#1E88E5]' },
    zarude: { color: 'bg-[#3E2723]', radius: 'rounded-2xl', border: 'border-[#5D4037]' },
    iron_leaves: { color: 'bg-[#F1F8E9]', radius: 'rounded-2xl', border: 'border-[#00C853]' },
    virizion_god: { color: 'bg-[#DCEDC8]', radius: 'rounded-2xl', border: 'border-[#558B2F]' },
    charizard: { color: 'bg-[#FFCC80]', radius: 'rounded-2xl', border: 'border-[#F57C00]' },
    charmeleon: { color: 'bg-[#FFAB91]', radius: 'rounded-2xl', border: 'border-[#E64A19]' },
    charizard_master: { color: 'bg-[#FFB74D]', radius: 'rounded-2xl', border: 'border-[#EF6C00]' },
    mega_charizard: { color: 'bg-[#90A4AE]', radius: 'rounded-2xl', border: 'border-[#455A64]' },
    mega_charizard_glow: { color: 'bg-[#FFCC80]', radius: 'rounded-2xl', border: 'border-[#F57C00]' },
    gigantamax_charizard: { color: 'bg-[#FF8A65]', radius: 'rounded-2xl', border: 'border-[#D84315]' },
    charcadet: { color: 'bg-[#546E7A]', radius: 'rounded-2xl', border: 'border-[#263238]' },
    koraidon: { color: 'bg-[#EF5350]', radius: 'rounded-2xl', border: 'border-[#C62828]' },
    gouging_fire: { color: 'bg-[#D32F2F]', radius: 'rounded-2xl', border: 'border-[#B71C1C]' },
  };

  const pokemonIds: Record<string, number> = {
    bulbasaur: 1,
    charmander: 4,
    squirtle: 7,
    pikachu: 25,
    pichu: 172,
    xuanjia_nine: 801,
    raichu: 26,
    wanleizun: 10190,
    leizhu: 894,
    nulei: 10100,
    ranyuan_leidu: 849,
    leimao_huanying: 807,
    chuan_shuo_shen_qu: 1008,
    meowth: 52,
    eevee: 133,
    jigglypuff: 39,
    vaporeon: 134,
    jolteon: 135,
    flareon: 136,
    espeon: 196,
    umbreon: 197,
    leafeon: 470,
    glaceon: 471,
    sylveon: 700,
    mew: 151,
    ivysaur: 2,
    venusaur: 3,
    venusaur_sky: 3,
    mega_venusaur: 10033,
    zacian_forest: 888,
    zarude: 893,
    iron_leaves: 1010,
    virizion_god: 640,
    charizard: 6,
    charmeleon: 5,
    charizard_master: 6,
    mega_charizard: 10034,
    mega_charizard_glow: 10035,
    gigantamax_charizard: 10196,
    charcadet: 935,
    koraidon: 1007,
    gouging_fire: 1020,
    dragon: 4
  };

  const isPokemon = species in pokemonIds || species === 'cat' || species === 'meowth';
  const isImageBased = isPokemon || species === 'robot';
  const pokeId = (species === 'cat' || species === 'meowth') 
    ? getCatStageConfig(level).pokemonId 
    : pokemonIds[species];

  const current = config[stage as keyof typeof config] || config.mythical;
  const currentSpecies = speciesConfig[species];

  let displaySize = current.size;
  if (isImageBased) {
    if (stage === 'baby') displaySize = 'w-44 h-44 md:w-48 md:h-48';
    else if (stage === 'child') displaySize = 'w-48 h-48 md:w-52 md:h-52';
    else if (stage === 'teen') displaySize = 'w-52 h-52 md:w-56 md:h-56';
    else if (stage === 'adult') displaySize = 'w-56 h-56 md:w-60 md:h-60';
    else if (stage === 'legendary') displaySize = 'w-60 h-60 md:w-64 md:h-64';
    else displaySize = 'w-68 h-68 md:w-72 md:h-72';
  }

  const slimeStageConfig = species === 'slime' ? getSlimeStageConfig(level) : null;
  const catStageConfig = (species === 'cat' || species === 'meowth') ? getCatStageConfig(level) : null;
  const robotStageConfig = species === 'robot' ? getRobotStageConfig(level) : null;
  
  const petColor = slimeStageConfig 
    ? slimeStageConfig.color 
    : (catStageConfig 
      ? catStageConfig.color 
      : (robotStageConfig 
        ? robotStageConfig.color 
        : currentSpecies.color));
    
  const petRadius = slimeStageConfig 
    ? slimeStageConfig.radius 
    : (catStageConfig 
      ? catStageConfig.radius 
      : (robotStageConfig 
        ? robotStageConfig.radius 
        : currentSpecies.radius));
    
  const petBorder = slimeStageConfig 
    ? slimeStageConfig.border 
    : (catStageConfig 
      ? catStageConfig.border 
      : (robotStageConfig 
        ? robotStageConfig.border 
        : currentSpecies.border));

  return (
    <div className="relative flex flex-col items-center justify-center p-12">
      {/* Action Effects */}
      <AnimatePresence>
        {isEvolving && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: 1 }}
            exit={{ scale: 3, opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-white rounded-full blur-3xl z-40"
          />
        )}
        {activeAction === 'feeding' && (
          <motion.div
            initial={{ y: -60, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1.2 }}
            exit={{ y: 30, opacity: 0, scale: 0.8 }}
            className="absolute top-0 z-20 flex flex-col items-center"
          >
            <div className="relative">
              <Utensils className="w-14 h-14 text-orange-500 drop-shadow-lg" />
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="absolute -top-4 -right-4 text-2xl"
              >
                🍖
              </motion.div>
            </div>
            {/* Food Bowl */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-20 w-24 h-10 bg-rose-400 rounded-b-full border-t-4 border-rose-600 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-amber-800/40" />
            </motion.div>
          </motion.div>
        )}
        {activeAction === 'cleaning' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
          >
            {/* Shower Head */}
            <motion.div
              animate={{ x: [-40, 40, -40] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-20"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-slate-400 rounded-full border-4 border-slate-300" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-10 bg-slate-300" />
                {/* Water Drops */}
                <div className="absolute top-12 left-0 right-0 flex justify-around">
                  {[1,2,3,4,5].map(i => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, 150], opacity: [0.8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1.5 h-6 bg-cyan-300/60 rounded-full blur-[1px]"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
            {/* Bathtub */}
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 60 }}
              className="w-64 h-24 bg-white border-4 border-slate-200 rounded-b-[4rem] relative overflow-hidden shadow-xl"
            >
              <div className="absolute inset-0 bg-cyan-100/40" />
              <div className="absolute top-0 left-0 right-0 h-4 bg-slate-100" />
              {/* Bubbles */}
              {[1,2,3,4,5,6].map(i => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [10, -30], 
                    x: [Math.random() * 200, Math.random() * 200],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.2]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className="absolute w-6 h-6 bg-white/80 rounded-full border border-cyan-100"
                />
              ))}
            </motion.div>
          </motion.div>
        )}
        {activeAction === 'playing' && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
            exit={{ scale: 0 }}
            className="absolute top-0 z-20"
          >
            <Gamepad2 className="w-14 h-14 text-indigo-500 drop-shadow-xl" />
          </motion.div>
        )}
        {activeAction === 'studying' && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: [0, -20, 0], opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-10 z-20"
          >
            <BookOpen className="w-14 h-14 text-emerald-500 drop-shadow-lg" />
            <motion.div
              animate={{ opacity: [0, 1, 0], y: [-10, -30] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-black text-emerald-600"
            >
              XP+
            </motion.div>
          </motion.div>
        )}
        {activeAction === 'sleeping' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -top-12 right-0 z-20"
          >
            <Moon className="w-10 h-10 text-indigo-400" />
            <div className="absolute -top-4 -right-4 flex flex-col gap-1">
              {[1, 2, 3].map(i => (
                <motion.span
                  key={i}
                  animate={{ 
                    opacity: [0, 1, 0],
                    y: [0, -20],
                    x: [0, 10],
                    scale: [0.5, 1.2]
                  }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.6 }}
                  className="text-indigo-400 font-black text-xl"
                >
                  Z
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
        {activeAction === 'adventure' && (
          <motion.div
            initial={{ scale: 0, x: -100 }}
            animate={{ scale: 1, x: 100 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute z-20"
          >
            <Map className="w-16 h-16 text-orange-600 drop-shadow-xl" />
          </motion.div>
        )}
        {activeAction === 'meditation' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 2], rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 z-20 flex items-center justify-center"
          >
            <Wind className="w-24 h-24 text-teal-400 opacity-40" />
          </motion.div>
        )}
        {activeAction === 'magic' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-20"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [0, 1, 0],
                  x: [0, Math.cos(i * 30 * Math.PI / 180) * 150],
                  y: [0, Math.sin(i * 30 * Math.PI / 180) * 150],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                className="absolute left-1/2 top-1/2"
              >
                <Sparkles className="w-8 h-8 text-pink-400 fill-pink-400" />
              </motion.div>
            ))}
          </motion.div>
        )}
        {activeAction === 'skill' && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: [0, 1.5, 0], rotate: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center"
          >
            <div className="relative">
              <Zap className="w-32 h-32 text-purple-500 fill-purple-200 drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
              <motion.div
                animate={{ scale: [1, 2], opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="absolute inset-0 bg-purple-400 rounded-full blur-xl"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cool Sparkles for High Level/Happiness */}
      {isVeryHappy && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180],
                x: [0, (i % 2 === 0 ? 1 : -1) * 80],
                y: [0, (i < 3 ? -1 : 1) * 80],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <SparkleIcon className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Speech Bubble */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="absolute -top-16 z-30 max-w-[220px] rounded-[2rem] bg-white p-4 shadow-2xl border-4 border-indigo-50"
          >
            <p className="text-sm font-bold text-slate-700 leading-tight text-center">{message}</p>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 border-b-4 border-r-4 border-indigo-50" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Pet */}
      <motion.div
        key={`${species}-${stage}`}
        initial={isEvolving ? { scale: 0.5, opacity: 0, filter: 'brightness(3)' } : false}
        animate={{
          y: activeAction === 'playing' ? [0, -60, 0] : activeAction === 'sleeping' ? [0, 5, 0] : activeAction === 'cleaning' ? [0, 10, 0] : activeAction === 'meditation' ? [0, -10, 0] : activeAction === 'skill' ? [0, -40, 0] : isVeryHappy ? [0, -25, 0] : isHungry ? [0, 2, -2, 0] : [0, -12, 0],
          scale: isEvolving ? [1, 1.2, 1] : activeAction === 'feeding' ? [1, 1.15, 1] : activeAction === 'sleeping' ? [1, 0.95, 1] : activeAction === 'cleaning' ? [1, 1.05, 1] : activeAction === 'magic' ? [1, 1.3, 1] : activeAction === 'skill' ? [1, 1.2, 1] : isHungry ? [1, 0.98, 1] : [1, 1.02, 1],
          opacity: 1,
          filter: isEvolving ? ['brightness(3)', 'brightness(1)'] : activeAction === 'sleeping' ? 'brightness(0.8)' : activeAction === 'meditation' ? 'brightness(1.1) saturate(1.2)' : activeAction === 'skill' ? 'brightness(1.5) saturate(1.5)' : 'brightness(1)',
          rotate: activeAction === 'cleaning' ? [0, 5, -5, 0] : activeAction === 'feeding' ? [0, 2, -2, 0] : activeAction === 'studying' ? [0, -5, 5, 0] : activeAction === 'adventure' ? [0, 10, -10, 0] : activeAction === 'skill' ? [0, 360] : isVeryHappy ? [0, 5, -5, 0] : isHungry ? [0, -2, 2, 0] : 0,
          skewX: isHungry ? [0, 2, -2, 0] : 0
        }}
        transition={{
          duration: isEvolving ? 2 : activeAction === 'feeding' ? 0.8 : activeAction === 'playing' ? 0.6 : activeAction === 'sleeping' ? 4 : activeAction === 'meditation' ? 2 : activeAction === 'skill' ? 0.5 : isVeryHappy ? 0.4 : isHungry ? 0.2 : 3,
          repeat: isEvolving ? 0 : Infinity,
          ease: activeAction === 'feeding' ? "backOut" : "easeInOut"
        }}
        className={cn(
          "relative shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-1000 border-4",
          displaySize,
          petColor,
          petRadius,
          petBorder,
          isHungry && "brightness-90 saturate-50",
          isDirty && "opacity-80",
          (isImageBased && species !== 'cat' && species !== 'meowth' && species !== 'robot') && "bg-white/40 border-dashed"
        )}
      >
        {isImageBased ? (
          <div className="relative w-full h-full flex items-center justify-center p-3">
            {catStageConfig?.element}
            {robotStageConfig?.element}
            <img 
              src={species === 'robot' ? robotStageConfig?.image : `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/other/official-artwork/${pokeId}.png`}
              alt={species}
              className={cn(
                "w-full h-full object-contain drop-shadow-xl z-10",
                activeAction === 'sleeping' && "grayscale brightness-50"
              )}
              referrerPolicy="no-referrer"
            />
            {/* Image-based Pet Specific Overlays */}
            {activeAction === 'feeding' && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                className="absolute -top-4 text-4xl z-30"
              >
                😋
              </motion.div>
            )}
          </div>
        ) : (
          <>
            {/* Glossy Overlay */}
            <div className="absolute inset-2 bg-gradient-to-tr from-white/20 to-transparent rounded-[inherit] pointer-events-none" />

            {/* Render Slime dynamic decoration element if any */}
            {slimeStageConfig?.element}

        {/* Species Specific Features */}
        {species === 'dragon' && (
          <>
            <motion.div 
              animate={{ rotate: [-30, -35, -30] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-6 -left-3 w-8 h-12 bg-rose-600 rounded-full origin-bottom shadow-lg" 
            />
            <motion.div 
              animate={{ rotate: [30, 35, 30] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-6 -right-3 w-8 h-12 bg-rose-600 rounded-full origin-bottom shadow-lg" 
            />
            {/* Dragon Wings */}
            <motion.div 
              animate={{ rotateY: [0, 45, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute -left-10 top-1/4 w-12 h-16 bg-rose-400/60 rounded-full -z-10 blur-[1px]" 
            />
            <motion.div 
              animate={{ rotateY: [0, -45, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute -right-10 top-1/4 w-12 h-16 bg-rose-400/60 rounded-full -z-10 blur-[1px]" 
            />
          </>
        )}
        {species === 'cat' && (
          <>
            <div className="absolute -top-6 left-3 w-10 h-10 bg-amber-600" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            <div className="absolute -top-6 right-3 w-10 h-10 bg-amber-600" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            {/* Whiskers */}
            <div className="absolute -left-6 top-1/2 flex flex-col gap-2">
              <div className="w-6 h-0.5 bg-slate-800/20 rotate-[-10deg]" />
              <div className="w-6 h-0.5 bg-slate-800/20" />
            </div>
            <div className="absolute -right-6 top-1/2 flex flex-col gap-2">
              <div className="w-6 h-0.5 bg-slate-800/20 rotate-[10deg]" />
              <div className="w-6 h-0.5 bg-slate-800/20" />
            </div>
          </>
        )}
        {species === 'robot' && (
          <>
            <div className="absolute -top-8 w-1.5 h-10 bg-slate-600 rounded-full">
              <motion.div 
                animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute -top-2 -left-1.5 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]" 
              />
            </div>
            {/* Robot Bolts */}
            <div className="absolute -left-3 top-1/2 w-4 h-4 bg-slate-500 rounded-sm" />
            <div className="absolute -right-3 top-1/2 w-4 h-4 bg-slate-500 rounded-sm" />
          </>
        )}
        {species === 'rabbit' && (
          <>
            <div className="absolute -top-12 left-4 w-6 h-16 bg-pink-200 rounded-full border-2 border-pink-50" />
            <div className="absolute -top-12 right-4 w-6 h-16 bg-pink-200 rounded-full border-2 border-pink-50" />
          </>
        )}
        {species === 'panda' && (
          <>
            <div className="absolute -top-4 -left-2 w-10 h-10 bg-slate-800 rounded-full" />
            <div className="absolute -top-4 -right-2 w-10 h-10 bg-slate-800 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
              <div className="absolute top-[40%] left-[20%] w-10 h-12 bg-slate-800 rounded-full rotate-[15deg] opacity-20" />
              <div className="absolute top-[40%] right-[20%] w-10 h-12 bg-slate-800 rounded-full rotate-[-15deg] opacity-20" />
            </div>
          </>
        )}
        {species === 'pig' && (
          <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-12 h-8 bg-pink-300 rounded-full border-2 border-pink-100 flex items-center justify-center gap-2">
            <div className="w-2 h-3 bg-pink-500/30 rounded-full" />
            <div className="w-2 h-3 bg-pink-500/30 rounded-full" />
          </div>
        )}
        {species === 'tiger' && (
          <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
            <div className="absolute top-4 left-0 w-8 h-2 bg-slate-900/20 rounded-r-full" />
            <div className="absolute top-12 left-0 w-10 h-2 bg-slate-900/20 rounded-r-full" />
            <div className="absolute top-20 left-0 w-8 h-2 bg-slate-900/20 rounded-r-full" />
            <div className="absolute top-4 right-0 w-8 h-2 bg-slate-900/20 rounded-l-full" />
            <div className="absolute top-12 right-0 w-10 h-2 bg-slate-900/20 rounded-l-full" />
            <div className="absolute top-20 right-0 w-8 h-2 bg-slate-900/20 rounded-l-full" />
          </div>
        )}
        {species === 'elephant' && (
          <>
            <div className="absolute top-1/4 -left-12 w-16 h-20 bg-blue-200 rounded-full border-2 border-blue-50 -z-10" />
            <div className="absolute top-1/4 -right-12 w-16 h-20 bg-blue-200 rounded-full border-2 border-blue-50 -z-10" />
            <div className="absolute top-[65%] left-1/2 -translate-x-1/2 w-6 h-16 bg-blue-200 rounded-full border-2 border-blue-50 origin-top rotate-[-10deg]" />
          </>
        )}
        {species === 'dinosaur' && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1">
            <div className="w-4 h-6 bg-emerald-600 rounded-t-full" />
            <div className="w-4 h-8 bg-emerald-600 rounded-t-full" />
            <div className="w-4 h-6 bg-emerald-600 rounded-t-full" />
          </div>
        )}
        {species === 'fox' && (
          <>
            <div className="absolute -top-8 left-2 w-12 h-12 bg-orange-600" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            <div className="absolute -top-8 right-2 w-12 h-12 bg-orange-600" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/3 bg-white/40 rounded-t-full" />
          </>
        )}
        {species === 'penguin' && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[70%] bg-white rounded-t-[50%] rounded-b-[20%]" />
        )}
        {species === 'lion' && (
          <div className="absolute -inset-6 border-[16px] border-yellow-800/40 rounded-full -z-10" />
        )}

        {/* Legendary Aura */}
        {stage === 'legendary' && (
          <motion.div
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.1, 1],
              rotate: [0, 360]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 bg-gradient-to-tr from-yellow-400/30 via-orange-400/20 to-yellow-400/30 rounded-[inherit] blur-3xl -z-20"
          />
        )}
        {stage === 'mythical' && (
          <>
            <motion.div
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
                rotate: [360, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-12 bg-gradient-to-tr from-purple-500/40 via-pink-400/30 to-blue-500/40 rounded-[inherit] blur-[60px] -z-20"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-16 border-4 border-dashed border-purple-300/30 rounded-full -z-10"
            />
          </>
        )}

        {/* Face Container */}
        {species === 'slime' && slimeStageConfig?.customFace ? (
          slimeStageConfig.customFace(isHungry, isVeryHappy, activeAction, happiness)
        ) : (
          <div className="flex flex-col items-center gap-3">
            {/* Eyes */}
            <div className="flex gap-6 relative">
              {isHungry && (
                <>
                  <motion.div 
                    animate={{ rotate: [-20, -15, -20] }}
                    className="absolute -top-4 left-0 w-6 h-1.5 bg-slate-900/40 rounded-full" 
                  />
                  <motion.div 
                    animate={{ rotate: [20, 15, 20] }}
                    className="absolute -top-4 right-0 w-6 h-1.5 bg-slate-900/40 rounded-full" 
                  />
                </>
              )}
              <motion.div 
                animate={{ 
                  scaleY: (isHungry || activeAction === 'sleeping') ? 0.1 : activeAction === 'feeding' ? 1.3 : [1, 1, 0.1, 1],
                  y: (isHungry || activeAction === 'sleeping') ? 2 : 0
                }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1] }}
                className={cn("bg-slate-900 rounded-full shadow-inner relative", current.eyes)} 
              >
                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full opacity-60" />
              </motion.div>
              <motion.div 
                animate={{ 
                  scaleY: (isHungry || activeAction === 'sleeping') ? 0.1 : activeAction === 'feeding' ? 1.3 : [1, 1, 0.1, 1],
                  y: (isHungry || activeAction === 'sleeping') ? 2 : 0
                }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.9, 0.95, 1] }}
                className={cn("bg-slate-900 rounded-full shadow-inner relative", current.eyes)} 
              >
                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full opacity-60" />
              </motion.div>
            </div>

            {/* Blushes */}
            <div className="flex justify-between w-full px-4 absolute top-1/2">
              <motion.div 
                animate={{ opacity: isVeryHappy ? 0.6 : 0.2 }}
                className={cn("bg-rose-400 rounded-full blur-[2px]", current.blush)} 
              />
              <motion.div 
                animate={{ opacity: isVeryHappy ? 0.6 : 0.2 }}
                className={cn("bg-rose-400 rounded-full blur-[2px]", current.blush)} 
              />
            </div>

            {/* Mouth */}
            <motion.div 
              animate={{
                height: isHungry ? 2 : (happiness > 85 || activeAction === 'feeding') ? 16 : (happiness > 70) ? 12 : 4,
                width: isHungry ? 12 : (happiness > 85 || activeAction === 'feeding') ? 24 : 16,
                borderRadius: isHungry ? '2px' : '9999px',
                scale: activeAction === 'feeding' ? [1, 1.2, 1] : 1
              }}
              transition={{ repeat: activeAction === 'feeding' ? Infinity : 0, duration: 0.3 }}
              className={cn(
                "border-b-4 border-slate-900 transition-all bg-slate-900/10",
                isHungry ? "border-t-0" : "",
                (happiness > 85 || activeAction === 'feeding') ? "bg-rose-500/20" : ""
              )} 
            />
          </div>
        )}

            {/* Thinking Indicator */}
            {isThinking && (
              <div className="absolute -right-6 -top-6 flex gap-1.5">
                <motion.div animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-3 h-3 bg-white rounded-full shadow-sm" />
                <motion.div animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-3 h-3 bg-white rounded-full shadow-sm" />
                <motion.div animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-3 h-3 bg-white rounded-full shadow-sm" />
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Shadow */}
      <motion.div
        animate={{ 
          scale: activeAction === 'playing' ? [0.6, 0.4, 0.6] : [1, 0.85, 1], 
          opacity: activeAction === 'playing' ? [0.1, 0.05, 0.1] : [0.25, 0.15, 0.25] 
        }}
        transition={{ duration: activeAction === 'playing' ? 0.6 : 3, repeat: Infinity, ease: "easeInOut" }}
        className="mt-6 w-24 h-5 bg-slate-900/30 rounded-[100%] blur-xl"
      />
    </div>
  );
};
