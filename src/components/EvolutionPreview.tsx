import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Trophy, Zap, Droplets, Flame, Sun, Moon, Wand2, Leaf, Snowflake } from 'lucide-react';
import { PetSpecies } from '../types';

interface EvolutionPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  currentSpecies: PetSpecies;
}

const eeveePath = [
  { level: 1, species: 'eevee', name: '伊布', icon: '🦊', type: '初始形态', desc: '开启你的冒险之旅', color: 'bg-[#EFEBE9]', border: 'border-[#A1887F]' },
  { level: 21, species: 'vaporeon', name: '水伊布', icon: '💧', type: '水系进化', desc: '身体结构能融入水中', color: 'bg-[#E3F2FD]', border: 'border-[#2196F3]' },
  { level: 32, species: 'jolteon', name: '雷伊布', icon: '⚡', type: '雷系进化', desc: '毛发如针般尖锐', color: 'bg-[#FFFDE7]', border: 'border-[#FBC02D]' },
  { level: 43, species: 'flareon', name: '火伊布', icon: '🔥', type: '火系进化', desc: '体内积存火焰能量', color: 'bg-[#FFEBEE]', border: 'border-[#F44336]' },
  { level: 54, species: 'espeon', name: '太阳伊布', icon: '☀️', type: '超能进化', desc: '能预知对手的动作', color: 'bg-[#F3E5F5]', border: 'border-[#AB47BC]' },
  { level: 65, species: 'umbreon', name: '月亮伊布', icon: '🌙', type: '恶系进化', desc: '在深夜中悄然行动', color: 'bg-[#37474F]', border: 'border-[#263238]' },
  { level: 76, species: 'sylveon', name: '仙子伊布', icon: '✨', type: '妖精进化', desc: '触手能感知心情', color: 'bg-[#FCE4EC]', border: 'border-[#F48FB1]' },
  { level: 86, species: 'leafeon', name: '叶伊布', icon: '🍃', type: '终极形态 I', desc: '具备超高攻击力', color: 'bg-[#F1F8E9]', border: 'border-[#689F38]' },
  { level: 96, species: 'glaceon', name: '冰伊布', icon: '❄️', type: '顶级终极 II', desc: '无敌防御 & 极寒美学', color: 'bg-[#E0F7FA]', border: 'border-[#00BCD4]' },
];

const bulbasaurPath = [
  { level: 1, species: 'bulbasaur', name: '妙蛙种子', icon: '🍃', type: '初始形态', desc: '开启冒险之旅', color: 'bg-[#E8F5E9]', border: 'border-[#81C784]' },
  { level: 21, species: 'ivysaur', name: '妙蛙草', icon: '🌺', type: '成长进化', desc: '花蕾正在绽放', color: 'bg-[#E0F2F1]', border: 'border-[#4DB6AC]' },
  { level: 36, species: 'venusaur', name: '妙蛙花', icon: '🌴', type: '完全体', desc: '散发出迷人香气', color: 'bg-[#C8E6C9]', border: 'border-[#66BB6A]' },
  { level: 46, species: 'venusaur_sky', name: '妙蛙花(天穹)', icon: '☁️', type: '天穹形态', desc: '掌控天空之力', color: 'bg-[#E8F5E9]', border: 'border-[#81C784]' },
  { level: 56, species: 'mega_venusaur', name: '超级妙蛙花', icon: '💥', type: '超级进化', desc: '爆发极致木属性', color: 'bg-[#A5D6A7]', border: 'border-[#2E7D32]' },
  { level: 66, species: 'zacian_forest', name: '起源·剑圣', icon: '⚔️', type: '创世进化', desc: '执掌森罗圣剑', color: 'bg-[#E3F2FD]', border: 'border-[#1E88E5]' },
  { level: 76, species: 'zarude', name: '丛林守护者', icon: '🐒', type: '霸主形态', desc: '密林的野性统领', color: 'bg-[#3E2723]', border: 'border-[#5D4037]' },
  { level: 86, species: 'iron_leaves', name: '铁斑叶', icon: '🤖', type: '未来形态', desc: '超极巨·妙蛙山', color: 'bg-[#F1F8E9]', border: 'border-[#00C853]' },
  { level: 96, species: 'virizion_god', name: '森罗神武', icon: '👑', type: '传说形态', desc: '无敌防御与极意', color: 'bg-[#DCEDC8]', border: 'border-[#558B2F]' },
];

