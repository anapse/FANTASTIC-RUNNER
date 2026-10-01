import {
  GameObject,
  PlayerState,
  Projectile,
  Particle,
  ExplosionFX,
  WeaponType,
  PowerUpType,
  PlayerStats,
  EntityType,
} from './types';
import { getSpriteAtlas } from './assets';
import { sound } from './audio';
import tunnelBgUrl from '../assets/images/scifi_tunnel_track_1790828360317.jpg';

// Sliced transparent sprites from user's sprite sheets
import run0 from '../assets/images/runner_run_0.png';
import run1 from '../assets/images/runner_run_1.png';
import run2 from '../assets/images/runner_run_2.png';
import run3 from '../assets/images/runner_run_3.png';

import shoot0 from '../assets/images/runner_shoot_0.png';
import shoot1 from '../assets/images/runner_shoot_1.png';
import shoot2 from '../assets/images/runner_shoot_2.png';
import shoot3 from '../assets/images/runner_shoot_3.png';

export class GameEngine {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  private tunnelBgImage: HTMLImageElement;
  private runSprites: HTMLImageElement[] = [];
  private shootSprites: HTMLImageElement[] = [];

  // Viewport Dimensions (9:16 Standard Mobile Aspect Ratio)
  public readonly width = 450;
  public readonly height = 800;

  // Camera & Perspective Constants
  public readonly vanishingX = 225;
  public readonly vanishingY = 320; // Mid-screen horizon for natural, gentle perspective
  public readonly focalLength = 360;
  public readonly groundYOffset = 760; // Feet anchored near bottom (760px) of 800px viewport (~5% margin)

  // World Speed & Progression
  public worldSpeed = 12;
  public distance = 0; // in meters
  public score = 0;
  public coinsCollected = 0;
  public killsCount = 0;
  public isGameOver = false;

  // Player State
  public player: PlayerState;
  public stats: PlayerStats;

  // Game World Entities
  public entities: GameObject[] = [];
  public playerProjectiles: Projectile[] = [];
  public enemyProjectiles: Projectile[] = [];
  public particles: Particle[] = [];
  public explosions: ExplosionFX[] = [];

  // Spawning Timers & Tunnel Grid
  private tunnelZOffset = 0;
  private spawnTimer = 0;
  private bossTimer = 0;
  private nextBossDistance = 1000;
  private lastTime = 0;
  private animFrameReq = 0;

  // Callback to update React UI
  private onUIUpdate?: () => void;

  constructor(canvas: HTMLCanvasElement, stats: PlayerStats, onUIUpdate?: () => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.stats = stats;
    this.onUIUpdate = onUIUpdate;

    // Load High-Res Sci-Fi Spaceship Tunnel Background
    this.tunnelBgImage = new Image();
    this.tunnelBgImage.src = tunnelBgUrl;

    // Load transparent sliced sprites (Run & Shoot from user's sheets)
    this.runSprites = [run0, run1, run2, run3].map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    this.shootSprites = [shoot0, shoot1, shoot2, shoot3].map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    // Initialize Player
    this.player = this.createInitialPlayerState();
  }

  private createInitialPlayerState(): PlayerState {
    return {
      x: 0,
      y: 0,
      z: 0,
      lane: 0,
      targetX: 0,
      vx: 0,
      vy: 0,
      isJumping: false,
      jumpType: 'NONE',
      isDashing: false,
      dashTimer: 0,
      lives: 3,
      maxLives: 3,
      invulnerableTimer: 0,
      animState: 'RUN',
      animFrame: 0,
      shootCooldown: 0,
      activePowerUps: {},
    };
  }

  public reset(stats: PlayerStats) {
    this.stats = stats;
    this.player = this.createInitialPlayerState();
    this.entities = [];
    this.playerProjectiles = [];
    this.enemyProjectiles = [];
    this.particles = [];
    this.explosions = [];
    this.distance = 0;
    this.score = 0;
    this.coinsCollected = 0;
    this.killsCount = 0;
    this.worldSpeed = 12;
    this.isGameOver = false;
    this.nextBossDistance = 1000;
    this.spawnTimer = 0;
  }

  public start() {
    this.lastTime = performance.now();
    sound.startBGM();
    this.loop(this.lastTime);
  }

  public stop() {
    if (this.animFrameReq) {
      cancelAnimationFrame(this.animFrameReq);
    }
    sound.stopBGM();
  }

  private loop = (currentTime: number) => {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    if (!this.isGameOver) {
      this.update(dt);
    }
    this.render();

    this.animFrameReq = requestAnimationFrame(this.loop);
  };

  /* ========================================================================
     GAME STATE UPDATE LOGIC
     ======================================================================== */

