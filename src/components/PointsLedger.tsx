import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Coins, 
  ArrowUpRight, 
  ArrowDownRight, 
  Target, 
  Plus, 
  Minus, 
  TrendingUp, 
  CheckCircle2, 
  Settings2,
  AlertTriangle,
  Gift,
  Calendar,
  Edit2,
  Trash2,
  Check,
  X,
  PlusCircle,
  HelpCircle,
  Award
} from 'lucide-react';
import { PointsLog, LearningGoal } from '../types';
import { cn } from '../lib/utils';

interface PointsLedgerProps {
  pointsHistory?: PointsLog[];
  goals: LearningGoal[];
  onDeductPoints: (amount: number, reason: string) => void;
  points: number;
  petName: string;
  onAddGoal?: (goal: Omit<LearningGoal, 'id' | 'current' | 'isCompleted'>) => void;
  onDeleteGoal?: (goalId: string) => void;
  onUpdateGoal?: (updatedGoal: LearningGoal) => void;
}

export const PointsLedger: React.FC<PointsLedgerProps> = ({
  pointsHistory = [],
  goals,
  onDeductPoints,
  points,
  petName,
  onAddGoal,
  onDeleteGoal,
  onUpdateGoal
}) => {
  const [isParentMode, setIsParentMode] = useState(false);
  const [historyTab, setHistoryTab] = useState<'all' | 'gain' | 'loss'>('all');
  const [adjustType, setAdjustType] = useState<'gain' | 'loss'>('gain');
  const [amount, setAmount] = useState<number>(10);
  const [reason, setReason] = useState<string>('');
  const [showForm, setShowForm] = useState(false);

  // States for Adding a Goal directly from homepage
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalType, setNewGoalType] = useState<'tasks' | 'level' | 'xp' | 'custom'>('custom');
  const [newGoalTarget, setNewGoalTarget] = useState(1);
  const [newGoalRewardPoints, setNewGoalRewardPoints] = useState(100);

  // States for Editing an existing Goal
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState<'tasks' | 'level' | 'xp' | 'custom'>('custom');
  const [editTarget, setEditTarget] = useState(1);
  const [editCurrent, setEditCurrent] = useState(0);
  const [editRewardPoints, setEditRewardPoints] = useState(100);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !reason.trim()) return;

    if (adjustType === 'gain') {
      onDeductPoints(-amount, reason);
    } else {
      onDeductPoints(amount, reason);
    }

    setReason('');
    setShowForm(false);
  };

  const handleCreateGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim() || !onAddGoal) return;

    onAddGoal({
      title: newGoalTitle,
      type: newGoalType,
      target: newGoalTarget,
      rewardPoints: newGoalRewardPoints
    });

    // Reset states
    setNewGoalTitle('');
    setNewGoalType('custom');
    setNewGoalTarget(1);
    setNewGoalRewardPoints(100);
    setIsAddingGoal(false);
  };

  const startEditGoal = (goal: LearningGoal) => {
    setEditingGoalId(goal.id);
    setEditTitle(goal.title);
    setEditType(goal.type);
    setEditTarget(goal.target);
    setEditCurrent(goal.current);
    setEditRewardPoints(goal.rewardPoints);
  };

  const cancelEditGoal = () => {
    setEditingGoalId(null);
  };

  const handleSaveGoalEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !onUpdateGoal || !editingGoalId) return;

    const isNowCompleted = editCurrent >= editTarget;

    onUpdateGoal({
      id: editingGoalId,
      title: editTitle,
      type: editType,
      target: editTarget,
      current: editCurrent,
      rewardPoints: editRewardPoints,
      isCompleted: isNowCompleted
    });

    // If edited goal became completed, notify or let user get reward.
    // Progress check inside App.tsx automatically takes care of milestones on level/xp/tasks,
    // but manually saving a completed 'custom' goal is handled straight forwardly.
    setEditingGoalId(null);
  };

  const handleQuickProgress = (goal: LearningGoal, change: number) => {
    if (!onUpdateGoal) return;
    const newCurrent = Math.max(0, goal.current + change);
    const isNowCompleted = newCurrent >= goal.target;

    onUpdateGoal({
      ...goal,
      current: newCurrent,
      isCompleted: isNowCompleted
    });
  };

  return (
    <div className="space-y-8 mt-10">
      {/* Target Rewards Row */}
      <div className="bg-white/90 p-6 rounded-[2.5rem] border-4 border-[#FFF9C4] relative shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-[#FFD54F] p-2 rounded-xl border-2 border-[#5D4037]">
              <Target className="w-5 h-5 text-[#5D4037]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#5D4037] font-hand">自主目标与奖励设定</h3>
              <p className="text-[10px] text-[#8D6E63] font-bold">自己决定想要的目标和获得的学习币奖励</p>
            </div>
          </div>
          
          <div className="flex gap-1.5 shrink-0">
            {onAddGoal && (
              <button
                onClick={() => setIsAddingGoal(!isAddingGoal)}
                className={cn(
                  "text-xs px-2.5 py-1 rounded-full border-2 font-black transition-all flex items-center gap-1.5",
                  isAddingGoal
                    ? "bg-[#D84315] text-white border-[#D84315]" 
                    : "bg-[#FFF9C4] text-[#F57F17] hover:bg-[#FFF59D] border-[#FFE082]"
                )}
              >
                {isAddingGoal ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                {isAddingGoal ? "取消设立" : "设定新目标"}
              </button>
            )}
          </div>
        </div>

        {/* Add Goal Collapsible Panel */}
        <AnimatePresence>
          {isAddingGoal && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-5 bg-[#FFFDE7] p-4 rounded-2xl border-2 border-dashed border-[#FFD54F]"
            >
              <form onSubmit={handleCreateGoalSubmit} className="space-y-3.5">
                <div className="text-xs font-black text-[#F57F17] flex items-center gap-1.5 border-b border-[#FFF59D] pb-1.5 mb-2">
                  <Award className="w-4 h-4" /> 设定属于你和小宠物的契约目标
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-[#8D6E63] mb-1">目标名称/要做的事</label>
                    <input
                      required
                      type="text"
                      placeholder="例：每天早上自己整理床铺 / 坚持背10个单词"
                      value={newGoalTitle}
                      onChange={e => setNewGoalTitle(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border-2 border-[#FFE082] focus:border-[#FFD54F] outline-none font-bold placeholder-gray-400 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-[#8D6E63] mb-1">衡量方式/目标类型</label>
                    <select
                      value={newGoalType}
                      onChange={e => setNewGoalType(e.target.value as any)}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border-2 border-[#FFE082] focus:border-[#FFD54F] outline-none font-bold bg-white"
                    >
                      <option value="custom">🐾 自我记录 (手工加减进度)</option>
                      <option value="tasks">✅ 完成成长日常任务次数</option>
                      <option value="level">📈 宠物达到等级</option>
                      <option value="xp">✨ 获得的总经验值(XP)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-[#8D6E63] mb-1">
                      目标数值 (例如 7 次/30 级)
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={newGoalTarget}
                      onChange={e => setNewGoalTarget(Math.max(1, Number(e.target.value)))}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border-2 border-[#FFE082] focus:border-[#FFD54F] outline-none font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-[#8D6E63] mb-1">
                      达成奖励 (学习币/能量值)
                    </label>
                    <div className="relative">
                      <Coins className="w-3.5 h-3.5 absolute right-3 top-2.5 text-[#FFB300]" />
                      <input
                        required
                        type="number"
                        min="5"
                        value={newGoalRewardPoints}
                        onChange={e => setNewGoalRewardPoints(Math.max(1, Number(e.target.value)))}
                        className="w-full pl-2.5 pr-8 py-2 text-xs rounded-xl border-2 border-[#FFE082] focus:border-[#FFD54F] outline-none font-bold bg-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-[#FFD54F] to-[#FFB300] hover:from-[#FFCA28] hover:to-[#FFA000] text-[#5D4037] text-xs font-black rounded-xl border-b-2 border-[#FF8F00] transition-all duration-150 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" /> 确认生效，并开始累积！
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goals Progress Grid */}
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
          {goals.length === 0 ? (
            <p className="text-sm text-[#A1887F] font-bold text-center py-6">
              还没有设立任何目标奖励呢，点击上方「设定新目标」来实现你的第一个愿望吧！
            </p>
          ) : (
            goals.map((goal) => {
              const progress = Math.min(100, (goal.current / goal.target) * 100);
              const isEditing = editingGoalId === goal.id;

              if (isEditing) {
                return (
                  <motion.form 
                    key={goal.id}
                    onSubmit={handleSaveGoalEdit}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-[#FFFAF0] rounded-2xl border-2 border-[#FFCC80] space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-black text-[#E65100]">
                      <span>✏️ 正在编辑此项目标设定</span>
                      <div className="flex gap-2">
                        <button 
                          type="button" 
                          onClick={cancelEditGoal}
                          className="text-[#9E9E9E] hover:underline"
                        >
                          取消
                        </button>
                        <button 
                          type="submit" 
                          className="text-[#1E88E5] font-black hover:underline flex items-center gap-0.5"
                        >
                          <Check className="w-3.5 h-3.5" /> 保存
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-[9px] font-black text-[#A1887F] mb-0.5">目标名称</label>
                        <input
                          required
                          type="text"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#FFE082] focus:border-[#FFA726] outline-none font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] font-black text-[#A1887F] mb-0.5">目标度量标准</label>
                          <select
                            value={editType}
                            onChange={e => setEditType(e.target.value as any)}
                            className="w-full px-2 py-1 text-xs rounded-lg border border-gray-200 outline-none font-bold bg-white"
                          >
                            <option value="custom">🐾 自我记录 (手工调整)</option>
                            <option value="tasks">日常任务个数</option>
                            <option value="level">宠物等级里程</option>
                            <option value="xp">宠物经验总和</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-[#A1887F] mb-0.5">奖励币数量</label>
                          <input
                            required
                            type="number"
                            min="1"
                            value={editRewardPoints}
                            onChange={e => setEditRewardPoints(Math.max(1, Number(e.target.value)))}
                            className="w-full px-2 py-1 text-xs rounded-lg border border-gray-200 outline-none font-bold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] font-black text-[#A1887F] mb-0.5">当前进度</label>
                          <input
                            required
                            type="number"
                            min="0"
                            value={editCurrent}
                            onChange={e => setEditCurrent(Math.max(0, Number(e.target.value)))}
                            className="w-full px-2 py-1 text-xs rounded-lg border border-gray-200 outline-none font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-black text-[#A1887F] mb-0.5">目标总值</label>
                          <input
                            required
                            type="number"
                            min="1"
                            value={editTarget}
                            onChange={e => setEditTarget(Math.max(1, Number(e.target.value)))}
                            className="w-full px-2 py-1 text-xs rounded-lg border border-gray-200 outline-none font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.form>
                );
              }

              return (
                <div 
                  key={goal.id} 
                  className={cn(
                    "p-4 bg-yellow-50/40 rounded-2xl border-2 transition-all hover:bg-yellow-50 relative",
                    goal.isCompleted ? "border-[#A5D6A7] bg-[#E8F5E9]/30" : "border-[#FFE082]"
                  )}
                >
                  <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                    <div className="flex-1 min-w-[180px]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {goal.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-[#4CAF50] shrink-0" />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FFD54F] animate-pulse shrink-0" />
                        )}
                        <h4 className="text-sm font-black text-[#4E342E] leading-normal break-all">
                          {goal.title}
                        </h4>
                        
                        {/* Milestone type label */}
                        <span className="text-[9px] px-1.5 py-0.5 bg-yellow-100 text-[#FF9800] rounded-full font-black scale-95 origin-left">
                          {goal.type === 'custom' && "🐾 自定义"}
                          {goal.type === 'tasks' && "✅ 任务计数"}
                          {goal.type === 'level' && "📈 等级进度"}
                          {goal.type === 'xp' && "✨ 经验进度"}
                        </span>
                      </div>
                      
                      <div className="text-[11px] text-[#E65100] font-black flex items-center gap-1 mt-1">
                        <Coins className="w-3.5 h-3.5 text-[#FFB300]" />
                        实现可得: <span className="text-sm font-mono">{goal.rewardPoints}</span> 学习币 (奖励)
                      </div>
                    </div>

                    {/* Action buttons (Edit / Delete / Manual progress for custom type) */}
                    <div className="flex items-center gap-1">
                      {/* For custom goal, allow tweaking progress easily */}
                      {goal.type === 'custom' && !goal.isCompleted && (
                        <div className="flex items-center gap-0.5 bg-white border border-[#FFE082] rounded-lg p-0.5 mr-1 shadow-sm">
                          <button
                            onClick={() => handleQuickProgress(goal, -1)}
                            className="p-1 text-gray-500 hover:text-red-500 rounded-md hover:bg-red-50"
                            title="减少1点进度"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-black px-1 text-gray-700 select-none">
                            调整
                          </span>
                          <button
                            onClick={() => handleQuickProgress(goal, 1)}
                            className="p-1 text-[#4CAF50] hover:text-[#388E3C] rounded-md hover:bg-green-50"
                            title="增加1点进度"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => startEditGoal(goal)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-200"
                        title="编辑此目标"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {onDeleteGoal && (
                        <button
                          onClick={() => onDeleteGoal(goal.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                          title="删除目标"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-1.5 text-[10px] font-black text-[#5D4037]">
                    <span>达成进度：{progress.toFixed(0)}%</span>
                    <span>
                      {goal.current} / {goal.target}
                    </span>
                  </div>

                  {/* Progressive Bar */}
                  <div className="h-3 bg-[#EFEBE9] rounded-full overflow-hidden p-[2.5px] border border-[#FFE082] shadow-inner">
                    <div 
                      className={cn(
                        "h-full rounded-full border-r border-[#5D4037] transition-all duration-500",
                        goal.isCompleted 
                          ? "bg-gradient-to-r from-green-400 to-[#81C784]" 
                          : "bg-gradient-to-r from-[#FFD54F] to-[#FFB300]"
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Points History Ledger Card */}
      <div className="bg-white/90 p-6 rounded-[2.5rem] border-4 border-[#FFCC80] flex flex-col shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#FFA726] p-2 rounded-xl border-2 border-[#5D4037]">
              <History className="w-5 h-5 text-[#5D4037]" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#5D4037] font-hand">30天学习币明细记录</h3>
              <p className="text-[10px] text-[#A1887F] font-bold">按月自动清理超出天数的记录</p>
            </div>
          </div>

          <button
            onClick={() => setIsParentMode(!isParentMode)}
            className={cn(
              "text-xs px-3 py-1 rounded-full border-2 font-black transition-all flex items-center gap-1",
              isParentMode 
                ? "bg-[#5D4037] text-white border-[#5D4037]" 
                : "bg-white text-[#5D4037] border-[#D7CCC8] hover:border-[#5D4037]"
            )}
          >
            <Settings2 className="w-3.5 h-3.5" />
            家长奖惩
          </button>
        </div>

        {/* Parent Scorer Settings form */}
        <AnimatePresence>
          {isParentMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4 bg-[#FF7043]/10 p-4 rounded-2xl border-2 border-dashed border-[#FF7043]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-[#D84315] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  家长专用快捷面板
                </span>
                <button 
                  onClick={() => setShowForm(!showForm)} 
                  className="text-xs text-[#E64A19] font-black underline"
                >
                  {showForm ? "收起" : "展开调整"}
                </button>
              </div>

              {showForm ? (
                <form onSubmit={handleAdjustSubmit} className="space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-extrabold text-[#5D4037]">增减类型：</span>
                    <button
                      type="button"
                      onClick={() => setAdjustType('gain')}
                      className={cn(
                        "px-2.5 py-1 rounded-lg font-black border",
                        adjustType === 'gain' 
                          ? "bg-[#4CAF50] text-white border-[#4CAF50]" 
                          : "bg-white text-[#4CAF50] border-gray-200"
                      )}
                    >
                      <Plus className="w-3 h-3 inline mr-0.5" /> 加分奖赏
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustType('loss')}
                      className={cn(
                        "px-2.5 py-1 rounded-lg font-black border",
                        adjustType === 'loss' 
                          ? "bg-[#F44336] text-white border-[#F44336]" 
                          : "bg-white text-[#F44336] border-gray-200"
                      )}
                    >
                      <Minus className="w-3 h-3 inline mr-0.5" /> 扣分惩罚
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-black text-[#8D6E63] uppercase mb-0.5">点数额度</label>
                      <input
                        required
                        type="number"
                        min="1"
                        max="2000"
                        value={amount}
                        onChange={e => setAmount(Number(e.target.value))}
                        className="w-full px-2 py-1.5 rounded-lg border-2 border-[#D7CCC8] text-xs font-bold outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[#8D6E63] uppercase mb-0.5">加减积分原因</label>
                      <input
                        required
                        type="text"
                        placeholder="例如: 作业非常整洁"
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg border-2 border-[#D7CCC8] text-xs font-bold outline-none"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className={cn(
                      "w-full py-2 rounded-xl text-xs font-black text-white shadow-sm hover:opacity-90 active:scale-[0.98] transition-all",
                      adjustType === 'gain' ? "bg-[#388E3C]" : "bg-[#D32F2F]"
                    )}
                  >
                    确认{adjustType === 'gain' ? "奖励" : "扣除"}并记录
                  </button>
                </form>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setAdjustType('gain'); setReason('表现优秀'); setAmount(50); setShowForm(true); }}
                    className="flex-1 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-black shadow-sm"
                  >
                    🎉 快速加50励
                  </button>
                  <button 
                    onClick={() => { setAdjustType('loss'); setReason('未按时作息'); setAmount(20); setShowForm(true); }}
                    className="flex-1 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black shadow-sm"
                  >
                    ⚠️ 快速扣20罚
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-[#F5F5F5] rounded-3xl mb-4 border border-[#E0E0E0]">
          <button
            onClick={() => setHistoryTab('all')}
            className={cn(
              "flex-1 py-2 text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-1.5",
              historyTab === 'all'
                ? "bg-white text-[#5D4037] shadow-sm border border-[#D7CCC8]"
                : "text-[#8D6E63] hover:text-[#5D4037]"
            )}
          >
            <span>📜 全部记录</span>
            <span className="text-[10px] px-2 py-0.5 bg-[#E0E0E0] rounded-full text-slate-700">
              {pointsHistory.length}
            </span>
          </button>
          
          <button
            onClick={() => setHistoryTab('gain')}
            className={cn(
              "flex-1 py-2 text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-1.5",
              historyTab === 'gain'
                ? "bg-[#E8F5E9] text-[#2E7D32] shadow-sm border border-[#C8E6C9]"
                : "text-[#388E3C] hover:text-[#2E7D32]"
            )}
          >
            <span>🎁 奖励加分项</span>
            <span className="text-[10px] px-2 py-0.5 bg-[#C8E6C9] rounded-full text-[#1B5E20]">
              {pointsHistory.filter(log => log.type === 'gain').length}
            </span>
          </button>

          <button
            onClick={() => setHistoryTab('loss')}
            className={cn(
              "flex-1 py-2 text-xs font-black rounded-2xl transition-all flex items-center justify-center gap-1.5",
              historyTab === 'loss'
                ? "bg-[#FFEBEE] text-[#C62828] shadow-sm border border-[#FFCDD2]"
                : "text-[#D32F2F] hover:text-[#C62828]"
            )}
          >
            <span>⚠️ 扣分惩罚项</span>
            <span className="text-[10px] px-2 py-0.5 bg-[#FFCDD2] rounded-full text-[#B71C1C]">
              {pointsHistory.filter(log => log.type === 'loss').length}
            </span>
          </button>
        </div>

        {/* Ledger logs list */}
        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
          {pointsHistory.filter(log => {
            if (historyTab === 'gain') return log.type === 'gain';
            if (historyTab === 'loss') return log.type === 'loss';
            return true;
          }).length === 0 ? (
            <div className="text-center py-8 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
              <p className="text-xs text-[#A1887F] font-bold">
                {historyTab === 'all' && "最近 30 天内暂无积分增减记录"}
                {historyTab === 'gain' && "暂无获赠奖励加分项，继续加油哦"}
                {historyTab === 'loss' && "太棒了！暂无任何被扣分处罚项"}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                {historyTab === 'loss' ? "保持优秀的习惯，不要被扣除学习币哦！" : "完成今日成长日常任务或跟妈妈约定来赚取奖赏吧！"}
              </p>
            </div>
          ) : (
            pointsHistory
              .filter(log => {
                if (historyTab === 'gain') return log.type === 'gain';
                if (historyTab === 'loss') return log.type === 'loss';
                return true;
              })
              .map((log) => {
                const isGain = log.type === 'gain';
                return (
                  <div 
                    key={log.id} 
                    className={cn(
                      "flex items-start justify-between p-3 rounded-2xl border-2 transition-all",
                      isGain 
                        ? "bg-emerald-50/40 border-emerald-100 hover:bg-emerald-50/80" 
                        : "bg-rose-50/40 border-rose-100 hover:bg-rose-50/80"
                    )}
                  >
                    <div className="flex gap-2.5">
                      <div 
                        className={cn(
                          "p-1.5 rounded-xl border-2 shrink-0 mt-0.5",
                          isGain 
                            ? "bg-emerald-500 text-white border-emerald-600" 
                            : "bg-rose-500 text-white border-rose-600"
                        )}
                      >
                        {isGain ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#4E342E] leading-normal line-clamp-2">
                          {log.reason}
                        </p>
                        <span className="text-[10px] text-[#A1887F] font-medium flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {formatTime(log.timestamp)}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right pl-3">
                      <span 
                        className={cn(
                          "text-sm font-black flex items-center gap-0.5 font-mono",
                          isGain ? "text-emerald-600" : "text-rose-600"
                        )}
                      >
                        {isGain ? '+' : '-'}{log.amount}
                      </span>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>
    </div>
  );
};
