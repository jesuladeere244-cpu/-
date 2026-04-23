import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PetDisplay } from './components/PetDisplay';
import { TaskList } from './components/TaskList';
import { Stats } from './components/Stats';
import { SkillSystem } from './components/SkillSystem';
import { Shop } from './components/Shop';
import { LearningGoals } from './components/LearningGoals';
import { PetSelection } from './components/PetSelection';
import { InteractionPanel } from './components/InteractionPanel';
import { Leaderboard } from './components/Leaderboard';
import { Garden } from './components/Garden';
import { ProfileSelector } from './components/ProfileSelector';
import { Auth } from './components/Auth';
import { Friends } from './components/Friends';
import { Task, PetState, AppState, PetSpecies, ShopItem, LearningGoal, Plant } from './types';
import { getPetEncouragement, getPetDailyGreeting, getPetChatResponse } from './services/gemini';
import { Sparkles, Trophy, Edit2, Calendar, Layout, Users, LogOut, Volume2, VolumeX, ShoppingBag, Target as TargetIcon, Trees, LogIn } from 'lucide-react';
import { audioService } from './services/audioService';
import { cn } from './lib/utils';

const DEFAULT_SKILLS = [
  { id: 's1', name: '专注光环', description: '被动：任务获得的经验值增加 10%', icon: 'Target', minLevel: 3, unlocked: false },
  { id: 's2', name: '活力焕发', description: '主动：瞬间恢复 20 点体力', icon: 'Zap', minLevel: 8, unlocked: false, cooldown: 3600 },
  { id: 's3', name: '智慧之光', description: '主动：瞬间获得 100 点经验值', icon: 'Brain', minLevel: 15, unlocked: false, cooldown: 7200 },
  { id: 's4', name: '幸运星', description: '被动：任务有 20% 概率获得双倍学习币', icon: 'Star', minLevel: 22, unlocked: false },
  { id: 's5', name: '神圣庇护', description: '被动：心情和卫生下降速度减慢 50%', icon: 'Shield', minLevel: 35, unlocked: false },
];

const DEFAULT_SHOP_ITEMS: ShopItem[] = [
  { id: 'i1', name: '美味甜甜圈', price: 50, icon: '🍩', description: '一个甜甜的奖励，会让宠物非常开心！', category: 'pet' },
  { id: 'i2', name: '超级能量饮', price: 100, icon: '🥤', description: '瞬间充满活力，学习更有劲！', category: 'pet' },
  { id: 'i3', name: '酷炫墨镜', price: 200, icon: '🕶️', description: '戴上它，你就是整条街最靓的宠！', category: 'pet' },
  { id: 'i4', name: '智慧皇冠', price: 500, icon: '👑', description: '只有真正的学霸宠物才配拥有。', category: 'pet' },
  { id: 'i5', name: '神秘宝箱', price: 1000, icon: '📦', description: '里面藏着不可思议的惊喜...', category: 'pet' },
  { id: 'p1', name: '看一集动画片', price: 150, icon: '📺', description: '家长奖励：可以看一集最喜欢的动画片。', category: 'personal' },
  { id: 'p2', name: '周末去游乐园', price: 2000, icon: '🎡', description: '家长奖励：周末全家一起去游乐园玩！', category: 'personal' },
  { id: 's_rose', name: '红玫瑰种子', price: 100, icon: '🌹', description: '虽然普通但极具魅力的花朵。', category: 'garden' },
  { id: 's_tulip', name: '郁金香种子', price: 150, icon: '🌷', description: '色彩斑斓的郁金香。', category: 'garden' },
  { id: 's_sunflower', name: '向日葵种子', price: 200, icon: '🌻', description: '它总是向着希望。', category: 'garden' },
  { id: 's_cactus', name: '仙人掌种子', price: 300, icon: '🌵', description: '生命力顽强的沙漠之星。', category: 'garden' },
];

const DEFAULT_GOALS: LearningGoal[] = [
  { id: 'g1', title: '初级学者', type: 'tasks', target: 5, current: 0, rewardPoints: 50, isCompleted: false },
  { id: 'g2', title: '勤奋标兵', type: 'tasks', target: 20, current: 0, rewardPoints: 200, isCompleted: false },
  { id: 'g3', title: '等级突破', type: 'level', target: 10, current: 1, rewardPoints: 300, isCompleted: false },
  { id: 'g4', title: '知识渊博', type: 'xp', target: 5000, current: 0, rewardPoints: 500, isCompleted: false },
];

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
  skills: DEFAULT_SKILLS,
  inventory: [],
  garden: {
    unlocked: false,
    plants: []
  }
});

