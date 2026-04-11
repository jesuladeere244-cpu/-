import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Bath, Gamepad2, Coins, BookOpen, Moon, Map, Wind, Sparkles, Lock } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface InteractionPanelProps {
  points: number;
  level: number;
  onAction: (type: 'feeding' | 'cleaning' | 'playing' | 'studying' | 'sleeping' | 'adventure' | 'meditation' | 'magic') => void;
  disabled?: boolean;
}

export const InteractionPanel: React.FC<InteractionPanelProps> = ({ points, level, onAction, disabled }) => {
  const actions = [
    { type: 'feeding' as const, label: '喂食', icon: Utensils, cost: 10, minLevel: 1, color: 'bg-[#FFCC80]', border: 'border-[#F57C00]', shadow: 'shadow-[4px_4px_0px_#F57C00]' },
    { type: 'cleaning' as const, label: '冲凉', icon: Bath, cost: 5, minLevel: 1, color: 'bg-[#B2EBF2]', border: 'border-[#00ACC1]', shadow: 'shadow-[4px_4px_0px_#00ACC1]' },
    { type: 'playing' as const, label: '玩耍', icon: Gamepad2, cost: 15, minLevel: 1, color: 'bg-[#D1C4E9]', border: 'border-[#5E35B1]', shadow: 'shadow-[4px_4px_0px_#5E35B1]' },
    { type: 'studying' as const, label: '学习', icon: BookOpen, cost: 20, minLevel: 1, color: 'bg-[#C8E6C9]', border: 'border-[#388E3C]', shadow: 'shadow-[4px_4px_0px_#388E3C]' },
    { type: 'sleeping' as const, label: '睡觉', icon: Moon, cost: 0, minLevel: 1, color: 'bg-[#E1F5FE]', border: 'border-[#0288D1]', shadow: 'shadow-[4px_4px_0px_#0288D1]' },
    { type: 'adventure' as const, label: '探险', icon: Map, cost: 30, minLevel: 10, color: 'bg-[#FFAB91]', border: 'border-[#D84315]', shadow: 'shadow-[4px_4px_0px_#D84315]' },
    { type: 'meditation' as const, label: '冥想', icon: Wind, cost: 25, minLevel: 18, color: 'bg-[#B2DFDB]', border: 'border-[#00796B]', shadow: 'shadow-[4px_4px_0px_#00796B]' },
    { type: 'magic' as const, label: '魔法', icon: Sparkles, cost: 50, minLevel: 30, color: 'bg-[#F8BBD0]', border: 'border-[#C2185B]', shadow: 'shadow-[4px_4px_0px_#C2185B]' },
  ];

  return (
    <div className="w-full max-w-md bg-white/60 p-6 rounded-[3rem] border-4 border-[#D7CCC8] shadow-[12px_12px_0px_rgba(93,64,55,0.05)] mt-6">
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#FFD54F] rounded-full flex items-center justify-center border-2 border-[#5D4037] shadow-sm">
            <Coins className="w-6 h-6 text-[#5D4037]" />
          </div>
          <span className="text-2xl font-black text-[#5D4037] font-hand">{points}</span>
          <span className="text-xs font-black text-[#8D6E63] uppercase tracking-widest ml-1">学习币</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => {
          const isLocked = level < action.minLevel;
          const canAfford = points >= action.cost;
          
          return (
            <motion.button
              key={action.type}
              whileHover={!isLocked && canAfford && !disabled ? { scale: 1.05, y: -2 } : {}}
              whileTap={!isLocked && canAfford && !disabled ? { scale: 0.95 } : {}}
              onClick={() => onAction(action.type)}
              disabled={disabled || isLocked || !canAfford}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-[2rem] border-4 transition-all relative overflow-hidden",
                action.color,
                action.border,
                action.shadow,
                (disabled || isLocked || !canAfford) ? "opacity-40 grayscale cursor-not-allowed shadow-none translate-y-[2px]" : "hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none"
              )}
            >
              {isLocked ? (
                <div className="flex flex-col items-center gap-1">
                  <Lock className="w-6 h-6 text-[#5D4037]/40" />
                  <span className="text-[10px] font-black text-[#5D4037]/60">Lv.{action.minLevel}</span>
                </div>
              ) : (
                <>
                  <action.icon className="w-7 h-7 text-[#5D4037]" />
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-black text-[#5D4037] leading-tight">{action.label}</span>
                    <span className="text-[9px] font-black text-[#5D4037]/60">-{action.cost}</span>
                  </div>
                </>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
