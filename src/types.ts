export interface SubTheme {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  photoUrl?: string;
  type: 'tattoo' | 'trivia' | 'meme' | 'social';
}

export interface MainTheme {
  id: string;
  title: string;
  subThemes: SubTheme[];
}

export interface GameState {
  isUnlocked: boolean;
  totalPoints: number;
  completedSubThemes: string[]; // IDs
  happinessLevel: number; // 0 to 100
  selectedMainThemeId?: string;
}

export const PASSWORD = "DESPECH1NA";
export const PARTY_DATE = new Date('2026-05-16T10:00:00'); // Sábado 16 de mayo 10:00 AM

export interface UserProgress {
  userId: string;
  gameState: GameState;
  updatedAt: any;
}
