import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Star, User, Coins, Zap } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface LeaderboardEntry {
  id: string;
  name: string;
  petName: string;
  level: number;
  xp: number;
  points: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  const [rankType, setRankType] = useState<'level' | 'points'>('level');

  const sortedEntries = [...entries].sort((a, b) => {
    if (rankType === 'level') {
      return b.level !== a.level ? b.level - a.level : b.xp - a.xp;
    }
    return b.points - a.points;
  });

  return (
    <div className="w-full max-w-2xl bg-white/60 p-8 rounded-[3rem] border-4 border-[#D7CCC8] shadow-[16px_16px_0px_rgba(93,64,55,0.05)]">
      <div className="text-center mb-8">
        <div className="inline-flex p-4 bg-[#FFF3E0] rounded-[2rem] mb-4 border-4 border-[#FFE0B2] rotate-[2deg]">
          <Trophy className="w-10 h-10 text-[#FFB300]" />
        </div>
        <h2 className="text-3xl font-black text-[#5D4037] font-hand">光荣榜</h2>
        <p className="text-[#8D6E63] font-bold">看看谁的小伙伴最厉害！</p>
      </div>

      {/* Ranking Type Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-[#EFEBE9] p-2 rounded-[2rem] border-4 border-[#D7CCC8] flex gap-2">
          <button
            onClick={() => setRankType('level')}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-[1.5rem] text-sm font-black transition-all",
              rankType === 'level' ? "bg-[#FFCC80] text-[#5D4037] shadow-sm border-2 border-[#5D4037]" : "text-[#A1887F] hover:text-[#5D4037]"
            )}
          >
            <Zap className="w-4 h-4" />
            等级排行
          </button>
          <button
            onClick={() => setRankType('points')}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-[1.5rem] text-sm font-black transition-all",
              rankType === 'points' ? "bg-[#FFD54F] text-[#5D4037] shadow-sm border-2 border-[#5D4037]" : "text-[#A1887F] hover:text-[#5D4037]"
            )}
          >
            <Coins className="w-4 h-4" />
            积分排行
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedEntries.map((entry, index) => {
          const isTop3 = index < 3;
          const medalColors = ['bg-[#FFD54F]', 'bg-[#E0E0E0]', 'bg-[#FFCC80]'];
          const medalBorders = ['border-[#FFB300]', 'border-[#BDBDBD]', 'border-[#FB8C00]'];

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex items-center gap-4 p-5 rounded-[2rem] border-4 transition-all",
                entry.isCurrentUser 
                  ? "bg-[#FFF3E0] border-[#FFAB91] shadow-[6px_6px_0px_#FFAB91] scale-[1.02] z-10" 
                  : "bg-white border-[#EFEBE9] shadow-[4px_4px_0px_#EFEBE9]"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl border-2",
                isTop3 ? `${medalColors[index]} ${medalBorders[index]} text-[#5D4037]` : "bg-[#F5F5F5] border-[#D7CCC8] text-[#A1887F]"
              )}>
                {index + 1}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-[#5D4037] text-lg">{entry.name}</h3>
                  {entry.isCurrentUser && (
                    <span className="text-[10px] font-black bg-[#FF7043] text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      是你呀!
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-[#8D6E63]">
                  宠物: <span className="text-[#FF7043] font-hand">{entry.petName}</span>
                </p>
              </div>

              <div className="text-right">
                {rankType === 'level' ? (
                  <>
                    <div className="text-2xl font-black text-[#5D4037] leading-none">
                      Lv.{entry.level}
                    </div>
                    <div className="text-[10px] font-black text-[#A1887F] uppercase tracking-widest mt-1">
                      {entry.xp} XP
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-black text-[#FF7043] leading-none flex items-center justify-end gap-1">
                      <Coins className="w-5 h-5" />
                      {entry.points}
                    </div>
                    <div className="text-[10px] font-black text-[#A1887F] uppercase tracking-widest mt-1">
                      学习币
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 p-6 bg-[#E1F5FE] rounded-[2rem] border-4 border-[#B3E5FC] text-center">
        <p className="text-sm font-bold text-[#0277BD]">
          加油学习，让你的宠物也登上光荣榜吧！✨
        </p>
      </div>
    </div>
  );
};
