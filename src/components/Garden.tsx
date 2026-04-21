import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sprout, Droplets, Sun, Trees, Lock, Coins, Sparkles, PlusCircle, Trash2 } from 'lucide-react';
import { Plant, GardenState } from '../types';
import { cn } from '../lib/utils';

interface GardenProps {
  garden: GardenState;
  level: number;
  points: number;
  onPlant: (seedId: string) => void;
  onWater: (plantId: string) => void;
  onSun: (plantId: string) => void;
  onHarvest: (plantId: string) => void;
  onClear: (plantId: string) => void;
}

export const Garden: React.FC<GardenProps> = ({ 
  garden, 
  level, 
  points, 
  onPlant, 
  onWater, 
  onSun, 
  onHarvest,
  onClear 
}) => {
  const isUnlocked = level >= 30;

  if (!isUnlocked) {
    return (
      <div className="w-full max-w-4xl mx-auto p-12 text-center">
        <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-16 border-4 border-dashed border-[#D7CCC8] shadow-xl">
          <div className="inline-flex p-6 bg-[#F5F5F5] rounded-full mb-8">
            <Lock className="w-16 h-16 text-[#A1887F]" />
          </div>
          <h2 className="text-4xl font-black text-[#5D4037] mb-6 font-hand">神秘的后花园</h2>
          <p className="text-[#8D6E63] font-bold text-xl mb-8">
            这里的土地非常肥沃，但需要强大的等级能量才能开启。
          </p>
          <div className="bg-[#FFECB3] inline-block px-8 py-4 rounded-2xl border-4 border-[#FFE082]">
            <span className="text-2xl font-black text-[#795548]">解锁等级：Lv.30</span>
          </div>
          <div className="mt-12 text-[#A1887F] font-bold">
            当前等级：Lv.{level}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-[#81C784] p-3 rounded-2xl border-4 border-[#388E3C] shadow-[4px_4px_0px_#2E7D32]">
            <Trees className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-[#5D4037] font-hand">我的后花园</h2>
            <p className="text-[#8D6E63] font-bold">在这片土地上培育属于你的奇迹吧！</p>
          </div>
        </div>

        <div className="bg-white px-6 py-3 rounded-2xl border-4 border-[#FF7043] shadow-[4px_4px_0px_#FF7043] flex items-center gap-3">
          <Coins className="w-6 h-6 text-[#FF7043]" />
          <span className="text-2xl font-black text-[#5D4037]">{points}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {garden.plants.map((plant) => (
          <PlantCard 
            key={plant.id} 
            plant={plant} 
            points={points}
            onWater={onWater}
            onSun={onSun}
            onHarvest={onHarvest}
            onClear={onClear}
          />
        ))}

        {garden.plants.length < 6 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-[400px] bg-[#E8F5E9] rounded-[3rem] border-4 border-dashed border-[#81C784] flex flex-col items-center justify-center gap-4 group transition-colors hover:bg-[#C8E6C9] cursor-pointer"
            onClick={() => {
                // This will be handled by the parent to show a selection or simple logic
                onPlant('seed_rose'); // Default for now
            }}
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-[#81C784] group-hover:scale-110 transition-transform">
              <PlusCircle className="w-10 h-10 text-[#388E3C]" />
            </div>
            <span className="text-xl font-black text-[#2E7D32] font-hand">点击播种新植物</span>
            <p className="text-xs font-bold text-[#8D6E63]">需要 100 学习币</p>
          </motion.button>
        )}
      </div>

      <div className="mt-12 p-8 bg-[#FFF9C4] rounded-[3rem] border-4 border-[#FFF176] relative overflow-hidden">
        <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12">
           <Sun className="w-48 h-48" />
        </div>
        <h3 className="text-xl font-black text-[#F57F17] mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            园艺指南
        </h3>
        <ul className="space-y-2 text-[#5D4037] font-bold">
            <li>🌱 植物需要水分和充足的日照才能茁壮成长。</li>
            <li>💧 浇水 (50币)：增加水分，促进生长。</li>
            <li>☀️ 日照 (50币)：增加光照阳光，大幅提升成长速度。</li>
            <li>🏆 达到 100% 成熟度后即可收割，获得大量 XP 和神秘奖励！</li>
        </ul>
      </div>
    </div>
  );
};

const PlantCard: React.FC<{
    plant: Plant;
    points: number;
    onWater: (id: string) => void;
    onSun: (id: string) => void;
    onHarvest: (id: string) => void;
    onClear: (id: string) => void;
}> = ({ plant, points, onWater, onSun, onHarvest, onClear }) => {
    const isMature = plant.growth >= 100;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "bg-white rounded-[3rem] border-4 p-8 flex flex-col items-center shadow-lg relative",
                isMature ? "border-[#FFD54F] bg-[#FFFDE7]" : "border-[#81C784]"
            )}
        >
            <div className="absolute top-4 right-4">
                <button 
                  onClick={() => onClear(plant.id)}
                  className="p-2 text-[#D7CCC8] hover:text-red-500 transition-colors"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <div className="relative mb-8 pt-4">
                <div className="w-32 h-32 bg-[#F1F8E9] rounded-full border-4 border-[#DCEDC8] flex items-center justify-center text-6xl">
                    <motion.div
                        animate={!isMature ? { 
                            y: [0, -10, 0],
                            scale: [1, 1.05, 1]
                        } : {}}
                        transition={{ repeat: Infinity, duration: 3 }}
                    >
                        {plant.stage === 'seed' ? '🌰' : 
                         plant.stage === 'sprout' ? '🌱' : 
                         plant.stage === 'growing' ? '🌿' : 
                         plant.icon}
                    </motion.div>
                </div>
                {isMature && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-4 -right-4 bg-[#FFD54F] p-2 rounded-full border-2 border-white shadow-lg"
                    >
                        <Sparkles className="w-6 h-6 text-[#F57F17] animate-spin-slow" />
                    </motion.div>
                )}
            </div>

            <h3 className="text-2xl font-black text-[#5D4037] mb-2 font-hand">{plant.name}</h3>
            
            <div className="w-full space-y-4 mb-8">
                <div>
                    <div className="flex justify-between text-xs font-black text-[#8D6E63] mb-1 uppercase">
                        <span>生长进度</span>
                        <span>{Math.floor(plant.growth)}%</span>
                    </div>
                    <div className="h-4 bg-[#EFEBE9] rounded-full border-2 border-[#D7CCC8] overflow-hidden p-0.5">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${plant.growth}%` }}
                            className="h-full bg-[#81C784] rounded-full"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-1 text-[10px] font-black text-[#0288D1] mb-1">
                            <Droplets className="w-3 h-3" /> 水分
                        </div>
                        <div className="h-2 bg-[#E1F5FE] rounded-full overflow-hidden">
                             <div className="h-full bg-[#4FC3F7]" style={{ width: `${plant.water}%` }} />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-1 text-[10px] font-black text-[#F57F17] mb-1">
                            <Sun className="w-3 h-3" /> 日照
                        </div>
                        <div className="h-2 bg-[#FFF9C4] rounded-full overflow-hidden">
                             <div className="h-full bg-[#FFD54F]" style={{ width: `${plant.sun}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col gap-3">
                {isMature ? (
                    <button
                        onClick={() => onHarvest(plant.id)}
                        className="w-full py-4 bg-[#FFD54F] text-[#5D4037] rounded-2xl font-black border-b-4 border-[#FBC02D] hover:translate-y-[-2px] active:translate-y-[2px] active:border-b-0 transition-all flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-5 h-5" /> 收割果实!
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={() => onWater(plant.id)}
                            disabled={points < 50 || plant.water >= 100}
                            className={cn(
                                "flex-1 py-3 rounded-2xl font-black transition-all flex flex-col items-center gap-1",
                                points >= 50 && plant.water < 100
                                ? "bg-[#4FC3F7] text-white border-b-4 border-[#0288D1] hover:translate-y-[-2px]"
                                : "bg-slate-100 text-slate-300 border-b-4 border-slate-200 cursor-not-allowed"
                            )}
                        >
                            <Droplets className="w-4 h-4" />
                            <span className="text-[10px]">浇水 (50)</span>
                        </button>
                        <button
                            onClick={() => onSun(plant.id)}
                            disabled={points < 50 || plant.sun >= 100}
                            className={cn(
                                "flex-1 py-3 rounded-2xl font-black transition-all flex flex-col items-center gap-1",
                                points >= 50 && plant.sun < 100
                                ? "bg-[#FFD54F] text-[#5D4037] border-b-4 border-[#FBC02D] hover:translate-y-[-2px]"
                                : "bg-slate-100 text-slate-300 border-b-4 border-slate-200 cursor-not-allowed"
                            )}
                        >
                            <Sun className="w-4 h-4" />
                            <span className="text-[10px]">日照 (50)</span>
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
