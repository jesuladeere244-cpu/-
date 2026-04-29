import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Dice5, ChevronRight, Heart, Star, Gift, Box, Flame, Cat, Cpu } from 'lucide-react';
import { PetSpecies } from '@/src/types';
import { cn } from '@/src/lib/utils';
import confetti from 'canvas-confetti';

interface PetSelectionProps {
  onSelect: (name: string, species: PetSpecies) => void;
}

export const PetSelection: React.FC<PetSelectionProps> = ({ onSelect }) => {
  const [name, setName] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<PetSpecies | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const speciesOptions: { id: PetSpecies; name: string; description: string; color: string; icon: string; border: string }[] = [
    { id: 'slime', name: '史莱姆', description: '软绵绵的，最喜欢抱抱', color: 'bg-[#B2EBF2]', border: 'border-[#00ACC1]', icon: '💧' },
    { id: 'dragon', name: '小火龙', description: '调皮捣蛋，梦想是飞翔', color: 'bg-[#FFCDD2]', border: 'border-[#E53935]', icon: '🔥' },
    { id: 'cat', name: '好奇猫', description: '聪明伶俐，学习的好帮手', color: 'bg-[#FFE0B2]', border: 'border-[#FB8C00]', icon: '🐱' },
    { id: 'robot', name: '小机器人', description: '逻辑满分，科技感十足', color: 'bg-[#D1C4E9]', border: 'border-[#5E35B1]', icon: '🤖' },
    { id: 'rabbit', name: '长耳兔', description: '蹦蹦跳跳，活力四射', color: 'bg-[#F8BBD0]', border: 'border-[#C2185B]', icon: '🐰' },
    { id: 'panda', name: '圆圆熊猫', description: '憨态可掬，最爱吃竹子', color: 'bg-[#F5F5F5]', border: 'border-[#424242]', icon: '🐼' },
    { id: 'frog', name: '跳跳蛙', description: '歌声嘹亮，夏天的精灵', color: 'bg-[#C8E6C9]', border: 'border-[#388E3C]', icon: '🐸' },
    { id: 'pig', name: '粉粉猪', description: '爱睡懒觉，福气满满', color: 'bg-[#FCE4EC]', border: 'border-[#F06292]', icon: '🐷' },
    { id: 'tiger', name: '小老虎', description: '威风凛凛，勇敢的小战士', color: 'bg-[#FFE0B2]', border: 'border-[#F57C00]', icon: '🐯' },
    { id: 'elephant', name: '憨憨象', description: '温柔稳重，记忆力超群', color: 'bg-[#E1F5FE]', border: 'border-[#0288D1]', icon: '🐘' },
    { id: 'dinosaur', name: '小恐龙', description: '远古来客，好奇心爆棚', color: 'bg-[#E8F5E9]', border: 'border-[#2E7D32]', icon: '🦖' },
    { id: 'fox', name: '灵狐', description: '机智过人，优雅的化身', color: 'bg-[#FFF3E0]', border: 'border-[#E65100]', icon: '🦊' },
    { id: 'penguin', name: '企鹅仔', description: '摇摇晃晃，极地小绅士', color: 'bg-[#ECEFF1]', border: 'border-[#263238]', icon: '🐧' },
    { id: 'lion', name: '小狮子', description: '森林之王，自信满满', color: 'bg-[#FFF9C4]', border: 'border-[#FBC02D]', icon: '🦁' },
    { id: 'bulbasaur', name: '妙蛙种子', description: '草系宝可梦，背上的种子会发芽', color: 'bg-[#E0F2F1]', border: 'border-[#4DB6AC]', icon: '🍃' },
    { id: 'charmander', name: '小火龙', description: '火系宝可梦，尾巴上的火焰是生命力', color: 'bg-[#FFF3E0]', border: 'border-[#FFB74D]', icon: '🔥' },
    { id: 'squirtle', name: '杰尼龟', description: '水系宝可梦，坚硬的甲壳是最好的防御', color: 'bg-[#E3F2FD]', border: 'border-[#64B5F6]', icon: '💧' },
    { id: 'pikachu', name: '皮卡丘', description: '电系宝可梦，脸颊上有电力袋', color: 'bg-[#FFFDE7]', border: 'border-[#FFF176]', icon: '⚡' },
    { id: 'meowth', name: '喵喵', description: '喜欢闪亮的东西，额头上有金币', color: 'bg-[#FAFAFA]', border: 'border-[#BDBDBD]', icon: '💰' },
    { id: 'eevee', name: '伊布', description: '拥有无限进化的可能', color: 'bg-[#EFEBE9]', border: 'border-[#A1887F]', icon: '🦊' },
    { id: 'jigglypuff', name: '胖丁', description: '歌声动听，能让人陷入沉睡', color: 'bg-[#FCE4EC]', border: 'border-[#F06292]', icon: '🎵' },
    { id: 'mew', name: '梦幻', description: '传说中的宝可梦，拥有所有宝可梦的基因', color: 'bg-[#FCE4EC]', border: 'border-[#F06292]', icon: '🌈' },
  ];

  const handleRoll = () => {
    setIsRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setSelectedSpecies(speciesOptions[Math.floor(Math.random() * speciesOptions.length)].id);
      count++;
      if (count > 15) {
        clearInterval(interval);
        setIsRolling(false);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
    }, 100);
  };

  const handleStart = () => {
    if (name.trim() && selectedSpecies) {
      onSelect(name.trim(), selectedSpecies);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-xl rounded-[4rem] p-12 shadow-[24px_24px_0px_rgba(93,64,55,0.1)] border-4 border-[#5D4037] relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FFF3E0] to-transparent opacity-50" />
      
      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex p-4 bg-[#FFAB91] rounded-[2rem] mb-6 border-4 border-[#5D4037] rotate-[-2deg] shadow-lg">
          <Gift className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-5xl font-black text-[#5D4037] mb-4 font-hand">领养你的学习伙伴</h2>
        <p className="text-[#8D6E63] font-bold text-xl">给它起个好听的名字，开启成长之旅吧！</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        {/* Left Side: Name & Blind Box */}
        <div className="space-y-10">
          <div className="space-y-4">
            <label className="block text-xl font-black text-[#5D4037] ml-4 font-hand">宠物名字</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：小太阳、皮皮..."
              className="w-full px-8 py-5 rounded-[2.5rem] bg-white border-4 border-[#D7CCC8] focus:border-[#FFAB91] outline-none transition-all text-2xl font-black text-[#5D4037] placeholder:text-[#D7CCC8] shadow-inner"
            />
          </div>

          <div className="p-8 bg-[#FFF9F2] rounded-[3rem] border-4 border-dashed border-[#FFAB91] text-center">
            <h3 className="text-2xl font-black text-[#5D4037] mb-6 font-hand">试试运气？</h3>
            <button
              onClick={handleRoll}
              disabled={isRolling}
              className="group relative inline-flex items-center justify-center px-10 py-5 bg-[#FFD54F] text-[#5D4037] rounded-[2rem] text-2xl font-black shadow-[8px_8px_0px_#FBC02D] border-4 border-[#5D4037] hover:translate-y-[-4px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50"
            >
              <Box className={cn("w-8 h-8 mr-3", isRolling && "animate-bounce")} />
              抽取盲盒
            </button>
            <p className="mt-4 text-sm font-bold text-[#A1887F]">随机获得一个神秘的小伙伴！</p>
          </div>
        </div>

        {/* Right Side: Species Selection */}
        <div className="space-y-6">
          <label className="block text-xl font-black text-[#5D4037] ml-4 font-hand">选择种类</label>
          <div className="grid grid-cols-2 gap-4">
            {speciesOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedSpecies(option.id)}
                className={cn(
                  "p-6 rounded-[2.5rem] border-4 transition-all text-left relative group overflow-hidden",
                  option.color,
                  option.border,
                  selectedSpecies === option.id 
                    ? "shadow-[8px_8px_0px_#5D4037] translate-y-[-4px]" 
                    : "opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0"
                )}
              >
                <div className="text-4xl mb-3">{option.icon}</div>
                <h4 className="text-xl font-black text-[#5D4037] mb-1 font-hand">{option.name}</h4>
                <p className="text-[10px] font-bold text-[#5D4037]/70 leading-tight">{option.description}</p>
                {selectedSpecies === option.id && (
                  <div className="absolute top-3 right-3">
                    <Sparkles className="w-5 h-5 text-[#5D4037] animate-pulse" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 text-center relative z-10">
        <button
          onClick={handleStart}
          disabled={!name.trim() || !selectedSpecies || isRolling}
          className="px-16 py-6 bg-[#FF7043] text-white rounded-[3rem] text-3xl font-black shadow-[12px_12px_0px_#D84315] border-4 border-[#5D4037] hover:translate-y-[-4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-30 disabled:grayscale disabled:shadow-none font-hand"
        >
          开启成长之旅！✨
        </button>
      </div>
    </div>
  );
};
