import { PlayerStats, LeaderboardEntry, Achievement, WeaponType, PowerUpType } from './types';

const STORAGE_KEY = 'fantastic_runner_data_v1';
const LEADERBOARD_KEY = 'fantastic_runner_leaderboard_v1';

export const INITIAL_WEAPONS: Record<WeaponType, number> = {
  BASIC: 1,
  SPREAD: 0,
  BEAM: 0,
  PLASMA: 0,
};

export const INITIAL_POWERUPS: Record<PowerUpType, number> = {
  SHIELD: 1,
  SUPER_JUMP: 1,
  MULTI_SHOT: 1,
  MAGNET: 1,
  MULTIPLIER: 1,
  DASH: 1,
};

export const DEFAULT_STATS: PlayerStats = {
  coins: 12450,
  gems: 327,
  highScore: 12450,
  totalDistance: 0,
  totalKills: 0,
  selectedCharacter: 'HERO_LEO',
  equippedWeapon: 'BASIC',
  weapons: INITIAL_WEAPONS,
  powerUpLevels: INITIAL_POWERUPS,
  unlockedCharacters: ['HERO_LEO'],
  achievements: {},
  settings: {
    soundFx: true,
    music: true,
    volume: 0.8,
    touchControlMode: 'GESTURES',
    particlesQuality: 'HIGH',
  },
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'DIST_1000', title: 'Corredor Novato', description: 'Recorre 1,000 metros en total', rewardCoins: 100, isUnlocked: false, progress: 0, maxProgress: 1000, icon: '🏃' },
  { id: 'DIST_5000', title: 'Velocista Espacial', description: 'Recorre 5,000 metros en total', rewardCoins: 300, isUnlocked: false, progress: 0, maxProgress: 5000, icon: '🚀' },
  { id: 'DIST_10000', title: 'Maestro del Túnel', description: 'Recorre 10,000 metros en total', rewardCoins: 1000, isUnlocked: false, progress: 0, maxProgress: 10000, icon: '🌌' },
  { id: 'KILLS_50', title: 'Cazador de Drones', description: 'Destruye 50 enemigos', rewardCoins: 200, isUnlocked: false, progress: 0, maxProgress: 50, icon: '💥' },
  { id: 'KILLS_200', title: 'Destrucción Total', description: 'Destruye 200 enemigos', rewardCoins: 800, isUnlocked: false, progress: 0, maxProgress: 200, icon: '💣' },
  { id: 'COINS_500', title: 'Ahorrador', description: 'Recolecta 500 monedas', rewardCoins: 250, isUnlocked: false, progress: 0, maxProgress: 500, icon: '🪙' },
  { id: 'COINS_2000', title: 'Magnate de Gemas', description: 'Recolecta 2,000 monedas', rewardCoins: 1000, isUnlocked: false, progress: 0, maxProgress: 2000, icon: '💎' },
  { id: 'SCORE_10000', title: 'Puntuación Alta', description: 'Alcanza 10,000 puntos en una partida', rewardCoins: 500, isUnlocked: false, progress: 0, maxProgress: 10000, icon: '🏆' },
];

export function loadPlayerStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATS,
      ...parsed,
      weapons: { ...INITIAL_WEAPONS, ...parsed.weapons },
      powerUpLevels: { ...INITIAL_POWERUPS, ...parsed.powerUpLevels },
      settings: { ...DEFAULT_STATS.settings, ...parsed.settings },
    };
  } catch (e) {
    console.error('Failed to load stats', e);
    return DEFAULT_STATS;
  }
}

export function savePlayerStats(stats: PlayerStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats', e);
  }
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load leaderboard', e);
  }
  
  // Default mock entries matching high-score arcade spirit
  return [
    { id: '1', playerName: 'Leo Runner', score: 28500, distance: 3420, coins: 412, date: '2026-09-28' },
    { id: '2', playerName: 'Alex Space', score: 22100, distance: 2890, coins: 310, date: '2026-09-29' },
    { id: '3', playerName: 'Cyber Boy', score: 18400, distance: 2150, coins: 255, date: '2026-09-30' },
    { id: '4', playerName: 'Nova Scout', score: 14200, distance: 1800, coins: 190, date: '2026-09-25' },
    { id: '5', playerName: 'Aventurero', score: 9800, distance: 1250, coins: 140, date: '2026-09-27' },
  ];
}

export function addLeaderboardScore(entry: Omit<LeaderboardEntry, 'id' | 'date'>): LeaderboardEntry[] {
  const current = loadLeaderboard();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
  };
  const updated = [...current, newEntry].sort((a, b) => b.score - a.score).slice(0, 10);
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save score to leaderboard', e);
  }
  return updated;
}