  private update(dt: number) {
    // 1. Distance & Difficulty Scaling
    const speedMultiplier = this.player.isDashing ? 2.2 : 1.0;
    const currentSpeed = this.worldSpeed * speedMultiplier;

    this.distance += currentSpeed * dt * 0.8;
    this.score += Math.floor(currentSpeed * dt * 5) * (this.player.activePowerUps.MULTIPLIER ? 2 : 1);
    this.worldSpeed = Math.min(12 + this.distance / 150, 26);

    // Tunnel grid animation
    this.tunnelZOffset = (this.tunnelZOffset + currentSpeed * dt * 40) % 100;

    // 2. Player Timers & Power-ups
    if (this.player.invulnerableTimer > 0) {
      this.player.invulnerableTimer -= dt;
    }
    if (this.player.shootCooldown > 0) {
      this.player.shootCooldown -= dt;
    }
    if (this.player.isDashing) {
      this.player.dashTimer -= dt;
      if (this.player.dashTimer <= 0) {
        this.player.isDashing = false;
      }
    }

    // Active Power-ups countdown
    Object.keys(this.player.activePowerUps).forEach((key) => {
      const pKey = key as PowerUpType;
      if (this.player.activePowerUps[pKey]) {
        this.player.activePowerUps[pKey]! -= dt;
        if (this.player.activePowerUps[pKey]! <= 0) {
          delete this.player.activePowerUps[pKey];
        }
      }
    });

    // 3. Player Movement & Physics
    // Smooth X interpolation
    this.player.x += (this.player.targetX - this.player.x) * 12 * dt;

    // Jump Physics
    if (this.player.isJumping) {
      this.player.y += this.player.vy * dt * 60;
      this.player.vy -= 1.2 * dt * 60; // Gravity

      if (this.player.y <= 0) {
        this.player.y = 0;
        this.player.vy = 0;
        this.player.isJumping = false;
        this.player.jumpType = 'NONE';
        this.player.animState = 'RUN';
      }
    }

    // Animation frame index
    this.player.animFrame += dt * 10;

    // 4. Entity Spawner
    this.spawnTimer += dt * currentSpeed;
    if (this.spawnTimer > 18) {
      this.spawnTimer = 0;
      this.spawnRandomEntities();
    }

    // Boss Spawn Check
    if (this.distance >= this.nextBossDistance) {
      this.spawnBoss();
      this.nextBossDistance += 1200;
    }

    // 5. Update Game Entities
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const ent = this.entities[i];
      ent.z -= (ent.speedZ + currentSpeed) * dt * 40;

      // Enemy horizontal movement
      if (ent.vx) ent.x += ent.vx * dt * 20;

      // Magnet Power-up logic for coins & gems
      if (this.player.activePowerUps.MAGNET && (ent.type === 'COIN' || ent.type === 'GEM_BLUE' || ent.type === 'GEM_RED')) {
        const dx = this.player.x - ent.x;
        const dy = this.player.y - ent.y;
        if (ent.z < 350) {
          ent.x += dx * 6 * dt;
          ent.y += dy * 6 * dt;
        }
      }

      // Remove entities behind camera
      if (ent.z < -20 || !ent.active) {
        this.entities.splice(i, 1);
        continue;
      }

      // Enemy shooting
      if ((ent.type === 'DRONE_RED' || ent.type === 'DRONE_BLUE' || ent.type === 'BOSS_SHIP') && ent.z < 700 && ent.z > 200) {
        if (Math.random() < dt * 0.4) {
          this.enemyShoot(ent);
        }
      }

      // Check Player Collision
      this.checkPlayerEntityCollision(ent);
    }

    // 6. Update Player Projectiles
    for (let i = this.playerProjectiles.length - 1; i >= 0; i--) {
      const p = this.playerProjectiles[i];
      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;
      p.z += p.vz * dt * 60;

      if (p.z > 1100 || !p.active) {
        this.playerProjectiles.splice(i, 1);
        continue;
      }

      // Check Projectile <-> Entity Collisions
      for (const ent of this.entities) {
        if (!ent.active || ent.z < 20) continue;
        if (
          ent.type === 'COIN' ||
          ent.type === 'GEM_BLUE' ||
          ent.type === 'GEM_RED' ||
          ent.type === 'POWERUP_ORB' ||
          ent.type === 'HEART'
        ) {
          continue;
        }

        const dz = Math.abs(p.z - ent.z);
        const dx = Math.abs(p.x - ent.x);
        const dy = Math.abs(p.y - ent.y);

        if (dz < 40 && dx < ent.radius * 1.2 && dy < ent.radius * 1.2) {
          ent.hp -= p.damage;
          p.active = false;

          // Impact sparks
          this.addExplosion(ent.x, ent.y, ent.z, 'IMPACT');

          if (ent.hp <= 0) {
            ent.active = false;
            this.killsCount++;
            this.score += ent.points;
            sound.playExplosion(ent.type === 'BOSS_SHIP' || ent.type === 'ROCK');
            this.addExplosion(ent.x, ent.y, ent.z, ent.radius > 35 ? 'LARGE' : 'SMALL');

            // Chance to drop coins or gems upon destruction
            if (Math.random() < 0.6) {
              this.spawnLootAt(ent.x, ent.y, ent.z);
            }
          }
          break;
        }
      }
    }