const INITIAL_STATE: AppState = {
  profiles: {},
  activeProfileId: null,
};

const MOCK_LEADERBOARD = [
  { id: 'm1', name: '玲玲', petName: '雪球', level: 15, xp: 1800, points: 450 },
  { id: 'm2', name: '阿强', petName: '铁甲', level: 12, xp: 1200, points: 320 },
  { id: 'm3', name: '小红', petName: '喵喵', level: 10, xp: 950, points: 280 },
];

import { supabase } from './lib/supabase';

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    // ... 保持原有的 LocalStorage 作为备份和初始状态 ...
    try {
      const saved = localStorage.getItem('smarty_pet_state_v2');
      if (!saved) return INITIAL_STATE;
      const parsed = JSON.parse(saved) as AppState;
      // ... 原有的迁移逻辑 ...
      return parsed;
    } catch {
      return INITIAL_STATE;
    }
  });

  // 新增：从 Supabase 运行同步逻辑
  useEffect(() => {
    if (!supabase) return;

    const syncWithCloud = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('pet_states')
        .select('content')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setState(data.content);
      }
    };

    syncWithCloud();
  }, []);

  // 新增：自动保存到云端
  useEffect(() => {
    localStorage.setItem('smarty_pet_state_v2', JSON.stringify(state));
    
    if (supabase) {
      const saveToCloud = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        await supabase
          .from('pet_states')
          .upsert({ user_id: user.id, content: state, updated_at: new Error().stack });
      };
      saveToCloud();
    }
  }, [state]);

  const [message, setMessage] = useState<string>('');
  const [isThinking, setIsThinking] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [activeAction, setActiveAction] = useState<'feeding' | 'cleaning' | 'playing' | 'studying' | 'sleeping' | 'adventure' | 'meditation' | 'magic' | 'skill' | 'training' | 'garden' | null>(null);
  const [activeTab, setActiveTab] = useState<'pet' | 'leaderboard' | 'shop' | 'goals' | 'garden'>('pet');
  const [showPetSelection, setShowPetSelection] = useState(false);
  const [isEvolving, setIsEvolving] = useState(false);
  const [isMuted, setIsMuted] = useState(() => audioService.isMuted());
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);

  // Check auth state on load
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleMute = () => {
    const newMuted = audioService.toggleMute();
    setIsMuted(newMuted);
  };

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

  useEffect(() => {
    if (!activeProfile || message) return;

    const encouragementInterval = setInterval(() => {
      const messages = [
        "小主人，我们一起去学习吧，我想看你认真的样子！",
        "今天也要加油哦，完成任务我就能快快长大啦！",
        "学习会让大脑变聪明，我们一起努力吧！",
        "小主人，休息好了吗？我们要不要开始今天的挑战？",
        "你学习的时候最帅/最美了，加油加油！"
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setMessage(randomMsg);
      setTimeout(() => setMessage(''), 5000);
    }, 30000); // Every 30 seconds if idle

    return () => clearInterval(encouragementInterval);
  }, [activeProfile, message]);

  useEffect(() => {
    if (!activeProfile || !activeProfile.pet.isInitialized) return;

    const decayInterval = setInterval(() => {
      setState(prev => {
        const p = prev.profiles[prev.activeProfileId!];
        if (!p) return prev;

        const hasDivineProtection = p.pet.skills.find(s => s.id === 's5')?.unlocked;
        const decayAmount = hasDivineProtection ? 0.5 : 1;

        return {
          ...prev,
          profiles: {
            ...prev.profiles,
            [prev.activeProfileId!]: {
              ...p,
              pet: {
                ...p.pet,
                happiness: Math.max(0, p.pet.happiness - decayAmount),
                hygiene: Math.max(0, p.pet.hygiene - decayAmount),
                energy: Math.max(0, p.pet.energy - decayAmount * 0.5),
              }
            }
          }
        };
      });
    }, 60000); // Every minute

    return () => clearInterval(decayInterval);
  }, [state.activeProfileId, !!activeProfile]);

  // Update goals based on pet level and xp
  useEffect(() => {
    if (!activeProfile || !activeProfile.pet.isInitialized) return;

    setState(prev => {
      const p = prev.profiles[prev.activeProfileId!];
      if (!p) return prev;

      let changed = false;
      let pointsAwarded = 0;
      const updatedGoals = p.goals.map(goal => {
        let current = goal.current;
        if (goal.type === 'level') current = p.pet.level;
        if (goal.type === 'xp') current = p.pet.xp; 
        if (goal.type === 'tasks') current = p.tasks.filter(t => t.completed).length;

        if (current !== goal.current) {
          changed = true;
          const isCompleted = current >= goal.target;
          if (isCompleted && !goal.isCompleted) {
            pointsAwarded += goal.rewardPoints;
            setTimeout(() => {
              audioService.play('levelUp');
              confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
              setMessage(`恭喜！你达成了学习目标：【${goal.title}】！获得了 ${goal.rewardPoints} 学习币！🎉`);
            }, 500);
          }
          return { ...goal, current, isCompleted: current >= goal.target };
        }
        return goal;
      });

      if (!changed) return prev;

      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [prev.activeProfileId!]: { 
            ...p, 
            goals: updatedGoals,
            pet: {
              ...p.pet,
              points: p.pet.points + pointsAwarded
            }
          }
        }
      };
    });
  }, [activeProfile?.pet.level, activeProfile?.pet.xp, activeProfile?.tasks.filter(t => t.completed).length]);

  const handleSelectProfile = (id: string) => {
    audioService.play('click');
    setState(prev => ({ ...prev, activeProfileId: id }));
    setActiveTab('pet');
    setMessage(`欢迎回来！`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCreateProfile = () => {
    audioService.play('click');
    setShowPetSelection(true);
  };

  const handleLogoutAuth = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setCurrentUser(null);
    audioService.play('click');
  };

  const handleInitializePet = (name: string, species: PetSpecies) => {
    const profileId = Math.random().toString(36).substr(2, 9);
    
    const pokemonSkills: Record<string, any[]> = {
      bulbasaur: [
        { id: 'pb1', name: '寄生种子', description: '每小时自动恢复 5 点体力', icon: 'Leaf', minLevel: 5, unlocked: false },
        { id: 'pb2', name: '阳光烈焰', description: '瞬间完成当前最久的一个任务', icon: 'Sun', minLevel: 20, unlocked: false, cooldown: 86400 }
      ],
      charmander: [
        { id: 'pc1', name: '喷射火焰', description: '任务获得的经验值增加 20%', icon: 'Flame', minLevel: 5, unlocked: false },
        { id: 'pc2', name: '大字爆炎', description: '瞬间获得 500 点经验值', icon: 'Zap', minLevel: 25, unlocked: false, cooldown: 172800 }
      ],
      squirtle: [
        { id: 'ps1', name: '水枪', description: '卫生下降速度减慢 30%', icon: 'Droplets', minLevel: 5, unlocked: false },
        { id: 'ps2', name: '水炮', description: '瞬间恢复 50 点体力', icon: 'Waves', minLevel: 20, unlocked: false, cooldown: 43200 }
      ],
      pikachu: [
        { id: 'pp1', name: '十万伏特', description: '任务获得的学习币增加 50%', icon: 'Zap', minLevel: 5, unlocked: false },
        { id: 'pp2', name: '打雷', description: '瞬间完成所有已过期的任务', icon: 'CloudLightning', minLevel: 30, unlocked: false, cooldown: 259200 }
      ]
    };

    const initialSkills = [...DEFAULT_SKILLS, ...(pokemonSkills[species] || [])];

    setState(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [profileId]: {
          tasks: [],
          pet: {
            ...INITIAL_PET_STATE(name, species),
            skills: initialSkills
          },
          shopItems: DEFAULT_SHOP_ITEMS,
          goals: DEFAULT_GOALS,
        }
      },
      activeProfileId: profileId
    }));
    
    setShowPetSelection(false);
    audioService.play('evolution');
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, activeProfileId: null }));
    setActiveTab('pet');
  };

  const handleDeleteProfile = (id: string) => {
    setState(prev => {
      const newProfiles = { ...prev.profiles };
      delete newProfiles[id];
      return {
        ...prev,
        profiles: newProfiles,
        activeProfileId: prev.activeProfileId === id ? null : prev.activeProfileId
      };
    });
  };

  const handleEvolution = (oldStage: string, newStage: string) => {
    if (oldStage === newStage) return;
    
    setIsEvolving(true);
    audioService.play('evolution');
    const stageNames = {
      baby: '幼年期',
      child: '幼儿期',
      teen: '成长期',
      adult: '成熟期',
      legendary: '传说期',
      mythical: '神话期'
    };
    setMessage(`天哪！${activeProfile?.pet.name} 正在进化成 ${stageNames[newStage as keyof typeof stageNames]}！`);
    
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

  const handlePurchase = (itemId: string) => {
    if (!state.activeProfileId || !activeProfile) return;
    
    const item = activeProfile.shopItems.find(i => i.id === itemId);
    if (!item || activeProfile.pet.points < item.price) return;

    audioService.play('success');
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    
    setState(prev => {
      const p = prev.profiles[prev.activeProfileId!];
      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [prev.activeProfileId!]: {
            ...p,
            pet: {
              ...p.pet,
              points: p.pet.points - item.price,
              inventory: [...p.pet.inventory, itemId],
              happiness: Math.min(100, p.pet.happiness + 20)
            }
          }
        }
      };
    });
    
    setMessage(`成功兑换了【${item.name}】！太开心啦！✨`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddShopItem = (item: Omit<ShopItem, 'id'>) => {
    if (!state.activeProfileId) return;
    const newItem: ShopItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
    setState(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [prev.activeProfileId!]: {
          ...prev.profiles[prev.activeProfileId!],
          shopItems: [...prev.profiles[prev.activeProfileId!].shopItems, newItem]
        }
      }
    }));
  };

  const handleDeleteShopItem = (itemId: string) => {
    if (!state.activeProfileId) return;
    setState(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [prev.activeProfileId!]: {
          ...prev.profiles[prev.activeProfileId!],
          shopItems: prev.profiles[prev.activeProfileId!].shopItems.filter(i => i.id !== itemId)
        }
      }
    }));
  };

  const handleAddGoal = (goal: Omit<LearningGoal, 'id' | 'current' | 'isCompleted'>) => {
    if (!state.activeProfileId) return;
    const newGoal: LearningGoal = { 
      ...goal, 
      id: Math.random().toString(36).substr(2, 9),
      current: 0,
      isCompleted: false
    };
    setState(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [prev.activeProfileId!]: {
          ...prev.profiles[prev.activeProfileId!],
          goals: [...prev.profiles[prev.activeProfileId!].goals, newGoal]
        }
      }
    }));
  };

  const handleDeleteGoal = (goalId: string) => {
    if (!state.activeProfileId) return;
    setState(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [prev.activeProfileId!]: {
          ...prev.profiles[prev.activeProfileId!],
          goals: prev.profiles[prev.activeProfileId!].goals.filter(g => g.id !== goalId)
        }
      }
    }));
  };

  const handleDeductPoints = (amount: number, reason: string) => {
    if (!state.activeProfileId || !activeProfile) return;
    
    audioService.play('click');
    setState(prev => {
      const p = prev.profiles[prev.activeProfileId!];
      const newPoints = Math.max(0, p.pet.points - amount);
      
      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [prev.activeProfileId!]: {
            ...p,
            pet: {
              ...p.pet,
              points: newPoints,
              happiness: Math.max(0, p.pet.happiness - 10) // Penalty also affects happiness
            }
          }
        }
      };
    });

    setMessage(`由于【${reason}】，扣除了 ${amount} 学习币。要继续努力哦！`);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleUseItem = (itemId: string) => {
    if (!state.activeProfileId || !activeProfile) return;

    const item = activeProfile.shopItems.find(i => i.id === itemId);
    if (!item) return;

    audioService.play('evolution');
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 }, colors: ['#FF7043', '#FFD54F'] });

    setState(prev => {
      const p = prev.profiles[prev.activeProfileId!];
      const itemIndex = p.pet.inventory.indexOf(itemId);
      if (itemIndex === -1) return prev;

      const newInventory = [...p.pet.inventory];
      newInventory.splice(itemIndex, 1);

      const newPet = { ...p.pet, inventory: newInventory };

      // Apply effects based on item category or specific ID
      if (item.category === 'pet') {
        newPet.happiness = Math.min(100, newPet.happiness + 30);
        newPet.energy = Math.min(100, newPet.energy + 20);
        newPet.xp += 50;
      } else {
        // Personal items might give a big happiness boost to the pet because the kid is happy
        newPet.happiness = Math.min(100, newPet.happiness + 50);
      }

      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [prev.activeProfileId!]: { ...p, pet: newPet }
        }
      };
    });

    setMessage(`你使用了【${item.name}】！太棒了，感觉充满了力量！✨`);
    setTimeout(() => setMessage(''), 4000);
  };

  const handlePlant = (seedId: string) => {
    if (!state.activeProfileId || !activeProfile) return;
    if (activeProfile.pet.points < 100) return;
    
    const seedMap: Record<string, {name: string, icon: string}> = {
        'seed_rose': { name: '玫瑰', icon: '🌹' },
        'seed_tulip': { name: '郁金香', icon: '🌷' },
        'seed_sunflower': { name: '向日葵', icon: '🌻' },
        'seed_cactus': { name: '仙人掌', icon: '🌵' }
    };

    const plantInfo = seedMap[seedId] || seedMap['seed_rose'];

    const newPlant: Plant = {
        id: Math.random().toString(36).substr(2, 9),
        seedId: seedId,
        name: plantInfo.name,
        icon: plantInfo.icon,
        stage: 'seed',
        growth: 0,
        water: 50,
        sun: 50,
        plantedAt: Date.now(),
        lastTendedAt: Date.now()
    };

    setState(prev => {
        const p = prev.profiles[prev.activeProfileId!];
        const garden = p.pet.garden || { unlocked: true, plants: [] };
        return {
            ...prev,
            profiles: {
                ...prev.profiles,
                [prev.activeProfileId!]: {
                    ...p,
                    pet: {
                        ...p.pet,
                        points: p.pet.points - 100,
                        garden: {
                            ...garden,
                            plants: [...garden.plants, newPlant]
                        }
                    }
                }
            }
        };
    });
    audioService.play('click');
    setMessage(`在土壤中播下了 ${newPlant.name} 的种子！好好照顾它吧。`);
  }

  const handleWater = (id: string) => {
    if (!state.activeProfileId || !activeProfile) return;
    if (activeProfile.pet.points < 50) return;

    setState(prev => {
        const p = prev.profiles[prev.activeProfileId!];
        const plants = p.pet.garden?.plants.map(pl => {
            if (pl.id === id) {
                const newGrowth = pl.growth + (pl.sun / 100) * 10 + 2;
                let newStage = pl.stage;
                if (newGrowth >= 100) newStage = 'mature';
                else if (newGrowth >= 60) newStage = 'growing';
                else if (newGrowth >= 30) newStage = 'sprout';

                return {
                    ...pl,
                    water: Math.min(100, pl.water + 40),
                    growth: Math.min(100, newGrowth),
                    stage: newStage as any,
                    lastTendedAt: Date.now()
                };
            }
            return pl;
        });

        return {
            ...prev,
            profiles: {
                ...prev.profiles,
                [prev.activeProfileId!]: {
                    ...p,
                    pet: {
                        ...p.pet,
                        points: p.pet.points - 50,
                        garden: { ...p.pet.garden!, plants: plants! }
                    }
                }
            }
        };
    });
    audioService.play('shower');
    setMessage(`给植物浇了水，它看起来更有精神了！💧`);
  }

  const handleSun = (id: string) => {
    if (!state.activeProfileId || !activeProfile) return;
    if (activeProfile.pet.points < 50) return;

    setState(prev => {
        const p = prev.profiles[prev.activeProfileId!];
        const plants = p.pet.garden?.plants.map(pl => {
            if (pl.id === id) {
                const newGrowth = pl.growth + (pl.water / 100) * 15 + 3;
                let newStage = pl.stage;
                if (newGrowth >= 100) newStage = 'mature';
                else if (newGrowth >= 60) newStage = 'growing';
                else if (newGrowth >= 30) newStage = 'sprout';

                return {
                    ...pl,
                    sun: Math.min(100, pl.sun + 40),
                    growth: Math.min(100, newGrowth),
                    stage: newStage as any,
                    lastTendedAt: Date.now()
                };
            }
            return pl;
        });

        return {
            ...prev,
            profiles: {
                ...prev.profiles,
                [prev.activeProfileId!]: {
                    ...p,
                    pet: {
                        ...p.pet,
                        points: p.pet.points - 50,
                        garden: { ...p.pet.garden!, plants: plants! }
                    }
                }
            }
        };
    });
    audioService.play('evolution');
    setMessage(`温暖的阳光洒在植物上，生长速度变快了！☀️`);
  }

  const handleHarvest = (id: string) => {
    if (!state.activeProfileId || !activeProfile) return;
    const plant = activeProfile.pet.garden?.plants.find(p => p.id === id);
    if (!plant || plant.growth < 100) return;

    setState(prev => {
        const p = prev.profiles[prev.activeProfileId!];
        const newXp = p.pet.xp + 500;
        const newPoints = p.pet.points + 200;
        
        return {
            ...prev,
            profiles: {
                ...prev.profiles,
                [prev.activeProfileId!]: {
                    ...p,
                    pet: {
                        ...p.pet,
                        xp: newXp,
                        points: newPoints,
                        garden: {
                            ...p.pet.garden!,
                            plants: p.pet.garden!.plants.filter(pl => pl.id !== id)
                        }
                    }
                }
            }
        };
    });
    audioService.play('success');
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    setMessage(`太棒了！收割了成熟的 ${plant.name}，获得了 500 XP 和 200 学习币！🎁`);
  }

  const handleClear = (id: string) => {
    if (!state.activeProfileId || !activeProfile) return;
    setState(prev => ({
        ...prev,
        profiles: {
            ...prev.profiles,
            [prev.activeProfileId!]: {
                ...prev.profiles[prev.activeProfileId!],
                pet: {
                    ...prev.profiles[prev.activeProfileId!].pet,
                    garden: {
                        ...prev.profiles[prev.activeProfileId!].pet.garden!,
                        plants: prev.profiles[prev.activeProfileId!].pet.garden!.plants.filter(pl => pl.id !== id)
                    }
                }
            }
        }
    }));
  }

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
      audioService.play('success');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      let evolved = false;
      let oldS = activeProfile.pet.evolutionStage;
      let newS = oldS;

      setState(prev => {
        const p = prev.profiles[prev.activeProfileId!];
        
        // Passive Skills Check
        const hasFocusAura = p.pet.skills?.find(s => s.id === 's1')?.unlocked;
        const hasLuckyStar = p.pet.skills?.find(s => s.id === 's4')?.unlocked;
        
        const xpBonus = hasFocusAura ? Math.floor(task.xpValue * 0.1) : 0;
        const pointsBonus = (hasLuckyStar && Math.random() < 0.2) ? 10 : 0;
        
        let newXp = p.pet.xp + task.xpValue + xpBonus;
        let newLevel = p.pet.level;
        let newNextLevelXp = p.pet.nextLevelXp;
        let newStage = p.pet.evolutionStage;
        const pointsEarned = 10 + pointsBonus;

        if (pointsBonus > 0) {
          setTimeout(() => setMessage('触发了【幸运星】！获得了额外学习币！✨'), 500);
        }

        if (newXp >= newNextLevelXp) {
          newLevel += 1;
          newXp -= newNextLevelXp;
          newNextLevelXp = Math.floor(newNextLevelXp * 1.2);
          
          if (newLevel >= 100) newStage = 'eternal';
          else if (newLevel >= 80) newStage = 'sanctuary';
          else if (newLevel >= 60) newStage = 'celestial';
          else if (newLevel >= 40) newStage = 'mythical';
          else if (newLevel >= 25) newStage = 'legendary';
          else if (newLevel >= 15) newStage = 'adult';
          else if (newLevel >= 10) newStage = 'teen';
          else if (newLevel >= 5) newStage = 'child';
          
          if (newStage !== oldS) {
            evolved = true;
            newS = newStage;
          }
        }

        const updatedSkills = (p.pet.skills || []).map(s => ({
          ...s,
          unlocked: s.unlocked || newLevel >= s.minLevel
        }));

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
                points: p.pet.points + pointsEarned,
                skills: updatedSkills
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

  const handleUseSkill = (skillId: string) => {
    if (!state.activeProfileId || !activeProfile) return;
    
    const skill = activeProfile.pet.skills?.find(s => s.id === skillId);
    if (!skill || !skill.unlocked) return;

    const isCooldown = skill.lastUsed && skill.cooldown && (Date.now() - skill.lastUsed < skill.cooldown * 1000);
    if (isCooldown) return;

    audioService.play('evolution');
    confetti({ particleCount: 50, spread: 60, colors: ['#9575CD'] });
    setActiveAction('skill');

    setState(prev => {
      const p = prev.profiles[prev.activeProfileId!];
      const newPet = { ...p.pet };
      
      newPet.skills = (newPet.skills || []).map(s => s.id === skillId ? { ...s, lastUsed: Date.now() } : s);

      if (skillId === 's2') { // Vitality Burst
        newPet.energy = Math.min(100, newPet.energy + 20);
        setMessage(`使用了技能【${skill.name}】！体力恢复了！`);
      } else if (skillId === 's3') { // Light of Wisdom
        newPet.xp += 100;
        setMessage(`使用了技能【${skill.name}】！获得了大量经验值！`);
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
    }, 1500);
  };

  const handleResetPet = () => {
    if (!activeProfile) return;
    audioService.play('click');
    setShowPetSelection(true);
  };

  const handleChat = async (userMessage: string) => {
    if (!activeProfile || isThinking) return;

    setIsThinking(true);
    const response = await getPetChatResponse(
      activeProfile.pet.name,
      activeProfile.pet.species,
      activeProfile.pet.level,
      userMessage
    );
    setMessage(response);
    setIsThinking(false);
    setTimeout(() => setMessage(''), 6000);
  };

  const handleInteraction = (type: 'feeding' | 'cleaning' | 'playing' | 'studying' | 'sleeping' | 'adventure' | 'meditation' | 'magic' | 'training') => {
    if (!state.activeProfileId || !activeProfile) return;
    const costs = { 
      feeding: 10, 
      cleaning: 5, 
      playing: 15, 
      studying: 20, 
      sleeping: 0,
      training: 40,
      adventure: 30,
      meditation: 25,
      magic: 50
    };
    if (activeProfile.pet.points < costs[type]) return;

    setActiveAction(type);
    audioService.play(
      type === 'feeding' ? 'eat' : 
      type === 'cleaning' ? 'shower' : 
      type === 'playing' ? 'play' : 
      type === 'studying' ? 'study' : 
      type === 'sleeping' ? 'sleep' :
      type === 'adventure' ? 'play' :
      type === 'meditation' ? 'sleep' :
      type === 'training' ? 'play' :
      'evolution'
    );
    setState(prev => {
      const p = prev.profiles[prev.activeProfileId!];
      const newPet = { ...p.pet };
      newPet.points -= costs[type];
      
      if (type === 'feeding') {
        newPet.energy = Math.min(100, newPet.energy + 30);
        newPet.happiness = Math.min(100, newPet.happiness + 5);
        setMessage(`谢谢你给我美味的饭菜，好好吃，大口大口吃掉啦！😋`);
      } else if (type === 'cleaning') {
        newPet.hygiene = Math.min(100, newPet.hygiene + 50);
        newPet.happiness = Math.min(100, newPet.happiness + 5);
        setMessage(`好舒服啊，谢谢你主人！洗得白白净净的～🧼`);
      } else if (type === 'playing') {
        newPet.happiness = Math.min(100, newPet.happiness + 30);
        newPet.energy = Math.max(0, newPet.energy - 20);
        setMessage(`太好玩啦！我们再玩一会吧！`);
      } else if (type === 'studying') {
        newPet.xp += 40;
        newPet.happiness = Math.min(100, newPet.happiness + 10);
        newPet.energy = Math.max(0, newPet.energy - 15);
        setMessage(`和主人一起学习最开心了！XP增加了！`);
      } else if (type === 'sleeping') {
        newPet.energy = Math.min(100, newPet.energy + 60);
        newPet.happiness = Math.min(100, newPet.happiness + 5);
        setMessage(`呼呼...做个好梦...`);
      } else if (type === 'training') {
        newPet.xp += 120;
        newPet.energy = Math.max(0, newPet.energy - 30);
        newPet.happiness = Math.min(100, newPet.happiness + 15);
        setMessage(`努力训练中！感觉充满了力量！XP大幅提升！💪`);
      } else if (type === 'adventure') {
        newPet.xp += 80;
        newPet.points += 15;
        newPet.energy = Math.max(0, newPet.energy - 40);
        newPet.happiness = Math.min(100, newPet.happiness + 20);
        setMessage(`哇！我们在森林里发现了宝藏！XP和学习币都增加了！`);
      } else if (type === 'meditation') {
        newPet.energy = Math.min(100, newPet.energy + 20);
        newPet.happiness = Math.min(100, newPet.happiness + 40);
        newPet.xp += 20;
        setMessage(`静下心来，感觉充满了智慧的力量...`);
      } else if (type === 'magic') {
        newPet.xp += 150;
        newPet.energy = Math.max(0, newPet.energy - 30);
        newPet.happiness = Math.min(100, newPet.happiness + 50);
        confetti({ particleCount: 100, spread: 70, colors: ['#ff00ff', '#00ffff'] });
        setMessage(`这就是魔法的力量吗？太神奇了！XP大幅提升！`);
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
    audioService.play('click');
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
    audioService.play('click');
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
          onDelete={handleDeleteProfile}
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
      points: p.pet.points,
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
            <button
              onClick={toggleMute}
              className="p-3 bg-white/80 hover:bg-white text-[#5D4037] rounded-2xl border-2 border-[#5D4037] shadow-[4px_4px_0px_#5D4037] transition-all active:translate-y-[2px] active:shadow-none"
              title={isMuted ? "取消静音" : "静音"}
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
            {currentUser ? (
              <div className="flex items-center gap-2 pr-2">
                <div className="w-10 h-10 bg-[#FF7043] rounded-full border-2 border-[#5D4037] flex items-center justify-center text-white font-black shadow-md">
                  {currentUser.user_metadata?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <button
                  onClick={handleLogoutAuth}
                  className="p-3 bg-white/80 hover:bg-red-50 text-red-500 rounded-2xl border-2 border-[#5D4037] shadow-[4px_4px_0px_#5D4037] transition-all active:translate-y-[2px] active:shadow-none"
                  title="退出登录"
                >
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="px-6 py-3 bg-[#FF7043] text-white rounded-2xl font-black border-2 border-[#5D4037] shadow-[4px_4px_0px_#5D4037] hover:bg-[#FF8A65] transition-all active:translate-y-[2px] active:shadow-none flex items-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                登录
              </button>
            )}
            <div className="flex bg-[#EFEBE9] p-2 rounded-[2.5rem] border-4 border-[#D7CCC8] overflow-x-auto no-scrollbar max-w-[60vw]">
              <button
                onClick={() => setActiveTab('pet')}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-[2rem] text-lg font-black transition-all whitespace-nowrap",
                  activeTab === 'pet' ? "bg-[#FFCC80] text-[#5D4037] shadow-md border-2 border-[#5D4037]" : "text-[#A1887F] hover:text-[#5D4037]"
                )}
              >
                <Layout className="w-5 h-5" />
                伙伴
              </button>
              <button
                onClick={() => setActiveTab('goals')}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-[2rem] text-lg font-black transition-all whitespace-nowrap",
                  activeTab === 'goals' ? "bg-[#4FC3F7] text-[#5D4037] shadow-md border-2 border-[#5D4037]" : "text-[#A1887F] hover:text-[#5D4037]"
                )}
              >
                <Users className="w-5 h-5" />
                好友
              </button>
              <button
                onClick={() => setActiveTab('shop')}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-[2rem] text-lg font-black transition-all whitespace-nowrap",
                  activeTab === 'shop' ? "bg-[#FF7043] text-white shadow-md border-2 border-[#5D4037]" : "text-[#A1887F] hover:text-[#5D4037]"
                )}
              >
                <ShoppingBag className="w-5 h-5" />
                商城
              </button>
              <button
                onClick={() => setActiveTab('garden')}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-[2rem] text-lg font-black transition-all whitespace-nowrap",
                  activeTab === 'garden' ? "bg-[#81C784] text-white shadow-md border-2 border-[#5D4037]" : "text-[#A1887F] hover:text-[#5D4037]",
                  activeProfile?.pet.level! < 30 && "opacity-50"
                )}
              >
                <Trees className="w-5 h-5" />
                花园
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-[2rem] text-lg font-black transition-all whitespace-nowrap",
                  activeTab === 'leaderboard' ? "bg-[#FFCC80] text-[#5D4037] shadow-md border-2 border-[#5D4037]" : "text-[#A1887F] hover:text-[#5D4037]"
                )}
              >
                <Users className="w-5 h-5" />
                榜单
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

              <SkillSystem skills={activeProfile.pet.skills} onUseSkill={handleUseSkill} />
              
              <InteractionPanel 
                points={activeProfile.pet.points} 
                level={activeProfile.pet.level}
                onAction={handleInteraction}
                onChat={handleChat}
                onResetPet={handleResetPet}
                disabled={!!activeAction} 
              />

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
        ) : activeTab === 'goals' && activeProfile ? (
          <Friends userId={currentUser?.id} />
        ) : activeTab === 'shop' && activeProfile ? (
          <Shop 
            items={activeProfile.shopItems} 
            points={activeProfile.pet.points} 
            inventory={activeProfile.pet.inventory}
            onPurchase={handlePurchase}
            onUseItem={handleUseItem}
            onAddItem={handleAddShopItem}
            onDeleteItem={handleDeleteShopItem}
          />
        ) : activeTab === 'garden' && activeProfile ? (
            <Garden 
              garden={activeProfile.pet.garden || { unlocked: activeProfile.pet.level >= 30, plants: [] }}
              level={activeProfile.pet.level}
              points={activeProfile.pet.points}
              onPlant={handlePlant}
              onWater={handleWater}
              onSun={handleSun}
              onHarvest={handleHarvest}
              onClear={handleClear}
            />
        ) : activeTab === 'goals' && activeProfile ? (
          <LearningGoals 
            goals={activeProfile.goals} 
            onAddGoal={handleAddGoal}
            onDeleteGoal={handleDeleteGoal}
            onDeductPoints={handleDeductPoints}
          />
        ) : (
          <main className="flex flex-col items-center">
            <Leaderboard entries={leaderboardEntries} />
          </main>
        )}

        <footer className="mt-16 text-center text-slate-400 text-xs">
          <p>© 2026 SmartyPet - 让学习变得更有趣</p>
        </footer>
      </div>
      
      {showAuth && (
        <Auth 
          onClose={() => setShowAuth(false)} 
          onSuccess={(user) => {
            setCurrentUser(user);
            setShowAuth(false);
          }} 
        />
      )}
    </div>
  );
}

