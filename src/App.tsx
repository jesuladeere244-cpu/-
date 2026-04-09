import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PetDisplay } from './components/PetDisplay';
import { TaskList } from './components/TaskList';
import { Stats } from './components/Stats';
import { PetSelection } from './components/PetSelection';
import { InteractionPanel } from './components/InteractionPanel';
import { Leaderboard } from './components/Leaderboard';
import { ProfileSelector } from './components/ProfileSelector';
import { Task, PetState, AppState, PetSpecies } from './types';
import { getPetEncouragement, getPetDailyGreeting } from './services/gemini';
import { Sparkles, Trophy, Edit2, Calendar, Layout, Users, LogOut } from 'lucide-react';
import { cn } from './lib/utils';

const INITIAL_PET_STATE = (name: string = "", species: PetSpecies = 'slime'): PetState => ({
  name,
  species,
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  happiness: 80,
  energy: 100,
  hygiene: 100,
  points: 20,
  lastFed: Date.now(),
  streak: 0,
  evolutionStage: 'baby',
  isInitialized: !!name,
});

const INITIAL_STATE: AppState = {
  profiles: {},
  activeProfileId: null,
};

const MOCK_LEADERBOARD = [
  { id: 'm1', name: '玲玲', petName: '雪球', level: 15, xp: 1800 },
  { id: 'm2', name: '阿强', petName: '铁甲', level: 12, xp: 1200 },
  { id: 'm3', name: '小红', petName: '喵喵', level: 10, xp: 950 },
];

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('smarty_pet_state_v2');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [message, setMessage] = useState<string>('');
  const [isThinking, setIsThinking] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [activeAction, setActiveAction] = useState<'feeding' | 'cleaning' | 'playing' | null>(null);
  const [activeTab, setActiveTab] = useState<'pet' | 'leaderboard'>('pet');
  const [showPetSelection, setShowPetSelection] = useState(false);
  const [isEvolving, setIsEvolving] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('smarty_pet_state_v2', JSON.stringify(state));
  }, [state]);

  const activeProfile = state.activeProfileId ? state.profiles[state.activeProfileId] : null;

  // Daily streak and greeting logic
  useEffect(() => {
    if (!activeProfile || !activeProfile.pet.isInitialized) return;

    const checkDailyStatus = async () => {
      const now = new Date();
      const lastCheckIn = activeProfile.pet.lastCheckIn ? new Date(activeProfile.pet.lastCheckIn) : null;
      
      const isSameDay = lastCheckIn && 
        now.getFullYear() === lastCheckIn.getFullYear() &&
        now.getMonth() === lastCheckIn.getMonth() &&
        now.getDate() === lastCheckIn.getDate();

      if (!isSameDay) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const wasYesterday = lastCheckIn &&
          yesterday.getFullYear() === lastCheckIn.getFullYear() &&
          yesterday.getMonth() === lastCheckIn.getMonth() &&
          yesterday.getDate() === lastCheckIn.getDate();

        const newStreak = wasYesterday ? activeProfile.pet.streak + 1 : 1;
        const streakBonusXp = newStreak * 10;
        const streakBonusPoints = newStreak * 5;
        
        setState(prev => ({
          ...prev,
          profiles: {
            ...prev.profiles,
            [prev.activeProfileId!]: {
              ...prev.profiles[prev.activeProfileId!],
              pet: {
                ...prev.profiles[prev.activeProfileId!].pet,
                streak: newStreak,
                lastCheckIn: Date.now(),
                xp: prev.profiles[prev.activeProfileId!].pet.xp + streakBonusXp,
                points: prev.profiles[prev.activeProfileId!].pet.points + streakBonusPoints,
                happiness: Math.min(100, prev.profiles[prev.activeProfileId!].pet.happiness + 20),
                energy: Math.min(100, prev.profiles[prev.activeProfileId!].pet.energy + 30),
                hygiene: Math.max(0, prev.profiles[prev.activeProfileId!].pet.hygiene - 10)
              }
            }
          }
        }));

        setIsThinking(true);
        const greeting = await getPetDailyGreeting(activeProfile.pet.name, activeProfile.pet.level);
        setMessage(`${greeting} (打卡第 ${newStreak} 天！获得 ${streakBonusXp} XP 和 ${streakBonusPoints} 学习币)`);
        setIsThinking(false);
        setTimeout(() => setMessage(''), 10000);
      }
    };

    checkDailyStatus();
  }, [state.activeProfileId]);

  const handleSelectProfile = (id: string) => {
    setState(prev => ({ ...prev, activeProfileId: id }));
    setActiveTab('pet');
    setMessage(`欢迎回来！`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCreateProfile = () => {
    setShowPetSelection(true);
  };

  const handleInitializePet = (name: string, species: PetSpecies) => {
    const profileId = Math.random().toString(36).substr(2, 9);
    const childName = Object.keys(state.profiles).length === 0 ? "大宝贝" : "小宝贝";
    
    setState(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [profileId]: {
          tasks: [],
          pet: INITIAL_PET_STATE(name, species)
        }
      },
      activeProfileId: profileId
    }));
    
    setShowPetSelection(false);
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, activeProfileId: null }));
    setActiveTab('pet');
  };

  const handleEvolution = (oldStage: string, newStage: string) => {
    if (oldStage === newStage) return;
    
    setIsEvolving(true);
    setMessage(`天哪！${activeProfile?.pet.name} 正在进化成 ${newStage === 'child' ? '幼儿期' : newStage === 'teen' ? '成长期' : '成熟期'}！`);
    
    // Multi-stage fireworks
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    setTimeout(() => {
      setIsEvolving(false);
      setMessage(`进化成功！现在的 ${activeProfile?.pet.name} 变得更强大了！`);
      confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF4500']
      });
      setTimeout(() => setMessage(''), 5000);
    }, 4000);
  };

  const handleRename = (newName: string) => {
    if (newName.trim() && state.activeProfileId) {
      setState(prev => ({
        ...prev,
        profiles: {
          ...prev.profiles,
          [prev.activeProfileId!]: {
            ...prev.profiles[prev.activeProfileId!],
            pet: { ...prev.profiles[prev.activeProfileId!].pet, name: newName.trim() }
          }
        }
      }));
      setIsEditingName(false);
    }
  };

  const handleAddTask = (title: string) => {
    if (!state.activeProfileId) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      completed: false,
      xpValue: 20,
      createdAt: Date.now(),
    };
    setState(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [prev.activeProfileId!]: {
          ...prev.profiles[prev.activeProfileId!],
          tasks: [newTask, ...prev.profiles[prev.activeProfileId!].tasks]
        }
      }
    }));
  };

  const handleToggleTask = async (id: string) => {
    if (!state.activeProfileId || !activeProfile) return;
    const task = activeProfile.tasks.find(t => t.id === id);
    if (!task) return;

    const isCompleting = !task.completed;

    if (isCompleting) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      let evolved = false;
      let oldS = activeProfile.pet.evolutionStage;
      let newS = oldS;

      setState(prev => {
        const p = prev.profiles[prev.activeProfileId!];
        let newXp = p.pet.xp + task.xpValue;
        let newLevel = p.pet.level;
        let newNextLevelXp = p.pet.nextLevelXp;
        let newStage = p.pet.evolutionStage;
        const pointsEarned = 10;

        if (newXp >= newNextLevelXp) {
          newLevel += 1;
          newXp -= newNextLevelXp;
          newNextLevelXp = Math.floor(newNextLevelXp * 1.2);
          
          if (newLevel >= 15) newStage = 'adult';
          else if (newLevel >= 10) newStage = 'teen';
          else if (newLevel >= 5) newStage = 'child';
          
          if (newStage !== oldS) {
            evolved = true;
            newS = newStage;
          }
        }

        return {
          ...prev,
          profiles: {
            ...prev.profiles,
            [prev.activeProfileId!]: {
              ...p,
              tasks: p.tasks.map(t => t.id === id ? { ...t, completed: true } : t),
              pet: {
                ...p.pet,
                xp: newXp,
                level: newLevel,
                nextLevelXp: newNextLevelXp,
                evolutionStage: newStage as any,
                happiness: Math.min(100, p.pet.happiness + 5),
                points: p.pet.points + pointsEarned
              }
            }
          }
        };
      });

      if (evolved) {
        handleEvolution(oldS, newS);
      } else {
        setIsThinking(true);
        const encouragement = await getPetEncouragement(activeProfile.pet.name, task.title, activeProfile.pet.level);
        setMessage(encouragement);
        setIsThinking(false);
        setTimeout(() => setMessage(''), 6000);
      }
    } else {
      setState(prev => ({
        ...prev,
        profiles: {
          ...prev.profiles,
          [prev.activeProfileId!]: {
            ...prev.profiles[prev.activeProfileId!],
            tasks: prev.profiles[prev.activeProfileId!].tasks.map(t => t.id === id ? { ...t, completed: false } : t),
            pet: { ...prev.profiles[prev.activeProfileId!].pet, happiness: Math.max(0, prev.profiles[prev.activeProfileId!].pet.happiness - 5) }
          }
        }
      }));
    }
  };

  const handleDeleteTask = (id: string) => {
    if (!state.activeProfileId) return;
    setState(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [prev.activeProfileId!]: {
          ...prev.profiles[prev.activeProfileId!],
          tasks: prev.profiles[prev.activeProfileId!].tasks.filter(t => t.id !== id)
        }
      }
    }));
  };

  const handleInteraction = (type: 'feeding' | 'cleaning' | 'playing') => {
    if (!state.activeProfileId || !activeProfile) return;
    const costs = { feeding: 10, cleaning: 5, playing: 15 };
    if (activeProfile.pet.points < costs[type]) return;

    setActiveAction(type);
    setState(prev => {
      const p = prev.profiles[prev.activeProfileId!];
      const newPet = { ...p.pet };
      newPet.points -= costs[type];
      
      if (type === 'feeding') {
        newPet.energy = Math.min(100, newPet.energy + 30);
        newPet.happiness = Math.min(100, newPet.happiness + 5);
        setMessage(`真好吃！谢谢主人喂我！`);
      } else if (type === 'cleaning') {
        newPet.hygiene = Math.min(100, newPet.hygiene + 50);
        newPet.happiness = Math.min(100, newPet.happiness + 5);
        setMessage(`洗白白，真舒服！`);
      } else if (type === 'playing') {
        newPet.happiness = Math.min(100, newPet.happiness + 30);
        newPet.energy = Math.max(0, newPet.energy - 20);
        setMessage(`太好玩啦！我们再玩一会吧！`);
      }

      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [prev.activeProfileId!]: { ...p, pet: newPet }
        }
      };
    });

    setTimeout(() => {
      setActiveAction(null);
      setTimeout(() => setMessage(''), 3000);
    }, 2000);
  };

  const handleBattle = () => {
    if (!activeProfile) return;
    const opponent = MOCK_LEADERBOARD[Math.floor(Math.random() * MOCK_LEADERBOARD.length)];
    setIsThinking(true);
    setMessage(`正在与 ${opponent.name} 的宠物 ${opponent.petName} 进行学习力比拼...`);
    
    setTimeout(() => {
      const win = Math.random() > 0.4;
      setIsThinking(false);
      if (win) {
        confetti({ particleCount: 50, spread: 60, colors: ['#fbbf24'] });
        setMessage(`太棒了！我们在比拼中获胜啦！获得 15 XP 和 5 学习币！`);
        setState(prev => ({
          ...prev,
          profiles: {
            ...prev.profiles,
            [prev.activeProfileId!]: {
              ...prev.profiles[prev.activeProfileId!],
              pet: {
                ...prev.profiles[prev.activeProfileId!].pet,
                xp: prev.profiles[prev.activeProfileId!].pet.xp + 15,
                points: prev.profiles[prev.activeProfileId!].pet.points + 5,
                happiness: Math.min(100, prev.profiles[prev.activeProfileId!].pet.happiness + 10)
              }
            }
          }
        }));
      } else {
        setMessage(`哎呀，这次比拼输给了 ${opponent.petName}，下次加油！`);
        setState(prev => ({
          ...prev,
          profiles: {
            ...prev.profiles,
            [prev.activeProfileId!]: {
              ...prev.profiles[prev.activeProfileId!],
              pet: { ...prev.profiles[prev.activeProfileId!].pet, happiness: Math.max(0, prev.profiles[prev.activeProfileId!].pet.happiness - 5) }
            }
          }
        }));
      }
      setTimeout(() => setMessage(''), 5000);
    }, 2000);
  };

  const handleVisit = () => {
    if (!activeProfile) return;
    const friend = MOCK_LEADERBOARD[Math.floor(Math.random() * MOCK_LEADERBOARD.length)];
    setMessage(`正在访问 ${friend.name} 的家...`);
    setTimeout(() => {
      setMessage(`${friend.name} 的宠物 ${friend.petName} 看起来养得真好！我们也要加油学习！`);
      setState(prev => ({
        ...prev,
        profiles: {
          ...prev.profiles,
          [prev.activeProfileId!]: {
            ...prev.profiles[prev.activeProfileId!],
            pet: { ...prev.profiles[prev.activeProfileId!].pet, happiness: Math.min(100, prev.profiles[prev.activeProfileId!].pet.happiness + 5) }
          }
        }
      }));
      setTimeout(() => setMessage(''), 5000);
    }, 1500);
  };

  if (showPetSelection) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <PetSelection onSelect={handleInitializePet} />
      </div>
    );
  }

  if (!state.activeProfileId) {
    const profileList = Object.entries(state.profiles).map(([id, p]: [string, any]) => ({
      id,
      name: id === Object.keys(state.profiles)[0] ? "大宝贝" : "小宝贝",
      petName: p.pet.name,
      petSpecies: p.pet.species,
      level: p.pet.level
    }));

    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
        <ProfileSelector 
          profiles={profileList} 
          onSelect={handleSelectProfile} 
          onCreate={handleCreateProfile} 
        />
      </div>
    );
  }

  const leaderboardEntries = [
    ...MOCK_LEADERBOARD,
    ...Object.entries(state.profiles).map(([id, p]: [string, any]) => ({
      id,
      name: id === Object.keys(state.profiles)[0] ? "大宝贝" : "小宝贝",
      petName: p.pet.name,
      level: p.pet.level,
      xp: p.pet.xp,
      isCurrentUser: id === state.activeProfileId
    }))
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F2] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] p-4 md:p-8 font-sans text-[#5D4037]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#FFAB91] p-3 rounded-[2rem] rotate-[-3deg] shadow-lg border-4 border-[#5D4037]">
              <Sparkles className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-[#5D4037] font-hand">
                SmartyPet <span className="text-[#FF7043]">温馨学习屋</span>
              </h1>
              <p className="text-sm font-bold text-[#8D6E63]">和可爱宠物一起快乐成长吧！</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-[#EFEBE9] p-2 rounded-[2.5rem] border-4 border-[#D7CCC8]">
              <button
                onClick={() => setActiveTab('pet')}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-[2rem] text-lg font-black transition-all",
                  activeTab === 'pet' ? "bg-[#FFCC80] text-[#5D4037] shadow-md border-2 border-[#5D4037]" : "text-[#A1887F] hover:text-[#5D4037]"
                )}
              >
                <Layout className="w-5 h-5" />
                我的伙伴
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-[2rem] text-lg font-black transition-all",
                  activeTab === 'leaderboard' ? "bg-[#FFCC80] text-[#5D4037] shadow-md border-2 border-[#5D4037]" : "text-[#A1887F] hover:text-[#5D4037]"
                )}
              >
                <Users className="w-5 h-5" />
                光荣榜
              </button>
            </div>
            <button 
              onClick={handleLogout}
              className="p-3 text-[#A1887F] hover:text-[#E57373] transition-colors bg-white rounded-[2rem] border-4 border-[#D7CCC8] shadow-sm hover:rotate-6"
              title="切换成员"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </header>

        {activeTab === 'pet' && activeProfile ? (
          <main className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <section className="flex flex-col items-center bg-white/40 p-8 rounded-[3rem] border-4 border-dashed border-[#D7CCC8]">
              <div className="flex items-center gap-3 mb-4 group">
                {isEditingName ? (
                  <input
                    autoFocus
                    className="text-3xl font-black text-[#5D4037] bg-transparent border-b-4 border-[#FFAB91] outline-none w-48 text-center font-hand"
                    defaultValue={activeProfile.pet.name}
                    onBlur={(e) => handleRename(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRename(e.currentTarget.value)}
                  />
                ) : (
                  <>
                    <h2 className="text-3xl font-black text-[#5D4037] font-hand">{activeProfile.pet.name}</h2>
                    <button onClick={() => setIsEditingName(true)} className="p-2 text-[#D7CCC8] hover:text-[#FF7043] transition-colors">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              
              <div className="relative p-4 bg-white rounded-[4rem] border-4 border-[#5D4037] shadow-[12px_12px_0px_#D7CCC8] mb-8">
                <PetDisplay 
                  species={activeProfile.pet.species}
                  stage={activeProfile.pet.evolutionStage} 
                  happiness={activeProfile.pet.happiness}
                  energy={activeProfile.pet.energy}
                  hygiene={activeProfile.pet.hygiene}
                  isThinking={isThinking}
                  message={message}
                  activeAction={activeAction}
                  isEvolving={isEvolving}
                />
              </div>

              <div className="w-full bg-[#FFF3E0] p-6 rounded-[2.5rem] border-4 border-[#FFE0B2] mb-8">
                <Stats pet={activeProfile.pet} />
              </div>
              
              <InteractionPanel points={activeProfile.pet.points} onAction={handleInteraction} disabled={!!activeAction} />

              <div className="grid grid-cols-2 gap-6 w-full max-w-md mt-8">
                <button onClick={handleBattle} disabled={!!activeAction || isThinking} className="flex items-center justify-center gap-3 py-4 bg-[#FF8A65] text-white rounded-[2rem] text-lg font-black shadow-[6px_6px_0px_#D84315] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 border-2 border-[#5D4037]">
                  <Trophy className="w-6 h-6" /> 学习大比拼
                </button>
                <button onClick={handleVisit} disabled={!!activeAction || isThinking} className="flex items-center justify-center gap-3 py-4 bg-[#81C784] text-white rounded-[2rem] text-lg font-black shadow-[6px_6px_0px_#2E7D32] hover:translate-y-[-2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 border-2 border-[#5D4037]">
                  <Users className="w-6 h-6" /> 找小伙伴玩
                </button>
              </div>
            </section>

            <section className="bg-white/60 p-8 rounded-[3rem] border-4 border-[#D7CCC8] shadow-[16px_16px_0px_rgba(93,64,55,0.05)]">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-[#FFD54F] p-2 rounded-xl border-2 border-[#5D4037]">
                  <Calendar className="w-6 h-6 text-[#5D4037]" />
                </div>
                <h3 className="text-2xl font-black text-[#5D4037] font-hand">今日成长任务</h3>
                <div className="ml-auto flex flex-col items-end">
                  <span className="text-xs font-black text-[#FF7043] uppercase tracking-widest">连续打卡</span>
                  <span className="text-xl font-black text-[#5D4037]">{activeProfile.pet.streak} 天</span>
                </div>
              </div>
              <TaskList tasks={activeProfile.tasks} onAddTask={handleAddTask} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} />
              
              <div className="mt-12 p-6 bg-[#E8F5E9] rounded-[2rem] border-4 border-[#C8E6C9] relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                  <Sparkles className="w-24 h-24" />
                </div>
                <h4 className="text-sm font-black text-[#2E7D32] mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#4CAF50] rounded-full animate-ping" />
                  温馨提示
                </h4>
                <p className="text-sm font-bold text-[#4E342E] leading-relaxed">
                  每完成一个任务，宠物都会获得能量哦！记得多陪陪它，它会是你最好的学习伙伴。
                </p>
              </div>
            </section>
          </main>
        ) : (
          <main className="flex flex-col items-center">
            <Leaderboard entries={leaderboardEntries} />
          </main>
        )}

        <footer className="mt-16 text-center text-slate-400 text-xs">
          <p>© 2026 SmartyPet - 让学习变得更有趣</p>
        </footer>
      </div>
    </div>
  );
}