    // 7. Update Enemy Projectiles
    for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) {
      const ep = this.enemyProjectiles[i];
      ep.z -= ep.vz * dt * 60;

      if (ep.z < -20 || !ep.active) {
        this.enemyProjectiles.splice(i, 1);
        continue;
      }

      // Check hit on player
      if (ep.z < 30 && ep.z > -10) {
        const dx = Math.abs(ep.x - this.player.x);
        const dy = Math.abs(ep.y - this.player.y);
        if (dx < 25 && dy < 30) {
          ep.active = false;
          this.damagePlayer('ENEMY_SHOT');
        }
      }
    }

    // 8. Update Particles & Explosions
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const part = this.particles[i];
      part.life += dt;
      part.x += part.vx * dt * 60;
      part.y += part.vy * dt * 60;
      part.z += part.vz * dt * 60;
      part.alpha = 1 - part.life / part.maxLife;

      if (part.life >= part.maxLife) {
        this.particles.splice(i, 1);
      }
    }

    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const exp = this.explosions[i];
      exp.frameTime += dt * 15;
      exp.frame = Math.floor(exp.frameTime);
      if (exp.frame >= exp.maxFrame) {
        this.explosions.splice(i, 1);
      }
    }

    if (this.onUIUpdate) {
      this.onUIUpdate();
    }
  }

  /* ========================================================================
     CONTROLS & ACTION COMMANDS
     ======================================================================== */

  public moveLeft() {
    if (this.player.lane > -1) {
      this.player.lane -= 1;
      this.player.targetX = this.player.lane * 110;
    }
  }

  public moveRight() {
    if (this.player.lane < 1) {
      this.player.lane += 1;
      this.player.targetX = this.player.lane * 110;
    }
  }

  public jump(dir?: 'LEFT' | 'RIGHT') {
    if (!this.player.isJumping) {
      this.player.isJumping = true;
      const jumpPower = this.player.activePowerUps.SUPER_JUMP ? 24 : 17;
      this.player.vy = jumpPower;
      sound.playJump();

      if (dir === 'LEFT') {
        this.moveLeft();
        this.player.jumpType = 'LEFT';
      } else if (dir === 'RIGHT') {
        this.moveRight();
        this.player.jumpType = 'RIGHT';
      } else {
        this.player.jumpType = 'VERTICAL';
      }
    }
  }

  public dash() {
    if (!this.player.isDashing) {
      this.player.isDashing = true;
      this.player.dashTimer = 1.8;
      sound.playPowerUp();

      // Create dash speed particles
      for (let i = 0; i < 20; i++) {
        this.particles.push({
          x: this.player.x + (Math.random() * 80 - 40),
          y: this.player.y + Math.random() * 40,
          z: Math.random() * 100,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          vz: -30,
          size: 3 + Math.random() * 4,
          color: '#00f0ff',
          alpha: 1,
          life: 0,
          maxLife: 0.5,
          type: 'SPEED_LINE',
        });
      }
    }
  }

  public shoot() {
    if (this.player.shootCooldown > 0) return;

    const weapon = this.stats.equippedWeapon;
    const isMultiShot = Boolean(this.player.activePowerUps.MULTI_SHOT);

    sound.playShoot(weapon);
    this.player.shootCooldown = weapon === 'BEAM' ? 0.35 : weapon === 'PLASMA' ? 0.4 : 0.15;
    this.player.animState = 'SHOOT';

    const pY = this.player.y + 35;

    if (isMultiShot || weapon === 'SPREAD') {
      // 3-way spread
      [-12, 0, 12].forEach((angleVx) => {
        this.playerProjectiles.push({
          id: Math.random().toString(),
          isPlayer: true,
          x: this.player.x,
          y: pY,
          z: 20,
          vx: angleVx,
          vy: 0,
          vz: 35,
          radius: 12,
          damage: 15,
          type: 'SPREAD',
          color: '#ffaa00',
          active: true,
        });
      });
    } else if (weapon === 'BEAM') {
      this.playerProjectiles.push({
        id: Math.random().toString(),
        isPlayer: true,
        x: this.player.x,
        y: pY,
        z: 20,
        vx: 0,
        vy: 0,
        vz: 50,
        radius: 20,
        damage: 40,
        type: 'BEAM',
        color: '#00f0ff',
        active: true,
      });
    } else if (weapon === 'PLASMA') {
      this.playerProjectiles.push({
        id: Math.random().toString(),
        isPlayer: true,
        x: this.player.x,
        y: pY,
        z: 20,
        vx: 0,
        vy: 0,
        vz: 30,
        radius: 26,
        damage: 60,
        type: 'PLASMA',
        color: '#a000ff',
        active: true,
      });
    } else {
      // BASIC
      this.playerProjectiles.push({
        id: Math.random().toString(),
        isPlayer: true,
        x: this.player.x,
        y: pY,
        z: 20,
        vx: 0,
        vy: 0,
        vz: 38,
        radius: 10,
        damage: 20,
        type: 'BASIC',
        color: '#ffcc00',
        active: true,
      });
    }
  }

  /* ========================================================================
     COLLISION & COMBAT HELPER METHODS
     ======================================================================== */

  private checkPlayerEntityCollision(ent: GameObject) {
    if (!ent.active) return;

    // Depth check: Player is near Z=0 (10 to -20)
    if (ent.z > 35 || ent.z < -10) return;

    const dx = Math.abs(ent.x - this.player.x);
    const dy = Math.abs(ent.y - this.player.y);

    // Collision threshold based on entity
    const thresholdX = ent.radius + 15;
    const thresholdY = ent.radius + 20;

    if (dx < thresholdX && dy < thresholdY) {
      // 1. Collectible Loot
      if (ent.type === 'COIN') {
        ent.active = false;
        this.coinsCollected += 1;
        this.score += 50;
        sound.playCoin();
        this.addExplosion(ent.x, ent.y, ent.z, 'COIN');
        return;
      }
      if (ent.type === 'GEM_BLUE') {
        ent.active = false;
        this.coinsCollected += 5;
        this.score += 250;
        sound.playCoin();
        this.addExplosion(ent.x, ent.y, ent.z, 'COIN');
        return;
      }
      if (ent.type === 'GEM_RED') {
        ent.active = false;
        this.coinsCollected += 10;
        this.score += 500;
        sound.playCoin();
        this.addExplosion(ent.x, ent.y, ent.z, 'COIN');
        return;
      }
      if (ent.type === 'HEART') {
        ent.active = false;
        this.player.lives = Math.min(this.player.lives + 1, this.player.maxLives);
        sound.playPowerUp();
        return;
      }
      if (ent.type === 'POWERUP_ORB' && ent.powerUpKind) {
        ent.active = false;
        this.player.activePowerUps[ent.powerUpKind] = 8.0; // 8 seconds duration
        sound.playPowerUp();
        return;
      }

      // 2. Dash destroys obstacles without player damage
      if (this.player.isDashing) {
        ent.active = false;
        this.score += ent.points;
        sound.playExplosion(true);
        this.addExplosion(ent.x, ent.y, ent.z, 'LARGE');
        return;
      }

      // 3. Laser Barrier Jump Check
      if (ent.type === 'LASER_BARRIER_LOW' && this.player.y > 45) {
        // Player safely jumped over low laser
        return;
      }

      // 4. Harmful Obstacles / Enemies
      this.damagePlayer('OBSTACLE');
      ent.active = false;
      this.addExplosion(ent.x, ent.y, ent.z, 'LARGE');
    }
  }

  private damagePlayer(_source: string) {
    if (this.player.invulnerableTimer > 0) return;

    // Shield powerup absorbs hit
    if (this.player.activePowerUps.SHIELD) {
      delete this.player.activePowerUps.SHIELD;
      this.player.invulnerableTimer = 1.0;
      sound.playPowerUp();
      return;
    }

    this.player.lives -= 1;
    this.player.invulnerableTimer = 1.8;
    this.player.animState = 'DAMAGE';
    sound.playDamage();

    if (this.player.lives <= 0) {
      this.isGameOver = true;
      this.player.animState = 'DEATH';
      sound.playExplosion(true);
      sound.stopBGM();
    }
  }

  private spawnRandomEntities() {
    const lanes = [-110, 0, 110];
    const laneIndex = Math.floor(Math.random() * 3);
    const spawnX = lanes[laneIndex];

    const rnd = Math.random();

    if (rnd < 0.28) {
      // 3D Volcanic Magma Rock / Asteroid
      this.entities.push({
        id: Math.random().toString(),
        type: 'ROCK',
        x: spawnX,
        y: 0,
        z: 1000,
        speedZ: 0,
        radius: 48,
        width: 110,
        height: 110,
        hp: 30,
        maxHp: 30,
        points: 100,
        active: true,
      });
    } else if (rnd < 0.48) {
      // Enemy Drone / Spiked Mine
      const isMine = Math.random() < 0.3;
      if (isMine) {
        this.entities.push({
          id: Math.random().toString(),
          type: 'SPIKED_MINE',
          x: spawnX,
          y: 35,
          z: 1000,
          speedZ: 1,
          radius: 38,
          width: 86,
          height: 86,
          hp: 40,
          maxHp: 40,
          points: 150,
          active: true,
        });
      } else {
        const isRed = Math.random() < 0.5;
        this.entities.push({
          id: Math.random().toString(),
          type: isRed ? 'DRONE_RED' : 'DRONE_BLUE',
          x: spawnX,
          y: 45,
          z: 1000,
          speedZ: 2,
          vx: isRed ? (Math.random() - 0.5) * 4 : 0,
          radius: 36,
          width: 80,
          height: 80,
          hp: 25,
          maxHp: 25,
          points: 200,
          active: true,
        });
      }
    } else if (rnd < 0.65) {
      // Laser Barrier or Crate
      const isCrate = Math.random() < 0.4;
      if (isCrate) {
        this.entities.push({
          id: Math.random().toString(),
          type: 'CRATE',
          x: spawnX,
          y: 0,
          z: 1000,
          speedZ: 0,
          radius: 36,
          width: 80,
          height: 80,
          hp: 20,
          maxHp: 20,
          points: 75,
          active: true,
        });
      } else {
        this.entities.push({
          id: Math.random().toString(),
          type: 'LASER_BARRIER_LOW',
          x: 0,
          y: 20,
          z: 1000,
          speedZ: 0,
          radius: 50,
          width: 280,
          height: 50,
          hp: 999, // indestructible barrier
          maxHp: 999,
          points: 0,
          active: true,
        });
      }
    } else if (rnd < 0.85) {
      // Coins line pattern
      for (let c = 0; c < 4; c++) {
        this.entities.push({
          id: Math.random().toString(),
          type: 'COIN',
          x: spawnX,
          y: 25,
          z: 1000 + c * 80,
          speedZ: 0,
          radius: 20,
          width: 44,
          height: 44,
          hp: 1,
          maxHp: 1,
          points: 50,
          active: true,
        });
      }
    } else {
      // Power-up Orb
      const pKinds: PowerUpType[] = ['SHIELD', 'SUPER_JUMP', 'MULTI_SHOT', 'MAGNET', 'MULTIPLIER', 'DASH'];
      const k = pKinds[Math.floor(Math.random() * pKinds.length)];
      this.entities.push({
        id: Math.random().toString(),
        type: 'POWERUP_ORB',
        x: spawnX,
        y: 40,
        z: 1000,
        speedZ: 0,
        radius: 26,
        width: 54,
        height: 54,
        hp: 1,
        maxHp: 1,
        powerUpKind: k,
        points: 150,
        active: true,
      });
    }
  }

  private spawnBoss() {
    this.entities.push({
      id: 'BOSS_' + Date.now(),
      type: 'BOSS_SHIP',
      x: 0,
      y: 60,
      z: 1000,
      speedZ: -4, // stays near horizon and fires
      radius: 65,
      width: 140,
      height: 100,
      hp: 350,
      maxHp: 350,
      points: 2500,
      active: true,
    });
  }

  private enemyShoot(enemy: GameObject) {
    this.enemyProjectiles.push({
      id: Math.random().toString(),
      isPlayer: false,
      x: enemy.x,
      y: enemy.y,
      z: enemy.z - 10,
      vx: 0,
      vy: 0,
      vz: 28,
      radius: 10,
      damage: 1,
      type: 'ENEMY_BULLET',
      color: '#ff0055',
      active: true,
    });
  }

  private spawnLootAt(x: number, y: number, z: number) {
    const isGem = Math.random() < 0.3;
    this.entities.push({
      id: Math.random().toString(),
      type: isGem ? 'GEM_BLUE' : 'COIN',
      x,
      y,
      z,
      speedZ: 0,
      radius: 16,
      width: 32,
      height: 32,
      hp: 1,
      maxHp: 1,
      points: isGem ? 250 : 50,
      active: true,
    });
  }

  private addExplosion(x: number, y: number, z: number, type: 'SMALL' | 'LARGE' | 'IMPACT' | 'COIN') {
    this.explosions.push({
      x,
      y,
      z,
      scale: type === 'LARGE' ? 1.5 : 0.8,
      type,
      frame: 0,
      maxFrame: 8,
      frameTime: 0,
    });
  }

  /* ========================================================================
     CANVAS PSEUDO-3D RENDERING SYSTEM
     ======================================================================== */

  private render() {
    const { ctx, width, height, vanishingX, vanishingY } = this;
    const atlas = getSpriteAtlas();

    // 1. Clear background & Space Horizon Gradient
    const spaceGrad = ctx.createLinearGradient(0, 0, 0, height);
    spaceGrad.addColorStop(0, '#030712'); // Deep Space
    spaceGrad.addColorStop(0.35, '#0f172a');
    spaceGrad.addColorStop(0.5, '#1e1b4b'); // Horizon Glow
    spaceGrad.addColorStop(1, '#020617');
    ctx.fillStyle = spaceGrad;
    ctx.fillRect(0, 0, width, height);

    // Starfield & Horizon Nebula
    this.renderSpaceBackground();

    // 2. Sci-Fi Tunnel Floor Grid & Side Pillars
    this.renderTunnelGrid();

    // 3. Collect all renderable 3D entities for Depth Sorting (Far to Near)
    const renderList: Array<{
      z: number;
      draw: () => void;
    }> = [];

    // Projectile objects
    this.playerProjectiles.forEach((p) => {
      renderList.push({
        z: p.z,
        draw: () => this.drawProjectile(p, atlas),
      });
    });

    this.enemyProjectiles.forEach((ep) => {
      renderList.push({
        z: ep.z,
        draw: () => this.drawProjectile(ep, atlas),
      });
    });

    // World Entities (Rocks, Drones, Lasers, Coins)
    this.entities.forEach((ent) => {
      renderList.push({
        z: ent.z,
        draw: () => this.drawEntity(ent, atlas),
      });
    });

    // Explosions FX
    this.explosions.forEach((exp) => {
      renderList.push({
        z: exp.z,
        draw: () => this.drawExplosion(exp, atlas),
      });
    });

    // Player (Always rendered at Z=0)
    renderList.push({
      z: this.player.z,
      draw: () => this.drawPlayer(atlas),
    });

    // Sort by Z descending (Distant Z=1000 rendered first, Close Z=0 rendered last)
    renderList.sort((a, b) => b.z - a.z);

    // Execute Depth Render
    renderList.forEach((item) => item.draw());

    // 4. Foreground Particles & Dash FX
    this.renderParticles();

    // Invulnerability Damage Flash Overlay
    if (this.player.invulnerableTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fillRect(0, 0, width, height);
    }
  }

  private project(
    wx: number,
    wy: number,
    wz: number
  ): { x: number; y: number; scale: number } {
    const scale = this.focalLength / (this.focalLength + Math.max(wz, 1));
    const x = this.vanishingX + wx * scale;
    const y = this.vanishingY + (this.groundYOffset - wy - this.vanishingY) * scale;
    return { x, y, scale };
  }

  private renderSpaceBackground() {
    const { ctx, width, vanishingY } = this;

    // Glowing Nebula Star at Horizon
    const glow = ctx.createRadialGradient(
      this.vanishingX,
      vanishingY,
      10,
      this.vanishingX,
      vanishingY,
      220
    );
    glow.addColorStop(0, 'rgba(0, 240, 255, 0.45)');
    glow.addColorStop(0.5, 'rgba(147, 51, 234, 0.2)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, vanishingY + 80);

    // Stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 35; i++) {
      const sx = (i * 137) % width;
      const sy = (i * 83) % (vanishingY - 20);
      const sz = ((i * 5) % 3) + 1;
      ctx.fillRect(sx, sy, sz, sz);
    }
  }

  private safeDrawImage(
    img: CanvasImageSource | null | undefined,
    dx: number,
    dy: number,
    dw?: number,
    dh?: number
  ) {
    if (!img) return;
    if (
      !(img instanceof HTMLCanvasElement) &&
      !(img instanceof HTMLImageElement) &&
      !(img instanceof ImageBitmap) &&
      !(typeof OffscreenCanvas !== 'undefined' && img instanceof OffscreenCanvas)
    ) {
      return;
    }
    try {
      if (dw !== undefined && dh !== undefined) {
        this.ctx.drawImage(img, dx, dy, dw, dh);
      } else {
        this.ctx.drawImage(img, dx, dy);
      }
    } catch {
      // Safe fallback
    }
  }

  private renderTunnelGrid() {
    const { ctx, vanishingX, vanishingY, width, height } = this;

    // 1. Draw High-Res Sci-Fi Spaceship Tunnel Background Image (Matching Image 2)
    if (
      this.tunnelBgImage &&
      this.tunnelBgImage.complete &&
      this.tunnelBgImage.naturalWidth > 0
    ) {
      this.safeDrawImage(this.tunnelBgImage, 0, 0, width, height);
    } else {
      ctx.fillStyle = '#0a101d';
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Animated Runway Floor Panels & Moving Speed Chevrons (Matching Image 2)
    // Symmetrical forward moving orange/amber floor light bars and chevrons
    for (let z = 1000; z >= 0; z -= 110) {
      const actualZ = z - this.tunnelZOffset;
      if (actualZ <= 0) continue;

      const pCenter = this.project(0, 0, actualZ);
      const pLeft = this.project(-70, 0, actualZ);
      const pRight = this.project(70, 0, actualZ);

      // Central forward chevron speed arrow (^)
      const s = Math.max(1, 14 * (1 - actualZ / 1000));
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = Math.max(1, 2.5 * (1 - actualZ / 1000));
      ctx.beginPath();
      ctx.moveTo(pCenter.x - s, pCenter.y + s * 0.6);
      ctx.lineTo(pCenter.x, pCenter.y - s * 0.4);
      ctx.lineTo(pCenter.x + s, pCenter.y + s * 0.6);
      ctx.stroke();

      // Glowing Amber Floor Light Rectangles (Center and side lights from Image 2)
      const rw = Math.max(2, 32 * (1 - actualZ / 1000));
      const rh = Math.max(1, 9 * (1 - actualZ / 1000));
      ctx.fillStyle = '#ffaa00';
      ctx.shadowColor = '#ff6600';
      ctx.shadowBlur = 8;
      ctx.fillRect(pCenter.x - rw / 2, pCenter.y + s, rw, rh);

      // Side Amber Light Strips
      const sw = Math.max(2, 22 * (1 - actualZ / 1000));
      const sh = Math.max(1, 7 * (1 - actualZ / 1000));
      ctx.fillRect(pLeft.x - sw / 2, pLeft.y, sw, sh);
      ctx.fillRect(pRight.x - sw / 2, pRight.y, sw, sh);
      ctx.shadowBlur = 0;
    }

    // Lane divider dashed lines (3 running lanes: left, center, right)
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 1.5;
    [-45, 45].forEach((wx) => {
      const pFar = this.project(wx, 0, 1000);
      const pNear = this.project(wx, 0, -20);
      ctx.beginPath();
      ctx.moveTo(pFar.x, pFar.y);
      ctx.lineTo(pNear.x, pNear.y);
      ctx.stroke();
    });

    // Gentle Horizon Line Glow
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, vanishingY);
    ctx.lineTo(width, vanishingY);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  private drawPlayer(atlas: ReturnType<typeof getSpriteAtlas>) {
    const { ctx } = this;
    const { x, y, z, isDashing, activePowerUps, animFrame, animState, shootCooldown } = this.player;

    const p = this.project(x, y, z);

    ctx.save();
    ctx.translate(p.x, p.y);

    // 1. Dash Energy Aura (Cyan)
    if (isDashing) {
      ctx.fillStyle = 'rgba(0, 240, 255, 0.45)';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.ellipse(0, -100, 85, 110, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // 2. Select Sprite: EXCLUSIVELY the user's sliced 512x512 sprites (Run vs Run & Shoot)
    const isShooting = animState === 'SHOOT' || shootCooldown > 0;
    const frameIndex = Math.abs(Math.floor(animFrame || 0)) % 4;

    const spriteList = isShooting ? this.shootSprites : this.runSprites;
    const sprite = spriteList[frameIndex % spriteList.length];

    // Strictly maintain 1:1 aspect ratio of the 512x512 official sprite frames (no distortion)
    const renderSize = 210;
    if (sprite) {
      this.safeDrawImage(sprite, -renderSize / 2, -renderSize, renderSize, renderSize);
    }

    // 3. Shield Active Bubble (Green Hexagonal Shield matching reference)
    if (activePowerUps.SHIELD && atlas.playerShield) {
      this.safeDrawImage(atlas.playerShield, -115, -230, 230, 230);
    }

    ctx.restore();
  }

  private drawEntity(ent: GameObject, atlas: ReturnType<typeof getSpriteAtlas>) {
    const { ctx } = this;
    const p = this.project(ent.x, ent.y, ent.z);

    if (p.x < -100 || p.x > this.width + 100 || p.y < -100 || p.y > this.height + 100) return;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(p.scale, p.scale);

    let sprite: HTMLCanvasElement | null = null;
    const now = Date.now();

    if (ent.type === 'ROCK' && atlas.rock?.length) {
      sprite = atlas.rock[Math.floor(now / 200) % atlas.rock.length];
    } else if (ent.type === 'DRONE_RED' && atlas.droneRed?.length) {
      sprite = atlas.droneRed[Math.floor(now / 100) % atlas.droneRed.length];
    } else if (ent.type === 'DRONE_BLUE' && atlas.droneBlue?.length) {
      sprite = atlas.droneBlue[Math.floor(now / 100) % atlas.droneBlue.length];
    } else if (ent.type === 'BOSS_SHIP') {
      sprite = atlas.bossShip;
    } else if (ent.type === 'SPIKED_MINE') {
      sprite = atlas.spikedMine;
    } else if (ent.type === 'ROTATING_BLADE') {
      sprite = atlas.rotatingBlade;
    } else if (ent.type === 'CRATE') {
      sprite = atlas.crate;
    } else if (ent.type === 'COIN' && atlas.coin?.length) {
      sprite = atlas.coin[Math.floor(now / 120) % atlas.coin.length];
    } else if (ent.type === 'GEM_BLUE') {
      sprite = atlas.gemBlue;
    } else if (ent.type === 'GEM_RED') {
      sprite = atlas.gemRed;
    } else if (ent.type === 'POWERUP_ORB') {
      if (ent.powerUpKind === 'SHIELD') sprite = atlas.powerUpShield;
      else if (ent.powerUpKind === 'SUPER_JUMP') sprite = atlas.powerUpJump;
      else if (ent.powerUpKind === 'MULTI_SHOT') sprite = atlas.powerUpSpread;
      else if (ent.powerUpKind === 'MAGNET') sprite = atlas.powerUpMagnet;
      else if (ent.powerUpKind === 'MULTIPLIER') sprite = atlas.powerUpMultiplier;
      else sprite = atlas.powerUpDash;
    } else if (ent.type === 'LASER_BARRIER_LOW') {
      // Draw Laser Pillars & Gate Beam
      this.safeDrawImage(atlas.laserPillar, -110, -50);
      this.safeDrawImage(atlas.laserPillar, 70, -50);
      this.safeDrawImage(atlas.laserBeam, -60, -30);
    }

    if (sprite) {
      this.safeDrawImage(sprite, -ent.width / 2, -ent.height / 2, ent.width, ent.height);
    }

    // Boss HP bar
    if (ent.type === 'BOSS_SHIP' && ent.hp < ent.maxHp) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(-60, -80, 120, 10);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-58, -78, 116 * (ent.hp / ent.maxHp), 6);
    }

    ctx.restore();
  }

  private drawProjectile(p: Projectile, atlas: ReturnType<typeof getSpriteAtlas>) {
    const { ctx } = this;
    const pt = this.project(p.x, p.y, p.z);

    ctx.save();
    ctx.translate(pt.x, pt.y);
    ctx.scale(pt.scale, pt.scale);

    if (p.isPlayer) {
      // Luminous Cyan Laser Blast (Matching Phone 2 in Image 1)
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#00d2ff';
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 28, 0, 0, Math.PI * 2);
      ctx.fill();

      // White hot core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 0, 4, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      let sprite = atlas.bulletBasic;
      if (p.type === 'SPREAD' && atlas.bulletSpread) sprite = atlas.bulletSpread;
      if (p.type === 'BEAM' && atlas.bulletBeam) sprite = atlas.bulletBeam;
      if (p.type === 'PLASMA' && atlas.bulletPlasma) sprite = atlas.bulletPlasma;

      if (sprite) {
        this.safeDrawImage(sprite, -16, -16, 32, 32);
      }
    }

    ctx.restore();
  }

  private drawExplosion(exp: ExplosionFX, atlas: ReturnType<typeof getSpriteAtlas>) {
    const { ctx } = this;
    const pt = this.project(exp.x, exp.y, exp.z);

    ctx.save();
    ctx.translate(pt.x, pt.y);
    ctx.scale(pt.scale * exp.scale, pt.scale * exp.scale);

    const frames = exp.type === 'LARGE' ? atlas.explosionLarge : atlas.explosionSmall;
    if (frames && frames.length > 0) {
      const frameIdx = Math.min(Math.max(0, exp.frame || 0), frames.length - 1);
      const frameImg = frames[frameIdx];
      if (frameImg) {
        this.safeDrawImage(frameImg, -64, -64, 128, 128);
      }
    }

    ctx.restore();
  }

  private renderParticles() {
    const { ctx } = this;
    this.particles.forEach((p) => {
      const pt = this.project(p.x, p.y, p.z);
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(p.alpha, 0);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, p.size * pt.scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
}
