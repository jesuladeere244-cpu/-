import React from 'react';
import { motion } from 'motion/react';
import { Star, Zap, Heart, Coins, Battery, Droplets } from 'lucide-react';
import { PetState } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface StatsProps {
  pet: PetState;
}

export const Stats: React.FC<StatsProps> = ({ pet }) => {
  const xpPercentage = (pet.xp / pet.nextLevelXp) * 100;

  const StatBar = ({ label, value, color, icon: Icon }: { label: string, value: number, color: string, icon: any }) => (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-1.5">
          <Icon className="w-4 h-4 text-[#5D4037]" />
          <span className="text-[10px] font-black text-[#5D4037] uppercase tracking-wider">{label}</span>
        </div>
        <span className="text-[10px] font-black text-[#5D4037]">{value}%</span>
      </div>
      <div className="h-4 bg-white rounded-full border-2 border-[#5D4037] overflow-hidden shadow-inner p-0.5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={cn("h-full rounded-full border-r-2 border-[#5D4037]", color)}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <StatBar label="心情" value={pet.happiness} color="bg-[#FFD54F]" icon={Heart} />
        <StatBar label="体力" value={pet.energy} color="bg-[#81C784]" icon={Battery} />
        <StatBar label="整洁" value={pet.hygiene} color="bg-[#4FC3F7]" icon={Droplets} />
      </div>

      <div className="bg-white p-5 rounded-[2.5rem] border-4 border-[#D7CCC8] shadow-inner relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-5">
          <Star className="w-20 h-20" />
        </div>
        <div className="flex justify-between items-end mb-3 px-1">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#A1887F] uppercase tracking-widest">成长进度</span>
            <span className="text-2xl font-black text-[#5D4037] font-hand">等级 {pet.level}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-[#A1887F] uppercase tracking-widest">学习币</span>
            <span className="text-xl font-black text-[#FF7043]">{pet.points}</span>
          </div>
        </div>
        <div className="h-5 bg-[#EFEBE9] rounded-full border-2 border-[#D7CCC8] overflow-hidden p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPercentage}%` }}
            className="h-full bg-gradient-to-r from-[#FFAB91] to-[#FF7043] rounded-full border-r-2 border-[#5D4037]"
          />
        </div>
        <div className="mt-2 text-right">
          <span className="text-[10px] font-black text-[#8D6E63]">{pet.xp} / {pet.nextLevelXp} XP</span>
        </div>
      </div>
    </div>
  );
};
