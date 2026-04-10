export interface Task {
  id: string;
  title: string;
  completed: boolean;
  xpValue: number;
  createdAt: number;
}

export type PetSpecies = 'slime' | 'dragon' | 'cat' | 'robot' | 'rabbit' | 'panda' | 'frog' | 'pig' | 'tiger' | 'elephant' | 'dinosaur' | 'fox' | 'penguin' | 'lion';

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
  evolutionStage: 'baby' | 'child' | 'teen' | 'adult';
  isInitialized: boolean;
}

export interface AppState {
  profiles: {
    [id: string]: {
      tasks: Task[];
      pet: PetState;
    };
  };
  activeProfileId: string | null;
}
