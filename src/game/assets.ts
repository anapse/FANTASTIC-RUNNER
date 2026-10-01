/**
 * Fantastic Runner Procedural Vector & Sprite Generator
 * Renders high-fidelity sprites onto offscreen canvases for crisp, hardware-accelerated 60fps draw operations.
 */

export interface SpriteAtlas {
  playerRun: HTMLCanvasElement[];
  playerShoot: HTMLCanvasElement;
  playerJump: HTMLCanvasElement;
  playerFront: HTMLCanvasElement;
  playerShield: HTMLCanvasElement;
  rock: HTMLCanvasElement[];
  rockWall: HTMLCanvasElement;
  droneRed: HTMLCanvasElement[];
  droneBlue: HTMLCanvasElement[];
  bossShip: HTMLCanvasElement;
  laserPillar: HTMLCanvasElement;
  laserBeam: HTMLCanvasElement;
  spikedMine: HTMLCanvasElement;
  rotatingBlade: HTMLCanvasElement;
  glowingCube: HTMLCanvasElement;
  crate: HTMLCanvasElement;
  coin: HTMLCanvasElement[];
  goldBar: HTMLCanvasElement;
  gemBlue: HTMLCanvasElement;
  gemRed: HTMLCanvasElement;
  gemGreen: HTMLCanvasElement;
  powerUpShield: HTMLCanvasElement;
  powerUpJump: HTMLCanvasElement;
  powerUpSpread: HTMLCanvasElement;
  powerUpMagnet: HTMLCanvasElement;
  powerUpMultiplier: HTMLCanvasElement;
  powerUpDash: HTMLCanvasElement;
  bulletBasic: HTMLCanvasElement;
  bulletSpread: HTMLCanvasElement;
  bulletBeam: HTMLCanvasElement;
  bulletPlasma: HTMLCanvasElement;
  explosionSmall: HTMLCanvasElement[];
  explosionLarge: HTMLCanvasElement[];
}

let atlasCache: SpriteAtlas | null = null;

function createOffscreen(w: number, h: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  return { canvas, ctx };
}