export const EvolutionPreview: React.FC<EvolutionPreviewProps> = ({ isOpen, onClose, currentLevel, currentSpecies }) => {
  const isBulbasaurFamily = ['bulbasaur', 'ivysaur', 'venusaur', 'venusaur_sky', 'mega_venusaur', 'zacian_forest', 'zarude', 'iron_leaves', 'virizion_god'].includes(currentSpecies);
  const currentPath = isBulbasaurFamily ? bulbasaurPath : eeveePath;
  const familyTitle = isBulbasaurFamily ? '森罗进化图谱' : '伊布家族预览';
  const headerColor = isBulbasaurFamily ? 'bg-[#66BB6A]' : 'bg-[#4FC3F7]';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] border-4 border-[#5D4037] shadow-[12px_12px_0px_#5D4037] overflow-hidden"
          >
            {/* Header */}
            <div className={`${headerColor} p-6 border-b-4 border-[#5D4037] flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-white drop-shadow-md" />
                <h2 className="text-3xl font-black text-[#5D4037] font-hand">{familyTitle}</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-white rounded-xl border-2 border-[#5D4037] hover:bg-red-50 transition-colors"
              >
                <X className="w-6 h-6 text-[#5D4037]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {currentPath.map((stage, index) => {
                  const isUnlocked = currentLevel >= stage.level;
                  const isCurrent = currentSpecies === stage.species;
                  const isFinal = index >= 7;
                  
                  return (
                    <div 
                      key={stage.species}
                      className={`relative p-4 rounded-3xl border-2 transition-all ${
                        isCurrent 
                          ? 'border-[#FFB300] bg-orange-50 scale-105 z-10 shadow-lg' 
                          : isUnlocked 
                            ? 'border-[#5D4037] bg-white ' 
                            : 'border-dashed border-[#D7CCC8] opacity-60 grayscale'
                      } ${isFinal && isUnlocked ? 'ring-4 ring-[#FFD54F]/30' : ''}`}
                    >
                      {isCurrent && (
                        <div className="absolute -top-3 -right-2 bg-[#FFB300] text-white text-[10px] font-black px-2 py-1 rounded-full border-2 border-[#5D4037] animate-bounce z-20">
                          当前形态
                        </div>
                      )}

                      {isFinal && (
                        <div className="absolute -top-2 -left-2 bg-[#FF7043] text-white text-[8px] font-black px-2 py-0.5 rounded-full border-2 border-[#5D4037] z-20 rotate-[-10deg]">
                          LEGENDARY
                        </div>
                      )}
                      
                      <div className={`w-16 h-16 mx-auto ${stage.color} ${stage.border} border-4 rounded-2xl flex items-center justify-center text-3xl mb-2 shadow-inner`}>
                        {stage.icon}
                      </div>
                      
                      <div className="text-center">
                        <p className={`text-[10px] font-black uppercase tracking-wider ${isFinal ? 'text-[#FF7043]' : 'text-[#8D6E63]'}`}>
                          {stage.type}
                        </p>
                        <h3 className="font-black text-[#5D4037] truncate">{stage.name}</h3>
                        <p className="text-[9px] text-[#A1887F] font-bold leading-tight mt-1 h-6 flex items-center justify-center">
                          {stage.desc}
                        </p>
                        <div className="mt-2 inline-block px-3 py-1 bg-[#EFEBE9] rounded-full text-[10px] font-bold text-[#5D4037]">
                          Lv.{stage.level}+ 解锁
                        </div>
                      </div>

                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] rounded-3xl flex flex-col items-center justify-center pointer-events-none">
                          <Zap className="w-6 h-6 text-[#D7CCC8]" />
                          <p className="text-[10px] font-black text-[#8D6E63] mt-1">尚未解锁</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-[#FEF9F3] border-t-2 border-[#D7CCC8]">
              <div className="flex items-center gap-4 text-[#795548]">
                <div className="bg-white p-3 rounded-2xl border-2 border-[#D7CCC8]">
                  <Trophy className="w-6 h-6 text-[#FFB300]" />
                </div>
                <p className="text-sm font-bold leading-tight">
                  {isBulbasaurFamily ? "释放森林的自然潜能！通过不断的学习与自律，妙蛙种子终将蜕变为森罗神武。" : "不断完成学习任务，积累经验值！每提升一级都离更强大的形态更近一步。"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
