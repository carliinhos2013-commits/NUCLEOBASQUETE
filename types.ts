
export enum View {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  LOBBY = 'LOBBY',
  TRAINING = 'TRAINING',
  RANKING = 'RANKING',
  EDUCATION = 'EDUCATION',
  TUTOR = 'TUTOR',
  LOCATIONS = 'LOCATIONS',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',
  COMMUNITY = 'COMMUNITY',
  TRYOUTS = 'TRYOUTS',
  VISION_BOARD = 'VISION_BOARD',
  MATCH_PLAY = 'MATCH_PLAY',
  AVATAR_CREATOR = 'AVATAR_CREATOR'
}

export type ThemeType = 'dark' | 'orange' | 'white';

// Atualizado com os pedidos: Hooper, Amr Shooter, Flash Ala, Pivot
export type PlaystyleType = 'HOOPER' | 'ARMADOR_SHOOTER' | 'FLASH_WING' | 'PIVOT_MASTER' | 'TWO_WAY';

export interface NinjaAttributes {
  ninjutsu: number; // Shooting / Precision
  taijutsu: number; // Physical / Defense / Speed
  genjutsu: number; // Handling / Fakes
  dojutsu: number;  // IQ / Vision
}

export interface AvatarSpecs {
  skinTone: string;
  hairStyle: string;
  jerseyColor: string;
  nationality: string;
  height: string;
  weight: string;
}

export interface User {
  id: string;
  name: string;
  age: number;
  city: string;
  points: number;
  streak: number;
  totalWorkouts: number; // Renomeado de total_workouts para camelCase no frontend, mas mapeado do DB
  total_workouts?: number; // Para compatibilidade com Supabase direto
  level: string;
  role: 'PLAYER' | 'COACH' | 'ADMIN';
  goal: string;
  avatar?: string;
  playstyle?: PlaystyleType;
  attributes?: NinjaAttributes;
  workoutHistory?: any[]; // Simplificado para o exemplo
  avatarSpecs?: AvatarSpecs;
  avatar_specs?: AvatarSpecs; // Compatibilidade DB
}

export interface WorkoutSeries {
  id: string;
  category: string;
  exercises: Exercise[];
}

export interface Exercise {
  name: string;
  reps: string;
  description: string;
}

export interface PlayerRank {
  id: string;
  name: string;
  points: number;
  streak: number;
  lastWorkout: string;
  avatar: string;
  city: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface MatchContra {
  id: string;
  creator: string;
  location: string;
  date: string;
  playersNeeded: number;
  level: string;
}

export interface Tryout {
  id: string;
  club_name: string;
  category: string;
  date: string;
  location: string;
  description: string;
  link: string;
}
