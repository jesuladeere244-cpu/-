import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { PetSpecies } from '@/src/types';
import { Utensils, Bath, Gamepad2, Sparkles as SparkleIcon, BookOpen, Moon, Map, Wind, Sparkles, Zap } from 'lucide-react';

interface PetDisplayProps {
  species: PetSpecies;
  stage: 'baby' | 'child' | 'teen' | 'adult' | 'legendary' | 'mythical';
  happiness: number;
  energy: number;
  hygiene: number;
  isThinking?: boolean;
  message?: string;
  activeAction?: 'feeding' | 'cleaning' | 'playing' | 'studying' | 'sleeping' | 'adventure' | 'meditation' | 'magic' | 'skill' | null;
  isEvolving?: boolean;
}

export const PetDisplay: React.FC<PetDisplayProps> = ({ 
  species, 
  stage, 
  happiness, 
  energy,
  hygiene,
  isThinking, 
  message, 
  activeAction,
  isEvolving
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
  };

  const current = config[stage];
  const currentSpecies = speciesConfig[species];

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
          current.size,
          currentSpecies.color,
          currentSpecies.radius,
          currentSpecies.border,
          isHungry && "brightness-90 saturate-50",
          isDirty && "opacity-80"
        )}
      >
        {/* Glossy Overlay */}
        <div className="absolute inset-2 bg-gradient-to-tr from-white/20 to-transparent rounded-[inherit] pointer-events-none" />

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

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="absolute -right-6 -top-6 flex gap-1.5">
            <motion.div animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-3 h-3 bg-white rounded-full shadow-sm" />
            <motion.div animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-3 h-3 bg-white rounded-full shadow-sm" />
            <motion.div animate={{ y: [0, -8, 0], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-3 h-3 bg-white rounded-full shadow-sm" />
          </div>
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
