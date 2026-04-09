import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check, Trash2, BookOpen } from 'lucide-react';
import { Task } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface TaskListProps {
  tasks: Task[];
  onAddTask: (title: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onAddTask, onToggleTask, onDeleteTask }) => {
  const [newTask, setNewTask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask.trim());
      setNewTask('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="写下你的学习小目标..."
          className="flex-1 px-6 py-4 rounded-[2rem] bg-white border-4 border-[#D7CCC8] focus:border-[#FFAB91] outline-none transition-all text-[#5D4037] placeholder:text-[#A1887F] font-bold shadow-inner"
        />
        <button
          type="submit"
          className="p-4 bg-[#FFAB91] hover:bg-[#FF8A65] text-white rounded-[2rem] transition-all shadow-[4px_4px_0px_#D84315] border-2 border-[#5D4037] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none"
        >
          <Plus className="w-8 h-8 stroke-[3px]" />
        </button>
      </form>

      <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className={cn(
                "group flex items-center gap-4 p-5 rounded-[2.5rem] border-4 transition-all",
                task.completed 
                  ? "bg-[#E8F5E9] border-[#C8E6C9] opacity-75" 
                  : "bg-white border-[#EFEBE9] shadow-[8px_8px_0px_#EFEBE9] hover:shadow-[8px_8px_0px_#D7CCC8] hover:translate-y-[-2px]"
              )}
            >
              <button
                onClick={() => onToggleTask(task.id)}
                className={cn(
                  "w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all",
                  task.completed 
                    ? "bg-[#4CAF50] border-[#2E7D32] text-white" 
                    : "bg-white border-[#D7CCC8] hover:border-[#FFAB91]"
                )}
              >
                {task.completed && <Check className="w-6 h-6 stroke-[4px]" />}
              </button>
              
              <span className={cn(
                "flex-1 text-xl font-black transition-all font-hand",
                task.completed ? "text-[#81C784] line-through" : "text-[#5D4037]"
              )}>
                {task.title}
              </span>

              <div className="flex items-center gap-3">
                <div className="bg-[#FFF3E0] px-3 py-1 rounded-full border-2 border-[#FFE0B2] flex items-center gap-1">
                  <span className="text-xs font-black text-[#FF7043]">+ {task.xpValue} XP</span>
                </div>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-2 text-[#D7CCC8] hover:text-[#E57373] transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {tasks.length === 0 && (
          <div className="text-center py-12 bg-white/40 rounded-[3rem] border-4 border-dashed border-[#D7CCC8]">
            <div className="inline-flex p-4 bg-white rounded-full mb-4 shadow-sm">
              <BookOpen className="w-10 h-10 text-[#D7CCC8]" />
            </div>
            <p className="text-lg font-black text-[#A1887F] font-hand">还没有任务呢，快去添加一个吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};
