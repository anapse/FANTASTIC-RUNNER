import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../game/engine';

interface Props {
  engine: GameEngine | null;
}

export const GameCanvas: React.FC<Props> = ({ engine }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Swipe Gesture Tracking
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    if (!engine || !canvasRef.current) return;
    engine.canvas = canvasRef.current;
    engine.ctx = canvasRef.current.getContext('2d')!;
  }, [engine]);

  // Handle Keyboard Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!engine || engine.isGameOver) return;

      const key = e.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') {
        engine.moveLeft();
      } else if (key === 'arrowright' || key === 'd') {
        engine.moveRight();
      } else if (key === 'arrowup' || key === 'w') {
        engine.jump();
      } else if (key === ' ' || key === 'f' || key === 'j') {
        engine.shoot();
      } else if (key === 'shift' || key === 'e' || key === 'k') {
        engine.dash();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engine]);

  // Handle Touch Swipes & Taps
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!engine || engine.isGameOver) return;
    const t = e.touches[0];
    touchStartRef.current = {
      x: t.clientX,
      y: t.clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!engine || !touchStartRef.current || engine.isGameOver) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // Minimum distance threshold for a swipe
    if (absX > 30 || absY > 30) {
      if (dy < -30 && absX < 40) {
        // Vertical Swipe Up = Jump
        engine.jump();
      } else if (dy < -30 && dx < -30) {
        // Diagonal Up-Left = Diagonal Jump Left
        engine.jump('LEFT');
      } else if (dy < -30 && dx > 30) {
        // Diagonal Up-Right = Diagonal Jump Right
        engine.jump('RIGHT');
      } else if (dx < -30) {
        // Swipe Left = Move Left
        engine.moveLeft();
      } else if (dx > 30) {
        // Swipe Right = Move Right
        engine.moveRight();
      }
    } else if (dt < 250) {
      // Short Tap = Shoot!
      engine.shoot();
    }

    touchStartRef.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!engine || engine.isGameOver) return;
    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!engine || !touchStartRef.current || engine.isGameOver) return;
    const dx = e.clientX - touchStartRef.current.x;
    const dy = e.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX > 30 || absY > 30) {
      if (dy < -30 && absX < 40) engine.jump();
      else if (dy < -30 && dx < -30) engine.jump('LEFT');
      else if (dy < -30 && dx > 30) engine.jump('RIGHT');
      else if (dx < -30) engine.moveLeft();
      else if (dx > 30) engine.moveRight();
    } else if (dt < 300) {
      engine.shoot();
    }

    touchStartRef.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      width={450}
      height={800}
      className="w-full h-full object-contain cursor-crosshair touch-none select-none block"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    />
  );
};
