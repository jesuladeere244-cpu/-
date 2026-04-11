import React from 'react';
import { motion } from 'motion/react';
import { Zap, Brain, Star, Shield, Target, Lock, Clock } from 'lucide-react';
import { PetSkill } from '../types';
import { cn } from '../lib/utils';

interface SkillSystemProps {
  skills: PetSkill[];
  onUseSkill: (skillId: string) => void;
}

const ICON_MAP: Record<string, any> = {
  Zap,
  Brain,
  Star,
  Shield,
  Target,
};

export const SkillSystem: React.FC<SkillSystemProps> = ({ skills = [], onUseSkill }) => {
  return (
    <div className="w-full bg-white/60 p-6 rounded-[3rem] border-4 border-[#D7CCC8] shadow-[12px_12px_0px_rgba(93,64,55,0.05)] mt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#9575CD] p-2 rounded-xl border-2 border-[#5D4037]">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-black text-[#5D4037] font-hand">宠物技能</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills?.map((skill) => {
          const Icon = ICON_MAP[skill.icon] || Zap;
          const isCooldown = skill.lastUsed && skill.cooldown && (Date.now() - skill.lastUsed < skill.cooldown * 1000);
          const remainingTime = isCooldown ? Math.ceil((skill.cooldown! * 1000 - (Date.now() - skill.lastUsed!)) / 1000) : 0;

          return (
            <motion.div
              key={skill.id}
              className={cn(
                "relative p-4 rounded-2xl border-2 transition-all flex items-start gap-4",
                skill.unlocked 
                  ? "bg-white border-[#B39DDB] shadow-[4px_4px_0px_#B39DDB]" 
                  : "bg-slate-100 border-slate-300 opacity-60"
              )}
            >
              <div className={cn(
                "p-3 rounded-xl border-2",
                skill.unlocked ? "bg-[#EDE7F6] border-[#9575CD]" : "bg-slate-200 border-slate-400"
              )}>
                {skill.unlocked ? <Icon className="w-6 h-6 text-[#673AB7]" /> : <Lock className="w-6 h-6 text-slate-400" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-black text-[#5D4037]">{skill.name}</h4>
                  {!skill.unlocked && (
                    <span className="text-[10px] font-black bg-slate-200 px-2 py-0.5 rounded-full text-slate-500">
                      Lv.{skill.minLevel} 解锁
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-[#8D6E63] leading-tight">
                  {skill.description}
                </p>

                {skill.unlocked && skill.cooldown && (
                  <div className="mt-3 flex items-center justify-between">
                    {isCooldown ? (
                      <div className="flex items-center gap-1 text-[10px] font-black text-rose-400">
                        <Clock className="w-3 h-3" />
                        冷却中 ({remainingTime}s)
                      </div>
                    ) : (
                      <button
                        onClick={() => onUseSkill(skill.id)}
                        className="text-[10px] font-black bg-[#9575CD] text-white px-3 py-1 rounded-full hover:bg-[#7E57C2] transition-colors shadow-[2px_2px_0px_#5E35B1] active:translate-y-[1px] active:shadow-none"
                      >
                        使用技能
                      </button>
                    )}
                  </div>
                )}
                
                {skill.unlocked && !skill.cooldown && (
                  <div className="mt-2 text-[10px] font-black text-[#4CAF50] flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-[#4CAF50] rounded-full animate-pulse" />
                    被动技能已生效
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
