import React, { useState, useEffect, useRef } from 'react';
import { ViewportContainer } from './components/ViewportContainer';
import { GameCanvas } from './components/GameCanvas';
import { HUDOverlay } from './components/HUDOverlay';
import { MainMenu } from './components/MainMenu';
import { ShopModal } from './components/ShopModal';
import { CharacterModal } from './components/CharacterModal';
import { PowerupsModal } from './components/PowerupsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { RankingModal } from './components/RankingModal';
import { SettingsModal } from './components/SettingsModal';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { ComoJugarModal } from './components/ComoJugarModal';
import { RecordLocalModal } from './components/RecordLocalModal';
import { ContactanosModal } from './components/ContactanosModal';

import { GameEngine } from './game/engine';
import { GameMode, PlayerStats } from './game/types';
import { loadPlayerStats, savePlayerStats, addLeaderboardScore } from './game/storage';
import { sound } from './game/audio';

export default function App() {
  const [stats, setStats] = useState<PlayerStats>(() => loadPlayerStats());
  const [gameMode, setGameMode] = useState<GameMode>('MENU');
  const [, setRenderTrigger] = useState(0);

  const engineRef = useRef<GameEngine | null>(null);

  // Initialize Sound Settings
  useEffect(() => {
    sound.setSettings(stats.settings.soundFx, stats.settings.music, stats.settings.volume);
  }, [stats.settings]);

  // Handle Game Over / Save Progress
  const handleGameOver = () => {
    if (!engineRef.current) return;
    const eng = engineRef.current;

    const newCoins = stats.coins + eng.coinsCollected;
    const newDistance = stats.totalDistance + eng.distance;
    const newKills = stats.totalKills + eng.killsCount;
    const newHighScore = Math.max(stats.highScore, eng.score);

    const updatedStats: PlayerStats = {
      ...stats,
      coins: newCoins,
      totalDistance: newDistance,
      totalKills: newKills,
      highScore: newHighScore,
    };

    setStats(updatedStats);
    savePlayerStats(updatedStats);

    // Add to leaderboard
    addLeaderboardScore({
      playerName: stats.selectedCharacter === 'HERO_LEO' ? 'Leo Runner' : 'Aventurero',
      score: eng.score,
      distance: Math.floor(eng.distance),
      coins: eng.coinsCollected,
    });

    setGameMode('GAMEOVER');
  };

  // UI Force Re-render Callback from Engine
  const handleUIUpdate = () => {
    setRenderTrigger((prev) => (prev + 1) % 1000);
    if (engineRef.current?.isGameOver && gameMode === 'PLAYING') {
      handleGameOver();
    }
  };

  const handleStartGame = () => {
    if (!engineRef.current) {
      const dummyCanvas = document.createElement('canvas');
      dummyCanvas.width = 450;
      dummyCanvas.height = 800;
      engineRef.current = new GameEngine(dummyCanvas, stats, handleUIUpdate);
    } else {
      engineRef.current.reset(stats);
    }

    setGameMode('PLAYING');
    engineRef.current.start();
  };

  const handlePause = () => {
    if (engineRef.current) {
      engineRef.current.stop();
    }
    setGameMode('PAUSED');
  };

  const handleResume = () => {
    if (engineRef.current) {
      engineRef.current.start();
    }
    setGameMode('PLAYING');
  };

  const handleRestart = () => {
    handleStartGame();
  };

  const handleExitToMenu = () => {
    if (engineRef.current) {
      engineRef.current.stop();
    }
    setGameMode('MENU');
  };

  const handleUpdateStats = (newStats: PlayerStats) => {
    setStats(newStats);
    savePlayerStats(newStats);
    sound.setSettings(newStats.settings.soundFx, newStats.settings.music, newStats.settings.volume);
  };

  const handleToggleSound = () => {
    const isMuted = !stats.settings.soundFx && !stats.settings.music;
    const newStats: PlayerStats = {
      ...stats,
      settings: {
        ...stats.settings,
        soundFx: isMuted,
        music: isMuted,
      },
    };
    handleUpdateStats(newStats);
  };

  return (
    <ViewportContainer>
      {/* 3D Depth Canvas Layer */}
      <GameCanvas engine={engineRef.current} />

      {/* In-Game HUD Layer */}
      {gameMode === 'PLAYING' && engineRef.current && (
        <HUDOverlay engine={engineRef.current} onPause={handlePause} />
      )}

      {/* Main Menu Layer */}
      {gameMode === 'MENU' && (
        <MainMenu
          stats={stats}
          onNavigate={(mode) => setGameMode(mode)}
          onStartGame={handleStartGame}
          onToggleSound={handleToggleSound}
          onOpenContact={() => setGameMode('CONTACT')}
          onOpenHowToPlay={() => setGameMode('HOW_TO_PLAY')}
          onOpenRecord={() => setGameMode('RECORD_LOCAL')}
        />
      )}

      {/* Menu Modals */}
      {gameMode === 'CONTACT' && (
        <ContactanosModal onClose={() => setGameMode('MENU')} />
      )}

      {gameMode === 'HOW_TO_PLAY' && (
        <ComoJugarModal onClose={() => setGameMode('MENU')} />
      )}

      {gameMode === 'RECORD_LOCAL' && (
        <RecordLocalModal stats={stats} onClose={() => setGameMode('MENU')} />
      )}

      {gameMode === 'RANKING' && (
        <RankingModal onClose={() => setGameMode('MENU')} />
      )}

      {gameMode === 'SHOP' && (
        <ShopModal
          stats={stats}
          onUpdateStats={handleUpdateStats}
          onClose={() => setGameMode('MENU')}
        />
      )}

      {gameMode === 'CHARACTER' && (
        <CharacterModal
          stats={stats}
          onUpdateStats={handleUpdateStats}
          onClose={() => setGameMode('MENU')}
        />
      )}

      {gameMode === 'POWERUPS' && (
        <PowerupsModal
          stats={stats}
          onUpdateStats={handleUpdateStats}
          onClose={() => setGameMode('MENU')}
        />
      )}

      {gameMode === 'ACHIEVEMENTS' && (
        <AchievementsModal
          stats={stats}
          onUpdateStats={handleUpdateStats}
          onClose={() => setGameMode('MENU')}
        />
      )}

      {gameMode === 'SETTINGS' && (
        <SettingsModal
          stats={stats}
          onUpdateStats={handleUpdateStats}
          onClose={() => setGameMode('MENU')}
        />
      )}

      {gameMode === 'PAUSED' && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleRestart}
          onOpenSettings={() => setGameMode('SETTINGS')}
          onExitToMenu={handleExitToMenu}
        />
      )}

      {gameMode === 'GAMEOVER' && engineRef.current && (
        <GameOverModal
          engine={engineRef.current}
          onRestart={handleRestart}
          onExitToMenu={handleExitToMenu}
        />
      )}
    </ViewportContainer>
  );
}