export function getSpriteAtlas(): SpriteAtlas {
  if (atlasCache) return atlasCache;

  // 1. Player Run Cycle (8 frames) - Fills 340x480 canvas for real 54% screen height!
  const playerRun: HTMLCanvasElement[] = [];
  for (let f = 0; f < 8; f++) {
    const { canvas, ctx } = createOffscreen(340, 480);
    drawPlayerBack(ctx, 170, 415, f, 'RUN', 4.6);
    playerRun.push(canvas);
  }

  // Player Shoot
  const { canvas: pShoot, ctx: ctxShoot } = createOffscreen(340, 480);
  drawPlayerBack(ctxShoot, 170, 415, 0, 'SHOOT', 4.6);

  // Player Jump
  const { canvas: pJump, ctx: ctxJump } = createOffscreen(340, 480);
  drawPlayerBack(ctxJump, 170, 415, 0, 'JUMP', 4.6);

  // Player Front View (for Menu / Cards)
  const { canvas: pFront, ctx: ctxFront } = createOffscreen(320, 320);
  drawPlayerFront(ctxFront, 160, 220);

  // Player Shield Overlay
  const { canvas: pShield, ctx: ctxShield } = createOffscreen(460, 460);
  drawShieldOverlay(ctxShield, 230, 230, 200);

  // 2. Rocks / Asteroids (4 sizes/variations) - 3D Faceted Magma Boulder
  const rock: HTMLCanvasElement[] = [];
  for (let i = 0; i < 4; i++) {
    const { canvas, ctx } = createOffscreen(180, 180);
    drawAsteroid(ctx, 90, 90, 75, i);
    rock.push(canvas);
  }

  // 3. Drones
  const droneRed: HTMLCanvasElement[] = [];
  const droneBlue: HTMLCanvasElement[] = [];
  for (let f = 0; f < 4; f++) {
    const { canvas: cR, ctx: ctxR } = createOffscreen(80, 80);
    drawDrone(ctxR, 40, 40, '#ff2244', f);
    droneRed.push(cR);

    const { canvas: cB, ctx: ctxB } = createOffscreen(80, 80);
    drawDrone(ctxB, 40, 40, '#00c3ff', f);
    droneBlue.push(cB);
  }

  // Boss Ship
  const { canvas: cBoss, ctx: ctxBoss } = createOffscreen(160, 140);
  drawBossShip(ctxBoss, 80, 70);

  // Laser Pillars & Beam
  const { canvas: cPillar, ctx: ctxPillar } = createOffscreen(40, 100);
  drawLaserPillar(ctxPillar, 20, 50);

  const { canvas: cBeam, ctx: ctxBeam } = createOffscreen(120, 30);
  drawLaserBeam(ctxBeam, 60, 15);

  // Rock Wall Pillar
  const { canvas: cRWall, ctx: ctxRWall } = createOffscreen(96, 120);
  drawRockWall(ctxRWall, 48, 60);

  // Spiked Mine
  const { canvas: cMine, ctx: ctxMine } = createOffscreen(80, 80);
  drawSpikedMine(ctxMine, 40, 40);

  // Rotating Blade
  const { canvas: cBlade, ctx: ctxBlade } = createOffscreen(80, 80);
  drawRotatingBlade(ctxBlade, 40, 40);

  // Glowing Cube
  const { canvas: cCube, ctx: ctxCube } = createOffscreen(80, 80);
  drawGlowingCube(ctxCube, 40, 40);

  // Crate
  const { canvas: cCrate, ctx: ctxCrate } = createOffscreen(64, 64);
  drawCrate(ctxCrate, 32, 32);

  // Coin spin animation (6 frames)
  const coin: HTMLCanvasElement[] = [];
  for (let f = 0; f < 6; f++) {
    const { canvas, ctx } = createOffscreen(48, 48);
    drawCoin(ctx, 24, 24, 18, f);
    coin.push(canvas);
  }

  // Gold Bar
  const { canvas: cGoldBar, ctx: ctxGoldBar } = createOffscreen(48, 48);
  drawGoldBar(ctxGoldBar, 24, 24);

  // Gems
  const { canvas: cGemB, ctx: ctxGemB } = createOffscreen(48, 48);
  drawGem(ctxGemB, 24, 24, '#00d2ff');

  const { canvas: cGemR, ctx: ctxGemR } = createOffscreen(48, 48);
  drawGem(ctxGemR, 24, 24, '#ff2a6d');

  const { canvas: cGemG, ctx: ctxGemG } = createOffscreen(48, 48);
  drawGem(ctxGemG, 24, 24, '#10b981');

  // Powerup Icons
  const { canvas: cPUShield, ctx: ctxPUShield } = createOffscreen(56, 56);
  drawPowerUpIcon(ctxPUShield, 28, 28, 'SHIELD');

  const { canvas: cPUJump, ctx: ctxPUJump } = createOffscreen(56, 56);
  drawPowerUpIcon(ctxPUJump, 28, 28, 'SUPER_JUMP');

  const { canvas: cPUSpread, ctx: ctxPUSpread } = createOffscreen(56, 56);
  drawPowerUpIcon(ctxPUSpread, 28, 28, 'MULTI_SHOT');

  const { canvas: cPUMagnet, ctx: ctxPUMagnet } = createOffscreen(56, 56);
  drawPowerUpIcon(ctxPUMagnet, 28, 28, 'MAGNET');

  const { canvas: cPUMultiplier, ctx: ctxPUMultiplier } = createOffscreen(56, 56);
  drawPowerUpIcon(ctxPUMultiplier, 28, 28, 'MULTIPLIER');

  const { canvas: cPUDash, ctx: ctxPUDash } = createOffscreen(56, 56);
  drawPowerUpIcon(ctxPUDash, 28, 28, 'DASH');

  // Bullets
  const { canvas: cBBasic, ctx: ctxBBasic } = createOffscreen(32, 32);
  drawBullet(ctxBBasic, 16, 16, '#ffcc00', 'BASIC');

  const { canvas: cBSpread, ctx: ctxBSpread } = createOffscreen(32, 32);
  drawBullet(ctxBSpread, 16, 16, '#ff0077', 'SPREAD');

  const { canvas: cBBeam, ctx: ctxBBeam } = createOffscreen(48, 48);
  drawBullet(ctxBBeam, 24, 24, '#00f0ff', 'BEAM');

  const { canvas: cBPlasma, ctx: ctxBPlasma } = createOffscreen(48, 48);
  drawBullet(ctxBPlasma, 24, 24, '#a000ff', 'PLASMA');

  // Explosions (8 frames)
  const explosionSmall: HTMLCanvasElement[] = [];
  const explosionLarge: HTMLCanvasElement[] = [];
  for (let f = 0; f < 8; f++) {
    const { canvas: cS, ctx: ctxS } = createOffscreen(64, 64);
    drawExplosionFrame(ctxS, 32, 32, 28, f, false);
    explosionSmall.push(cS);

    const { canvas: cL, ctx: ctxL } = createOffscreen(128, 128);
    drawExplosionFrame(ctxL, 64, 64, 58, f, true);
    explosionLarge.push(cL);
  }

  atlasCache = {
    playerRun,
    playerShoot: pShoot,
    playerJump: pJump,
    playerFront: pFront,
    playerShield: pShield,
    rock,
    rockWall: cRWall,
    droneRed,
    droneBlue,
    bossShip: cBoss,
    laserPillar: cPillar,
    laserBeam: cBeam,
    spikedMine: cMine,
    rotatingBlade: cBlade,
    glowingCube: cCube,
    crate: cCrate,
    coin,
    goldBar: cGoldBar,
    gemBlue: cGemB,
    gemRed: cGemR,
    gemGreen: cGemG,
    powerUpShield: cPUShield,
    powerUpJump: cPUJump,
    powerUpSpread: cPUSpread,
    powerUpMagnet: cPUMagnet,
    powerUpMultiplier: cPUMultiplier,
    powerUpDash: cPUDash,
    bulletBasic: cBBasic,
    bulletSpread: cBSpread,
    bulletBeam: cBBeam,
    bulletPlasma: cBPlasma,
    explosionSmall,
    explosionLarge,
  };

  return atlasCache;
}

