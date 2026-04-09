import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Bath, Gamepad2, Coins } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface InteractionPanelProps {
  points: number;
  onAction: (type: 'feeding' | 'cleaning' | 'playing') => void;
  disabled?: boolean;
}

export const InteractionPanel: React.FC<InteractionPanelProps> = ({ points, onAction, disabled }) => {
  const actions = [
    { type: 'feeding' as const, label: '喂食', icon: Utensils, cost: 10, color: 'bg-[#FFCC80]', border: 'border-[#F57C00]', shadow: 'shadow-[4px_4px_0px_#F57C00]' },
    { type: 'cleaning' as const, label: '冲凉', icon: Bath, cost: 5, color: 'bg-[#B2EBF2]', border: 'border-[#00ACC1]', shadow: 'shadow-[4px_4px_0px_#00ACC1]' },
    { type: 'playing' as const, label: '玩耍', icon: Gamepad2, cost: 15, color: 'bg-[#D1C4E9]', border: 'border-[#5E35B1]', shadow: 'shadow-[4px_4px_0px_#5E35B1]' },
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

      <div className="grid grid-cols-3 gap-4">
        {actions.map((action) => (
          <motion.button
            key={action.type}
            whileHover={points >= action.cost && !disabled ? { scale: 1.05, y: -2 } : {}}
            whileTap={points >= action.cost && !disabled ? { scale: 0.95 } : {}}
            onClick={() => onAction(action.type)}
            disabled={disabled || points < action.cost}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-[2rem] border-4 transition-all relative overflow-hidden",
              action.color,
              action.border,
              action.shadow,
              (disabled || points < action.cost) ? "opacity-40 grayscale cursor-not-allowed shadow-none translate-y-[2px]" : "hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none"
            )}
          >
            <action.icon className="w-8 h-8 text-[#5D4037]" />
            <div className="flex flex-col items-center">
              <span className="text-sm font-black text-[#5D4037]">{action.label}</span>
              <span className="text-[10px] font-black text-[#5D4037]/60">-{action.cost}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
