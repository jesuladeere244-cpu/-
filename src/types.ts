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
  category: 'pet' | 'personal' | 'garden';
}

export interface Plant {
  id: string;
  seedId: string;
  name: string;
  icon: string;
  stage: 'seed' | 'sprout' | 'growing' | 'mature';
  growth: number; // 0-100
  water: number; // 0-100
  sun: number; // 0-100
  plantedAt: number;
  lastTendedAt: number;
}

export interface GardenState {
  unlocked: boolean;
  plants: Plant[];
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
  evolutionStage: 'baby' | 'child' | 'teen' | 'adult' | 'legendary' | 'mythical' | 'celestial' | 'sanctuary' | 'eternal';
  isInitialized: boolean;
  skills: PetSkill[];
  inventory: string[]; // IDs of purchased items
  garden?: GardenState;
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
