export type GameMode =
  | 'MENU'
  | 'PLAYING'
  | 'PAUSED'
  | 'GAMEOVER'
  | 'SHOP'
  | 'CHARACTER'
  | 'POWERUPS'
  | 'ACHIEVEMENTS'
  | 'RANKING'
  | 'SETTINGS'
  | 'HOW_TO_PLAY'
  | 'RECORD_LOCAL'
  | 'CONTACT';

export type WeaponType = 'BASIC' | 'SPREAD' | 'BEAM' | 'PLASMA';

export type PowerUpType = 'SHIELD' | 'SUPER_JUMP' | 'MULTI_SHOT' | 'MAGNET' | 'MULTIPLIER' | 'DASH';

export interface Weapon {
  id: WeaponType;
  name: string;
  level: number;
  maxLevel: number;
  fireRate: number; // shots per sec
  damage: number;
  description: string;
  cost: number;
}

export interface PowerUpItem {
  id: PowerUpType;
  name: string;
  level: number;
  maxLevel: number;
  duration: number; // in seconds
  description: string;
  cost: number;
  icon: string;
}

export interface PlayerState {
  x: number; // -150 to 150
  y: number; // 0 to 180 (jump height)
  z: number; // always near 0
  lane: number; // -1 (left), 0 (center), 1 (right)
  targetX: number;
  vx: number;
  vy: number;
  isJumping: boolean;
  jumpType: 'VERTICAL' | 'LEFT' | 'RIGHT' | 'NONE';
  isDashing: boolean;
  dashTimer: number;
  lives: number;
  maxLives: number;
  invulnerableTimer: number;
  animState: 'IDLE' | 'RUN' | 'JUMP' | 'SHOOT' | 'DAMAGE' | 'DEATH';
  animFrame: number;
  shootCooldown: number;
  activePowerUps: Partial<Record<PowerUpType, number>>; // type -> remaining duration seconds
}

export type EntityType = 
  | 'ROCK'
  | 'DRONE_RED'
  | 'DRONE_BLUE'
  | 'BOSS_SHIP'
  | 'LASER_BARRIER_LOW'
  | 'LASER_BARRIER_HIGH'
  | 'LASER_BARRIER_FULL'
  | 'SPIKED_MINE'
  | 'ROTATING_BLADE'
  | 'CRATE'
  | 'COIN'
  | 'GEM_BLUE'
  | 'GEM_RED'
  | 'POWERUP_ORB'
  | 'HEART';

export interface GameObject {
  id: string;
  type: EntityType;
  x: number; // -180 to 180
  y: number; // 0 to 150
  z: number; // 1000 down to 0
  speedZ: number; // speed towards player
  vx?: number;
  vy?: number;
  radius: number; // collision radius
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  powerUpKind?: PowerUpType;
  points: number;
  active: boolean;
  animFrame?: number;
  animTime?: number;
}

export interface Projectile {
  id: string;
  isPlayer: boolean;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number; // positive = moving away to background
  radius: number;
  damage: number;
  type: WeaponType | 'ENEMY_BULLET';
  color: string;
  active: boolean;
}

export interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type?: 'SPARK' | 'EXPLOSION' | 'SMOKE' | 'SHIELD' | 'DASH' | 'SPEED_LINE';
}

export interface ExplosionFX {
  x: number;
  y: number;
  z: number;
  scale: number;
  type: 'SMALL' | 'LARGE' | 'IMPACT' | 'COIN';
  frame: number;
  maxFrame: number;
  frameTime: number;
}

export interface PlayerStats {
  coins: number;
  gems: number;
  highScore: number;
  totalDistance: number;
  totalKills: number;
  selectedCharacter: string;
  equippedWeapon: WeaponType;
  weapons: Record<WeaponType, number>; // type -> level
  powerUpLevels: Record<PowerUpType, number>;
  unlockedCharacters: string[];
  achievements: Record<string, boolean>;
  settings: {
    soundFx: boolean;
    music: boolean;
    volume: number; // 0 to 1
    touchControlMode: 'GESTURES' | 'BUTTONS' | 'BOTH';
    particlesQuality: 'HIGH' | 'LOW';
  };
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  distance: number;
  coins: number;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  isUnlocked: boolean;
  progress: number;
  maxProgress: number;
  icon: string;
}
