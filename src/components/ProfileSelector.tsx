import React from 'react';
import { motion } from 'motion/react';
import { Users, Plus, UserCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Profile {
  id: string;
  name: string;
  petName: string;
  petSpecies: string;
  level: number;
}

interface ProfileSelectorProps {
  profiles: Profile[];
  onSelect: (id: string) => void;
  onCreate: () => void;
}

const SPECIES_EMOJIS: Record<string, string> = {
  slime: '💧', dragon: '🔥', cat: '🐱', robot: '🤖',
  rabbit: '🐰', panda: '🐼', frog: '🐸', pig: '🐷',
  tiger: '🐯', elephant: '🐘', dinosaur: '🦖', fox: '🦊',
  penguin: '🐧', lion: '🦁'
};

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ profiles, onSelect, onCreate }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-xl rounded-[4rem] p-12 shadow-[20px_20px_0px_rgba(93,64,55,0.1)] border-4 border-[#5D4037] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#FFCC80] rounded-full opacity-20 blur-2xl" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FFAB91] rounded-full opacity-20 blur-2xl" />

      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex p-4 bg-[#FFF3E0] rounded-[2rem] mb-6 border-4 border-[#FFE0B2] rotate-[-2deg]">
          <Users className="w-10 h-10 text-[#FF7043]" />
        </div>
        <h2 className="text-4xl font-black text-[#5D4037] mb-3 tracking-tight font-hand">谁在学习呀？</h2>
        <p className="text-[#8D6E63] font-bold text-lg">选择你的档案，开始快乐养宠大比拼！</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {profiles.map((profile) => (
          <motion.button
            key={profile.id}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(profile.id)}
            className="flex flex-col items-center gap-4 p-8 bg-[#FFF9F2] hover:bg-white border-4 border-[#D7CCC8] hover:border-[#FFAB91] rounded-[3rem] transition-all group text-center shadow-[8px_8px_0px_#D7CCC8] hover:shadow-[8px_8px_0px_#FFAB91]"
          >
            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-[#FF7043] border-4 border-[#EFEBE9] group-hover:border-[#FFAB91] transition-colors shadow-inner text-5xl">
              {SPECIES_EMOJIS[profile.petSpecies] || <UserCircle className="w-16 h-16" />}
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#5D4037] mb-1 font-hand">{profile.name}</h3>
              <div className="bg-[#FFECB3] px-3 py-1 rounded-full border-2 border-[#FFE082]">
                <p className="text-xs text-[#795548] font-black uppercase tracking-widest">
                  {profile.petName} (Lv.{profile.level})
                </p>
              </div>
            </div>
          </motion.button>
        ))}

        {profiles.length < 2 && (
          <motion.button
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreate}
            className="flex flex-col items-center justify-center gap-4 p-8 bg-white border-4 border-dashed border-[#D7CCC8] hover:border-[#FFAB91] rounded-[3rem] transition-all group text-[#A1887F] hover:text-[#FF7043] shadow-[8px_8px_0px_rgba(0,0,0,0.05)]"
          >
            <div className="w-20 h-20 bg-[#F5F5F5] rounded-full flex items-center justify-center group-hover:bg-[#FFF3E0] transition-colors">
              <Plus className="w-10 h-10" />
            </div>
            <span className="text-xl font-black font-hand">添加新成员</span>
          </motion.button>
        )}
      </div>

      <div className="mt-12 p-8 bg-[#E8F5E9] rounded-[3rem] border-4 border-[#C8E6C9] relative overflow-hidden">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-4 h-4 bg-[#4CAF50] rounded-full animate-pulse border-2 border-white" />
          <h4 className="text-lg font-black text-[#2E7D32] uppercase tracking-wider font-hand">大比拼模式已开启</h4>
        </div>
        <p className="text-sm text-[#4E342E] font-bold leading-relaxed relative z-10">
          两个孩子可以拥有各自独立的宠物和任务清单。在排行榜中互相竞争，看谁的学习力更强，谁的宠物进化得更快！
        </p>
      </div>
    </div>
  );
};
