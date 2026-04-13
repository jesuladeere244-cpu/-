export interface Task {
  id: string;
  title: string;
  completed: boolean;
  xpValue: number;
  createdAt: number;
}

export type PetSpecies = 'slime' | 'dragon' | 'cat' | 'robot' | 'rabbit' | 'panda' | 'frog' | 'pig' | 'tiger' | 'elephant' | 'dinosaur' | 'fox' | 'penguin' | 'lion' | 'bulbasaur' | 'charmander' | 'squirtle' | 'pikachu' | 'meowth' | 'eevee' | 'jigglypuff';

export interface PetSkill {
  id: string;
  name: string;
  description: string;
  icon: string;
  minLevel: number;
  unlocked: boolean;
  cooldown?: number; // in seconds
  lastUsed?: number;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  description: string;
  category: 'pet' | 'personal';
}

export interface LearningGoal {
  id: string;
  title: string;
  type: 'tasks' | 'level' | 'xp' | 'custom';
  target: number;
  current: number;
  rewardPoints: number;
  isCompleted: boolean;
}

export interface PetState {
  name: string;
  species: PetSpecies;
  level: number;
  xp: number;
  nextLevelXp: number;
  happiness: number;
  energy: number; // 0-100
  hygiene: number; // 0-100
  points: number; // Currency earned from tasks to spend on interactions
  lastFed: number;
  lastCheckIn?: number;
  streak: number;
  evolutionStage: 'baby' | 'child' | 'teen' | 'adult' | 'legendary' | 'mythical';
  isInitialized: boolean;
  skills: PetSkill[];
  inventory: string[]; // IDs of purchased items
}

export interface AppState {
  profiles: {
    [id: string]: {
      tasks: Task[];
      pet: PetState;
      shopItems: ShopItem[];
      goals: LearningGoal[];
    };
  };
  activeProfileId: string | null;
}
