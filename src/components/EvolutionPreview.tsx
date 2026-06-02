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

const slimePath = [
  { level: 1, species: 'slime_1', name: '初级史莱姆', icon: '💧', type: '初始形态', desc: '最喜欢抱抱的软萌团子', color: 'bg-gradient-to-b from-sky-300 to-sky-500', border: 'border-sky-300' },
  { level: 21, species: 'slime_2', name: '水雾', icon: '🌫️', type: '水雾蜕变', desc: '融合纯净水雾，轻盈若隐', color: 'bg-gradient-to-b from-[#B2EBF2] via-[#00ACC1] to-[#00838F]', border: 'border-[#E0F7FA]' },
  { level: 36, species: 'slime_3', name: '燃珠', icon: '🔮', type: '炽热凝聚', desc: '孕育具有炽热温度的生命核心', color: 'bg-gradient-to-b from-[#FFEE58] via-[#FFCA28] to-[#EF6C00]', border: 'border-yellow-200' },
  { level: 46, species: 'slime_4', name: '熔岩', icon: '🌋', type: '地脉裂变', desc: '爆裂熔岩，流动炎浪', color: 'bg-gradient-to-b from-[#E64A19] via-[#BF360C] to-[#210400]', border: 'border-[#FF7043]' },
  { level: 56, species: 'slime_5', name: '冰晶史', icon: '❄️', type: '剔透冰结', desc: '冷冽冰盾，晶莹剔透而坚毅', color: 'bg-gradient-to-b from-[#E0F7FA] via-[#4DD0E1] to-[#0288D1]', border: 'border-white' },
  { level: 66, species: 'slime_6', name: '风刃', icon: '🌀', type: '急风切割', desc: '疾风为刃，优雅而高速穿梭', color: 'bg-gradient-to-b from-[#E0F2F1] via-[#26A69A] to-[#004D40]', border: 'border-[#80CBC4]' },
  { level: 76, species: 'slime_7', name: '幽紫史', icon: '👾', type: '暗影魔力', desc: '弥漫深邃幽紫的神秘暗系形态', color: 'bg-gradient-to-b from-[#BA68C8] via-[#7B1FA2] to-[#311B92]', border: 'border-[#E1BEE7]' },
  { level: 86, species: 'slime_8', name: '花叶史', icon: '🌸', type: '自然共生', desc: '凝聚万物春生，繁茂之绿', color: 'bg-gradient-to-b from-[#C8E6C9] via-[#4CAF50] to-[#1B5E20]', border: 'border-[#A5D6A7]' },
  { level: 96, species: 'slime_9', name: '巨型综合体', icon: '🌟', type: '九合至尊', desc: '融合九种核心属性的究极主宰', color: 'bg-gradient-to-br from-[#F06292] via-[#E11D48] to-[#3B82F6]', border: 'border-[#F87171]' },
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

const charizardPath = [
  { level: 1, species: 'charmander', name: '小火龙', icon: '🔥', type: '初始形态', desc: '开启你的炽热冒险', color: 'bg-[#FFF3E0]', border: 'border-[#FFB74D]' },
  { level: 21, species: 'charmeleon', name: '火恐龙', icon: '🦖', type: '成长进化', desc: '眼神变得犀利了', color: 'bg-[#FFAB91]', border: 'border-[#E64A19]' },
  { level: 36, species: 'charizard_master', name: '喷火空（主宰）', icon: '👑', type: '主宰形态', desc: '绝对的力量压制', color: 'bg-[#FFB74D]', border: 'border-[#EF6C00]' },
  { level: 46, species: 'mega_charizard', name: '超级喷火龙', icon: '💥', type: '超级进化 X', desc: '苍蓝火焰焚尽一切', color: 'bg-[#90A4AE]', border: 'border-[#455A64]' },
  { level: 56, species: 'mega_charizard_glow', name: '超级喷火龙（辉光）', icon: '✨', type: '超级进化 Y', desc: '破晓之光辉映长空', color: 'bg-[#FFCC80]', border: 'border-[#F57C00]' },
  { level: 66, species: 'gigantamax_charizard', name: '超级巨喷龙空', icon: '🐉', type: '超极巨化', desc: '如火山般壮大的身躯', color: 'bg-[#FF8A65]', border: 'border-[#D84315]' },
  { level: 76, species: 'charcadet', name: '炭小侍（武者志）', icon: '⚔️', type: '武者之魂', desc: '历经磨难的武道家', color: 'bg-[#546E7A]', border: 'border-[#263238]' },
  { level: 86, species: 'koraidon', name: '故勒顿（龙王终焉）', icon: '🤴', type: '远古龙王', desc: '主宰终焉的龙族之王', color: 'bg-[#EF5350]', border: 'border-[#C62828]' },
  { level: 96, species: 'gouging_fire', name: '破空焰', icon: '🔥', type: '传说形态', desc: '焚烧虚空的终极之炎', color: 'bg-[#D32F2F]', border: 'border-[#B71C1C]' },
];

const pikachuPath = [
  { level: 1, species: 'pichu', name: '皮丘', icon: '🍼', type: '初始形态', desc: '活泼可爱的小不点', color: 'bg-[#FFFDE7]', border: 'border-[#FFF4B3]' },
  { level: 21, species: 'pikachu', name: '皮卡丘', icon: '⚡', type: '雷系成长', desc: '积累饱满电力的小电鼠', color: 'bg-[#FFFDE7]', border: 'border-[#FFF176]' },
  { level: 36, species: 'xuanjia_nine', name: '玄甲九号', icon: '🤖', type: '钢铁武装', desc: '身披钢铁装甲的机械守卫', color: 'bg-[#ECEFF1]', border: 'border-[#B0BEC5]' },
  { level: 46, species: 'raichu', name: '雷丘', icon: '⚡', type: '雷电进化', desc: '拥有强大雷鸣能量的雷兽', color: 'bg-[#FFF3E0]', border: 'border-[#FFB74D]' },
  { level: 56, species: 'wanleizun', name: '超级巨·万雷尊', icon: '☁️', type: '极巨化神', desc: '万雷降临的至尊主宰', color: 'bg-[#FFFDE7]', border: 'border-[#FFF176]' },
  { level: 66, species: 'leizhu', name: '雷柱', icon: '🏛️', type: '雷霆之体', desc: '凝练不灭的雷动高耸之柱', color: 'bg-[#FFFDE7]', border: 'border-[#FFF176]' },
  { level: 76, species: 'nulei', name: '怒雷', icon: '🏄', type: '怒涛雷光', desc: '踩着电光浪花席卷大地', color: 'bg-[#FFFDE7]', border: 'border-[#FFF176]' },
  { level: 86, species: 'ranyuan_leidu', name: '蝾螈（雷毒）', icon: '🦎', type: '变异共生', desc: '雷毒双星合一的终极变异', color: 'bg-[#F3E5F5]', border: 'border-[#AB47BC]' },
  { level: 91, species: 'leimao_huanying', name: '雷猫（幻影）', icon: '🐈', type: '幻影神驱', desc: '掌控等离子狂流的雷霆幻影', color: 'bg-[#FFFDE7]', border: 'border-[#FFF176]' },
  { level: 96, species: 'chuan_shuo_shen_qu', name: '传说版神驱', icon: '🏍️', type: '终极传说级', desc: '持脚电光的超光速神驱', color: 'bg-[#EDE7F6]', border: 'border-[#9575CD]' },
];

export const EvolutionPreview: React.FC<EvolutionPreviewProps> = ({ isOpen, onClose, currentLevel, currentSpecies }) => {
  const isSlimeFamily = currentSpecies === 'slime';
  const isBulbasaurFamily = ['bulbasaur', 'ivysaur', 'venusaur', 'venusaur_sky', 'mega_venusaur', 'zacian_forest', 'zarude', 'iron_leaves', 'virizion_god'].includes(currentSpecies);
  const isCharizardFamily = ['dragon', 'charmander', 'charizard', 'charmeleon', 'charizard_master', 'mega_charizard', 'mega_charizard_glow', 'gigantamax_charizard', 'charcadet', 'koraidon', 'gouging_fire'].includes(currentSpecies);
  const isPikachuFamily = ['pichu', 'pikachu', 'xuanjia_nine', 'raichu', 'wanleizun', 'leizhu', 'nulei', 'ranyuan_leidu', 'leimao_huanying', 'chuan_shuo_shen_qu'].includes(currentSpecies);
  
  const getSlimeStageIndex = (level: number) => {
    if (level <= 20) return 0;
    if (level <= 35) return 1;
    if (level <= 45) return 2;
    if (level <= 55) return 3;
    if (level <= 65) return 4;
    if (level <= 75) return 5;
    if (level <= 85) return 6;
    if (level <= 95) return 7;
    return 8;
  };

  const currentPath = isSlimeFamily
    ? slimePath
    : isPikachuFamily 
      ? pikachuPath 
      : isCharizardFamily 
        ? charizardPath 
        : isBulbasaurFamily 
          ? bulbasaurPath 
          : eeveePath;

  const familyTitle = isSlimeFamily
    ? '史莱姆蜕变进化图鉴'
    : isPikachuFamily 
      ? '天雷进化图谱' 
      : isCharizardFamily 
        ? '炽焰进化图谱' 
        : isBulbasaurFamily 
          ? '森罗进化图谱' 
          : '伊布家族预览';

  const headerColor = isSlimeFamily
    ? 'bg-[#29B6F6]'
    : isPikachuFamily 
      ? 'bg-[#FBC02D]' 
      : isCharizardFamily 
        ? 'bg-[#F4511E]' 
        : isBulbasaurFamily 
          ? 'bg-[#66BB6A]' 
          : 'bg-[#4FC3F7]';

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
                  const isCurrent = isSlimeFamily
                    ? index === getSlimeStageIndex(currentLevel)
                    : currentSpecies === stage.species;
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
                <p className="text-sm font-bold leading-tight flex-1">
                  {isSlimeFamily 
                    ? "通过不断的学习与自律，史莱姆将不断激发自身潜力，吸收大自然元素从而发生九合蜕变，终能成长为吞吐万物的至尊巨型综合体！"
                    : isPikachuFamily ? "无与伦比的电属性力量！通过不断的学习与自律，积蓄雷鸣能量，终将蜕变为不可战胜的传说级神驱。" : isCharizardFamily ? "由于炽热的斗志，喷火龙家族将不断突破自我！每一步进化都预示着更强的火焰与力量。" : isBulbasaurFamily ? "释放森林的自然潜能！通过不断的学习与自律，妙蛙种子终将蜕变为森罗神武。" : "不断完成学习任务，积累经验值！每提升一级都离更强大的形态更近一步。"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