/* ========================================================================
   SPRITE DRAWING FUNCTIONS MATCHING REFERENCE IMAGES EXCLUSIVELY
   ======================================================================== */

// Player Back View (Young boy, spiked brown hair, red scarf, backpack, boots, blaster)
function drawPlayerBack(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  frame: number,
  state: 'RUN' | 'SHOOT' | 'JUMP',
  scale: number = 1
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Bobbing and leg offsets
  const legOffset = Math.sin(frame * (Math.PI / 4)) * 8;
  const bodyBob = Math.abs(Math.sin(frame * (Math.PI / 4))) * 4;
  const isJumping = state === 'JUMP';

  const yBase = isJumping ? -12 : -bodyBob;

  // 1. Shadow on ground
  if (!isJumping) {
    ctx.beginPath();
    ctx.ellipse(0, 14, 22, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fill();
  }

  // 2. Boots & Legs
  ctx.fillStyle = '#1c2238'; // Boot leather
  // Left Leg
  ctx.beginPath();
  ctx.roundRect(-18 + (isJumping ? -2 : -legOffset * 0.4), yBase - 6 + (isJumping ? -4 : legOffset), 12, 18, 4);
  ctx.fill();

  // Right Leg
  ctx.beginPath();
  ctx.roundRect(6 + (isJumping ? 2 : legOffset * 0.4), yBase - 6 + (isJumping ? -4 : -legOffset), 12, 18, 4);
  ctx.fill();

  // Glowing rocket boot soles
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#00f0ff';
  ctx.fillRect(-18 + (isJumping ? -2 : -legOffset * 0.4), yBase + 10 + (isJumping ? -4 : legOffset), 12, 4);
  ctx.fillRect(6 + (isJumping ? 2 : legOffset * 0.4), yBase + 10 + (isJumping ? -4 : -legOffset), 12, 4);
  ctx.shadowBlur = 0;

  // 3. Pants (Blue Jeans)
  ctx.fillStyle = '#2b5288';
  ctx.beginPath();
  ctx.roundRect(-16, yBase - 22, 32, 20, 6);
  ctx.fill();

  // Brown belt & pouch
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(-18, yBase - 22, 36, 5);
  ctx.fillStyle = '#b87333';
  ctx.fillRect(-12, yBase - 20, 6, 6);

  // 4. White Shirt / Vest
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.roundRect(-18, yBase - 42, 36, 22, 8);
  ctx.fill();

  // 5. Sci-Fi Backpack with Glowing Core
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.roundRect(-12, yBase - 40, 24, 18, 6);
  ctx.fill();
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Glowing blue backpack reactor
  ctx.beginPath();
  ctx.arc(0, yBase - 31, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#00d2ff';
  ctx.shadowColor = '#00d2ff';
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;

  // 6. Blaster Weapon (In Right Hand)
  ctx.save();
  ctx.translate(18, yBase - 32);
  ctx.fillStyle = '#475569';
  ctx.fillRect(0, -4, 16, 8);
  ctx.fillStyle = '#00f0ff';
  ctx.fillRect(10, -6, 8, 4);
  if (state === 'SHOOT') {
    // Muzzle flash
    ctx.fillStyle = '#ffaa00';
    ctx.shadowColor = '#ff5500';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(20, -4, 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 7. Spiked Brown Hair
  ctx.fillStyle = '#7c3aed'; // Highlight shadow under hair
  ctx.fillStyle = '#6d381e'; // Spiked brown hair base
  ctx.beginPath();
  ctx.arc(0, yBase - 48, 16, 0, Math.PI * 2);
  ctx.fill();

  // Hair spikes
  const hairSpikes = [
    { x: -14, y: -58, w: 10, h: 14 },
    { x: -6, y: -62, w: 12, h: 18 },
    { x: 4, y: -60, w: 12, h: 16 },
    { x: 12, y: -54, w: 10, h: 12 },
  ];
  ctx.fillStyle = '#8b4513';
  hairSpikes.forEach((s) => {
    ctx.beginPath();
    ctx.moveTo(s.x, s.y + s.h);
    ctx.lineTo(s.x + s.w / 2, s.y);
    ctx.lineTo(s.x + s.w, s.y + s.h);
    ctx.closePath();
    ctx.fill();
  });

  // 8. Red Fluttering Scarf / Bandana
  const scarfWiggle = Math.sin(frame * 0.8) * 6;
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(-8, yBase - 44);
  ctx.quadraticCurveTo(-22 + scarfWiggle, yBase - 40, -32 + scarfWiggle, yBase - 48);
  ctx.quadraticCurveTo(-20 + scarfWiggle, yBase - 34, -4, yBase - 40);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// Player Front View (Menu / Shop UI)
function drawPlayerFront(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.translate(cx, cy);

  // Boots
  ctx.fillStyle = '#1c2238';
  ctx.fillRect(-22, 10, 16, 12);
  ctx.fillRect(6, 10, 16, 12);
  ctx.fillStyle = '#00f0ff';
  ctx.fillRect(-22, 20, 16, 3);
  ctx.fillRect(6, 20, 16, 3);

  // Jeans
  ctx.fillStyle = '#2b5288';
  ctx.fillRect(-20, -18, 40, 30);

  // Belt
  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(-22, -18, 44, 5);

  // Vest & Shirt
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-20, -42, 40, 24);
  ctx.fillStyle = '#334155'; // Vest jacket
  ctx.fillRect(-22, -42, 10, 24);
  ctx.fillRect(12, -42, 10, 24);

  // Red Scarf around neck
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.ellipse(0, -42, 16, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head & Face
  ctx.fillStyle = '#fed7aa'; // Anime skin tone
  ctx.beginPath();
  ctx.arc(0, -56, 18, 0, Math.PI * 2);
  ctx.fill();

  // Anime Eyes
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(-6, -56, 3, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(6, -56, 3, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye highlights
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-7, -58, 1.5, 0, Math.PI * 2);
  ctx.arc(5, -58, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = '#9a3412';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -50, 6, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  // Spiked Brown Hair
  ctx.fillStyle = '#8b4513';
  ctx.beginPath();
  ctx.arc(0, -62, 20, Math.PI, Math.PI * 2);
  ctx.fill();
  // Bangs
  ctx.beginPath();
  ctx.moveTo(-16, -64);
  ctx.lineTo(-8, -54);
  ctx.lineTo(0, -64);
  ctx.lineTo(8, -54);
  ctx.lineTo(16, -64);
  ctx.closePath();
  ctx.fill();

  // Blaster in hand
  ctx.fillStyle = '#475569';
  ctx.fillRect(20, -35, 14, 8);
  ctx.fillStyle = '#00f0ff';
  ctx.fillRect(28, -37, 8, 4);

  ctx.restore();
}

// Shield Overlay Effect
function drawShieldOverlay(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number = 48) {
  ctx.save();
  ctx.translate(cx, cy);

  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 20;

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
  ctx.fill();
  ctx.stroke();

  // Hexagon grid pattern scaled to r
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
  ctx.lineWidth = 1.5;
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * (r * 0.45), Math.sin(a) * (r * 0.45));
    ctx.lineTo(Math.cos(a) * (r * 0.92), Math.sin(a) * (r * 0.92));
    ctx.stroke();
  }

  ctx.restore();
}

// 3D Volcanic Magma Asteroid (Matching reference image)
function drawAsteroid(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  varIdx: number
) {
  ctx.save();
  ctx.translate(cx, cy);

  // 1. Dark Shadow Underside Facet
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // 2. 3D Faceted Craggy Rock Silhouette
  const numPoints = 10 + (varIdx % 3);
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const noise = Math.sin(angle * 3 + varIdx * 1.5) * (r * 0.22) + Math.cos(angle * 2) * (r * 0.08);
    const rad = r + noise;
    points.push({ x: Math.cos(angle) * rad, y: Math.sin(angle) * rad });
  }

  // Draw main rocky faceted body
  const grad = ctx.createLinearGradient(-r * 0.5, -r, r * 0.5, r);
  grad.addColorStop(0, '#475569');
  grad.addColorStop(0.4, '#334155');
  grad.addColorStop(0.8, '#1e293b');
  grad.addColorStop(1, '#090d16');
  ctx.fillStyle = grad;
  ctx.strokeStyle = '#020617';
  ctx.lineWidth = 4;

  ctx.beginPath();
  points.forEach((p, idx) => {
    if (idx === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 3. Facet Shadow / Highlight Crevices (3D angular polygon facets)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  ctx.lineTo(points[Math.floor(numPoints / 3)].x * 0.2, points[Math.floor(numPoints / 3)].y * 0.2);
  ctx.lineTo(points[Math.floor(numPoints * 0.6)].x, points[Math.floor(numPoints * 0.6)].y);
  ctx.stroke();

  // 4. Glowing Volcanic Magma Fissures (Fiery veins cutting across the asteroid)
  ctx.strokeStyle = '#ff3700';
  ctx.shadowColor = '#ff2200';
  ctx.shadowBlur = 14;
  ctx.lineWidth = 5;

  ctx.beginPath();
  ctx.moveTo(-r * 0.55, -r * 0.15);
  ctx.lineTo(-r * 0.1, 0);
  ctx.lineTo(r * 0.45, -r * 0.35);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-r * 0.1, 0);
  ctx.lineTo(r * 0.2, r * 0.45);
  ctx.stroke();

  // Inner molten yellow core of magma
  ctx.strokeStyle = '#ffea00';
  ctx.shadowColor = '#ffaa00';
  ctx.shadowBlur = 6;
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.moveTo(-r * 0.5, -r * 0.15);
  ctx.lineTo(-r * 0.1, 0);
  ctx.lineTo(r * 0.4, -r * 0.35);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-r * 0.1, 0);
  ctx.lineTo(r * 0.18, r * 0.42);
  ctx.stroke();

  // 5. Molten Boiling Crater
  ctx.fillStyle = '#ff5500';
  ctx.shadowColor = '#ff3300';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(-r * 0.3, r * 0.3, r * 0.16, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fffb00';
  ctx.beginPath();
  ctx.arc(-r * 0.3, r * 0.3, r * 0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Enemy Drone
function drawDrone(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  eyeColor: string,
  frame: number
) {
  ctx.save();
  ctx.translate(cx, cy);

  // Wings
  const wingHover = Math.sin(frame * (Math.PI / 2)) * 3;
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;

  // Left wing
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(-32, -10 + wingHover);
  ctx.lineTo(-24, 12 + wingHover);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right wing
  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(32, -10 + wingHover);
  ctx.lineTo(24, 12 + wingHover);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Center Sphere Body
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Glowing Red/Blue Eye Core
  ctx.fillStyle = eyeColor;
  ctx.shadowColor = eyeColor;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(0, 0, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-2, -2, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Boss Ship
function drawBossShip(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.translate(cx, cy);

  // Main hull
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(0, -50);
  ctx.lineTo(60, 20);
  ctx.lineTo(40, 50);
  ctx.lineTo(0, 35);
  ctx.lineTo(-40, 50);
  ctx.lineTo(-60, 20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Glowing Red Boss Eye
  ctx.fillStyle = '#ff0055';
  ctx.shadowColor = '#ff0055';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.arc(0, -10, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-5, -15, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Laser Pillar
function drawLaserPillar(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = '#334155';
  ctx.fillRect(-12, -40, 24, 80);

  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 8;
  ctx.fillRect(-8, -35, 16, 12);
  ctx.fillRect(-8, 23, 16, 12);

  ctx.restore();
}

// Laser Beam
function drawLaserBeam(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = '#ff0044';
  ctx.shadowColor = '#ff0044';
  ctx.shadowBlur = 15;
  ctx.fillRect(-55, -6, 110, 12);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-55, -2, 110, 4);

  ctx.restore();
}

// Spiked Mine
function drawSpikedMine(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.fill();

  // Spikes
  ctx.fillStyle = '#ff4500';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a - 0.2) * 20, Math.sin(a - 0.2) * 20);
    ctx.lineTo(Math.cos(a) * 36, Math.sin(a) * 36);
    ctx.lineTo(Math.cos(a + 0.2) * 20, Math.sin(a + 0.2) * 20);
    ctx.closePath();
    ctx.fill();
  }

  // Core
  ctx.fillStyle = '#ffaa00';
  ctx.shadowColor = '#ff5500';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Rotating Blade
function drawRotatingBlade(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = '#00d2ff';
  ctx.shadowColor = '#00d2ff';
  ctx.shadowBlur = 10;

  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a - 0.3) * 32, Math.sin(a - 0.3) * 32);
    ctx.lineTo(Math.cos(a) * 38, Math.sin(a) * 38);
    ctx.lineTo(Math.cos(a + 0.3) * 15, Math.sin(a + 0.3) * 15);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

// Crate
function drawCrate(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = '#8b5a2b';
  ctx.fillRect(-24, -24, 48, 48);

  ctx.strokeStyle = '#b87333';
  ctx.lineWidth = 4;
  ctx.strokeRect(-22, -22, 44, 44);

  ctx.strokeStyle = '#5c3a1e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-22, -22);
  ctx.lineTo(22, 22);
  ctx.moveTo(22, -22);
  ctx.lineTo(-22, 22);
  ctx.stroke();

  ctx.restore();
}

// Gold Coin
function drawCoin(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  frame: number
) {
  ctx.save();
  ctx.translate(cx, cy);

  const scaleX = Math.cos(frame * (Math.PI / 3));

  ctx.scale(scaleX, 1);

  ctx.fillStyle = '#ffcc00';
  ctx.shadowColor = '#ffaa00';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // Inner ring
  ctx.strokeStyle = '#e69d00';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2);
  ctx.stroke();

  // Star symbol
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', 0, 1);

  ctx.restore();
}

// Gem
function drawGem(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string) {
  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;

  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(16, -6);
  ctx.lineTo(0, 18);
  ctx.lineTo(-16, -6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(8, -6);
  ctx.lineTo(0, 18);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// Powerup Icon
function drawPowerUpIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  type: string
) {
  ctx.save();
  ctx.translate(cx, cy);

  let bg = '#10b981';
  let symbol = '🛡️';

  if (type === 'SUPER_JUMP') {
    bg = '#3b82f6';
    symbol = '⬆️';
  } else if (type === 'MULTI_SHOT') {
    bg = '#f59e0b';
    symbol = '🚀';
  } else if (type === 'MAGNET') {
    bg = '#ef4444';
    symbol = '🧲';
  }

  // Glowing rounded badge
  ctx.fillStyle = bg;
  ctx.shadowColor = bg;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.roundRect(-22, -22, 44, 44, 12);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol, 0, 2);

  ctx.restore();
}

// Bullet
function drawBullet(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  color: string,
  _type: string
) {
  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;

  ctx.beginPath();
  ctx.ellipse(0, 0, 6, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, -3, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Rock Wall Pillar (Paredes / Obstáculos Grandes)
function drawRockWall(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = '#334155';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.roundRect(-36, -50, 72, 100, 8);
  ctx.fill();
  ctx.stroke();

  // Magma cracks
  ctx.strokeStyle = '#ff4500';
  ctx.shadowColor = '#ff2200';
  ctx.shadowBlur = 10;
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(-20, -35);
  ctx.lineTo(0, -10);
  ctx.lineTo(-10, 20);
  ctx.lineTo(15, 40);
  ctx.stroke();

  ctx.restore();
}

// Glowing Core Cube (Obstáculos Especiales)
function drawGlowingCube(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#ff5500';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#ff5500';
  ctx.shadowBlur = 12;

  ctx.beginPath();
  ctx.roundRect(-28, -28, 56, 56, 10);
  ctx.fill();
  ctx.stroke();

  // Core magma emblem
  ctx.fillStyle = '#ffaa00';
  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Gold Bar / Ingot (Coleccionable)
function drawGoldBar(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.translate(cx, cy);

  ctx.fillStyle = '#f59e0b';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 10;

  ctx.beginPath();
  ctx.moveTo(-16, -10);
  ctx.lineTo(16, -10);
  ctx.lineTo(20, 10);
  ctx.lineTo(-20, 10);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.moveTo(-14, -8);
  ctx.lineTo(14, -8);
  ctx.lineTo(10, 0);
  ctx.lineTo(-10, 0);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// Explosion Frame
function drawExplosionFrame(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  maxR: number,
  frame: number,
  large: boolean
) {
  ctx.save();
  ctx.translate(cx, cy);

  const progress = frame / 7;
  const radius = maxR * Math.sin(progress * Math.PI);
  const alpha = 1 - progress;

  // Outer blast ring
  ctx.fillStyle = large ? `rgba(0, 200, 255, ${alpha})` : `rgba(255, 120, 0, ${alpha})`;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();

  // Core flash
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
