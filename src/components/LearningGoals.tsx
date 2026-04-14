import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, CheckCircle2, Trophy, Star, TrendingUp, Settings2, Plus, Trash2, Coins, AlertTriangle, Minus } from 'lucide-react';
import { LearningGoal } from '../types';
import { cn } from '../lib/utils';

interface LearningGoalsProps {
  goals: LearningGoal[];
  onAddGoal: (goal: Omit<LearningGoal, 'id' | 'current' | 'isCompleted'>) => void;
  onDeleteGoal: (goalId: string) => void;
  onDeductPoints: (amount: number, reason: string) => void;
}

export const LearningGoals: React.FC<LearningGoalsProps> = ({ goals, onAddGoal, onDeleteGoal, onDeductPoints }) => {
  const [isParentMode, setIsParentMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPenaltyForm, setShowPenaltyForm] = useState(false);
  const [newGoal, setNewGoal] = useState<Omit<LearningGoal, 'id' | 'current' | 'isCompleted'>>({
    title: '',
    type: 'tasks',
    target: 10,
    rewardPoints: 100
  });

  const [penalty, setPenalty] = useState({ amount: 10, reason: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.title.trim()) {
      onAddGoal(newGoal);
      setNewGoal({ title: '', type: 'tasks', target: 10, rewardPoints: 100 });
      setShowAddForm(false);
    }
  };

  const handlePenaltySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (penalty.amount > 0 && penalty.reason.trim()) {
      onDeductPoints(penalty.amount, penalty.reason);
      setPenalty({ amount: 10, reason: '' });
      setShowPenaltyForm(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-[#4FC3F7] p-3 rounded-2xl border-4 border-[#5D4037] shadow-[4px_4px_0px_#0288D1]">
            <Target className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-[#5D4037] font-hand">学习目标</h2>
            <p className="text-[#8D6E63] font-bold">达成目标，解锁更多奖品！</p>
          </div>
        </div>

        <button
          onClick={() => setIsParentMode(!isParentMode)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl font-black transition-all border-2",
            isParentMode 
              ? "bg-[#5D4037] text-white border-[#5D4037]" 
              : "bg-white text-[#5D4037] border-[#D7CCC8] hover:border-[#5D4037]"
          )}
        >
          <Settings2 className="w-4 h-4" />
          {isParentMode ? "退出家长模式" : "家长管理"}
        </button>
      </div>

      <AnimatePresence>
        {isParentMode && (
          <div className="space-y-6 mb-12">
            {/* Add Goal Form */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 bg-[#E1F5FE] rounded-[3rem] border-4 border-[#B3E5FC] relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Plus className="w-6 h-6 text-[#0288D1]" />
                  <h3 className="text-2xl font-black text-[#5D4037] font-hand">添加新目标</h3>
                </div>
                <button onClick={() => setShowAddForm(!showAddForm)} className="text-[#0288D1] font-black hover:underline">
                  {showAddForm ? "取消" : "立即添加"}
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-[#8D6E63] uppercase mb-1">目标标题</label>
                      <input
                        required
                        type="text"
                        value={newGoal.title}
                        onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#D7CCC8] focus:border-[#4FC3F7] outline-none font-bold"
                        placeholder="例如：连续学习7天"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-[#8D6E63] uppercase mb-1">目标类型</label>
                      <select
                        value={newGoal.type}
                        onChange={e => setNewGoal({ ...newGoal, type: e.target.value as any })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#D7CCC8] focus:border-[#4FC3F7] outline-none font-bold"
                      >
                        <option value="tasks">完成任务数</option>
                        <option value="level">达到等级</option>
                        <option value="xp">积累经验值</option>
                        <option value="custom">自定义目标</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-[#8D6E63] uppercase mb-1">目标数值</label>
                      <input
                        required
                        type="number"
                        value={newGoal.target}
                        onChange={e => setNewGoal({ ...newGoal, target: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#D7CCC8] focus:border-[#4FC3F7] outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-[#8D6E63] uppercase mb-1">奖励学习币</label>
                      <input
                        required
                        type="number"
                        value={newGoal.rewardPoints}
                        onChange={e => setNewGoal({ ...newGoal, rewardPoints: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#D7CCC8] focus:border-[#4FC3F7] outline-none font-bold"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="w-full py-4 bg-[#4FC3F7] text-white rounded-2xl font-black border-b-4 border-[#0288D1] hover:translate-y-[-2px] active:translate-y-[2px] active:border-b-0 transition-all">
                      确认添加目标
                    </button>
                  </div>
                </form>
              )}
            </motion.div>

            {/* Penalty Form */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 bg-[#FFEBEE] rounded-[3rem] border-4 border-[#FFCDD2] relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-[#E53935]" />
                  <h3 className="text-2xl font-black text-[#5D4037] font-hand">扣除积分 (惩罚)</h3>
                </div>
                <button onClick={() => setShowPenaltyForm(!showPenaltyForm)} className="text-[#E53935] font-black hover:underline">
                  {showPenaltyForm ? "取消" : "立即扣除"}
                </button>
              </div>

              {showPenaltyForm && (
                <form onSubmit={handlePenaltySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-[#8D6E63] uppercase mb-1">扣除原因</label>
                      <input
                        required
                        type="text"
                        value={penalty.reason}
                        onChange={e => setPenalty({ ...penalty, reason: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#D7CCC8] focus:border-[#E53935] outline-none font-bold"
                        placeholder="例如：未按时完成作业"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-[#8D6E63] uppercase mb-1">扣除数量</label>
                      <div className="relative">
                        <Minus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E53935]" />
                        <input
                          required
                          type="number"
                          value={penalty.amount}
                          onChange={e => setPenalty({ ...penalty, amount: parseInt(e.target.value) })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-[#D7CCC8] focus:border-[#E53935] outline-none font-bold text-[#E53935]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="w-full py-4 bg-[#E53935] text-white rounded-2xl font-black border-b-4 border-[#B71C1C] hover:translate-y-[-2px] active:translate-y-[2px] active:border-b-0 transition-all">
                      确认扣除积分
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6">
        {goals.map((goal) => {
          const progress = Math.min(100, (goal.current / goal.target) * 100);
          
          return (
            <motion.div
              layout
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "bg-white rounded-[2.5rem] border-4 p-8 relative overflow-hidden",
                goal.isCompleted ? "border-[#81C784] bg-[#F1F8E9]" : "border-[#D7CCC8]"
              )}
            >
              {isParentMode && (
                <button
                  onClick={() => onDeleteGoal(goal.id)}
                  className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors border-2 border-red-100 z-20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-5">
                  <div className={cn(
                    "p-4 rounded-2xl border-4",
                    goal.isCompleted ? "bg-[#81C784] border-[#388E3C]" : "bg-[#E1F5FE] border-[#4FC3F7]"
                  )}>
                    {goal.isCompleted ? (
                      <Trophy className="w-8 h-8 text-white" />
                    ) : (
                      <TrendingUp className="w-8 h-8 text-[#0288D1]" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#5D4037] mb-1">{goal.title}</h3>
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-[#FF7043]" />
                      <span className="text-sm font-black text-[#FF7043]">奖励: {goal.rewardPoints} 学习币</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#5D4037]">{goal.current}</span>
                    <span className="text-[#A1887F] font-black">/ {goal.target}</span>
                  </div>
                  {goal.isCompleted && (
                    <div className="flex items-center gap-2 text-[#388E3C] font-black bg-white px-4 py-1 rounded-full border-2 border-[#81C784]">
                      <CheckCircle2 className="w-4 h-4" />
                      已完成
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <div className="h-6 bg-[#EFEBE9] rounded-full border-2 border-[#D7CCC8] overflow-hidden p-1 shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={cn(
                      "h-full rounded-full border-r-2 border-[#5D4037] transition-all duration-1000",
                      goal.isCompleted ? "bg-[#81C784]" : "bg-[#4FC3F7]"
                    )}
                  />
                </div>
              </div>

              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Star className="w-32 h-32" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
