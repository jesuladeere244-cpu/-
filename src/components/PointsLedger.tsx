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
  Calendar
} from 'lucide-react';
import { PointsLog, LearningGoal } from '../types';
import { cn } from '../lib/utils';

interface PointsLedgerProps {
  pointsHistory?: PointsLog[];
  goals: LearningGoal[];
  onDeductPoints: (amount: number, reason: string) => void;
  points: number;
  petName: string;
}

export const PointsLedger: React.FC<PointsLedgerProps> = ({
  pointsHistory = [],
  goals,
  onDeductPoints,
  points,
  petName
}) => {
  const [isParentMode, setIsParentMode] = useState(false);
  const [adjustType, setAdjustType] = useState<'gain' | 'loss'>('gain');
  const [amount, setAmount] = useState<number>(10);
  const [reason, setReason] = useState<string>('');
  const [showForm, setShowForm] = useState(false);

  // Format timestamp helper
  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !reason.trim()) return;

    if (adjustType === 'gain') {
      // Pass negative amount to reward/add
      onDeductPoints(-amount, reason);
    } else {
      // Pass positive amount to deduct
      onDeductPoints(amount, reason);
    }

    setReason('');
    setShowForm(false);
  };

  return (
    <div className="space-y-8 mt-10">
      {/* Target Rewards Row */}
      <div className="bg-white/80 p-6 rounded-[2.5rem] border-4 border-[#FFF9C4] relative shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#FFD54F] p-2 rounded-xl border-2 border-[#5D4037]">
              <Target className="w-5 h-5 text-[#5D4037]" />
            </div>
            <h3 className="text-xl font-black text-[#5D4037] font-hand">目标与奖励进度</h3>
          </div>
          <span className="text-xs bg-[#FFF9C4] text-[#F57F17] px-3 py-1 rounded-full border border-[#FFF59D] font-extrabold flex items-center gap-1">
            <Gift className="w-3.5 h-3.5" /> 努力达成
          </span>
        </div>

        <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
          {goals.length === 0 ? (
            <p className="text-sm text-[#A1887F] font-bold text-center py-4">暂无激活的目标奖励，去“目标”页增设新吧！</p>
          ) : (
            goals.slice(0, 3).map((goal) => {
              const progress = Math.min(100, (goal.current / goal.target) * 100);
              return (
                <div key={goal.id} className="p-3.5 bg-yellow-50/50 rounded-2xl border-2 border-[#FFE082] transition-colors hover:bg-yellow-50">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <h4 className="text-sm font-black text-[#5D4037] flex items-center gap-1.5">
                        {goal.isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-[#FFB300] animate-pulse" />
                        )}
                        {goal.title}
                      </h4>
                      <p className="text-xs text-[#FF8F00] font-black pl-3.5">
                        奖励金额: {goal.rewardPoints} 学习币
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-[#5D4037]">
                        {goal.current} / {goal.target}
                      </span>
                    </div>
                  </div>
                  <div className="h-3 bg-[#EFEBE9] rounded-full overflow-hidden p-[2.5px] border border-[#FFE082] shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-[#FFD54F] to-[#FFB300] rounded-full border-r border-[#5D4037] transition-all duration-1000"
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
                        className="w-full px-2 py-1.5 rounded-lg border-2 border-[#D7CCC8] text-xs font-bold outline-none"
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
                    className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-black"
                  >
                    🎉 快速加50励
                  </button>
                  <button 
                    onClick={() => { setAdjustType('loss'); setReason('未按时作息'); setAmount(20); setShowForm(true); }}
                    className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black"
                  >
                    ⚠️ 快速扣20罚
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ledger logs list */}
        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
          {pointsHistory.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-xs text-[#A1887F] font-bold">最近 30 天内暂无积分增减记录</p>
              <p className="text-[10px] text-gray-400 mt-1">完成今日任务或让父母赏励来获得成长币吧！</p>
            </div>
          ) : (
            pointsHistory.map((log) => {
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
