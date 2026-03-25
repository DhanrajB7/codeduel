'use client';

import { useState, useEffect } from 'react';

interface Props {
  startedAt: string;
  timeLimit: number;
  onTimeUp: () => void;
}

export default function Timer({ startedAt, timeLimit, onTimeUp }: Props) {
  const [remaining, setRemaining] = useState(timeLimit);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
      const left = Math.max(0, timeLimit - elapsed);
      setRemaining(left);
      if (left <= 0) {
        clearInterval(interval);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, timeLimit, onTimeUp]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const isLow = remaining <= 30;
  const isCritical = remaining <= 10;

  return (
    <div
      className={`font-mono text-2xl font-bold tabular-nums ${
        isCritical ? 'text-red animate-pulse' : isLow ? 'text-amber' : 'text-teal'
      }`}
    >
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}
