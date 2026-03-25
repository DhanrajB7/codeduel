'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import { getProblemById } from '@/lib/problems';
import { executeCode } from '@/lib/execute';
import Timer from '@/components/Timer';
import TestResults from '@/components/TestResults';
import type { Room, TestResult } from '@/lib/types';

const CodeEditor = dynamic(() => import('@/components/CodeEditor'), { ssr: false });

interface Props {
  params: Promise<{ code: string }>;
}

export default function RoomPage({ params }: Props) {
  const { code: roomCode } = use(params);
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [playerName, setPlayerName] = useState('');

  // Load player info from localStorage
  useEffect(() => {
    setPlayerId(localStorage.getItem('playerId') || '');
    setPlayerName(localStorage.getItem('playerName') || '');
  }, []);

  // Fetch room and subscribe to changes
  useEffect(() => {
    async function fetchRoom() {
      const { data, error: fetchError } = await supabase
        .from('codeduel_rooms')
        .select('*')
        .eq('code', roomCode)
        .single();

      if (fetchError || !data) {
        setError('Room not found');
        return;
      }

      setRoom(data as Room);
      const problem = getProblemById(data.problem_id);
      if (problem && !code) setCode(problem.starterCode);
    }

    fetchRoom();

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`room:${roomCode}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'codeduel_rooms', filter: `code=eq.${roomCode}` },
        (payload) => {
          setRoom(payload.new as Room);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [roomCode, code]);

  // Countdown logic
  useEffect(() => {
    if (!room || room.status !== 'countdown' || !room.started_at) return;

    const interval = setInterval(() => {
      const diff = Math.ceil((new Date(room.started_at!).getTime() - Date.now()) / 1000);
      if (diff <= 0) {
        setCountdown(null);
        clearInterval(interval);
      } else {
        setCountdown(diff);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [room]);

  // Auto-transition from countdown to playing
  useEffect(() => {
    if (!room || room.status !== 'countdown') return;
    if (countdown !== null && countdown <= 0) {
      // Update status to playing
      supabase
        .from('codeduel_rooms')
        .update({ status: 'playing' })
        .eq('code', roomCode)
        .then();
    }
  }, [countdown, room, roomCode]);

  // Redirect on finish
  useEffect(() => {
    if (room?.status === 'finished') {
      // Stay on page to show results
    }
  }, [room]);

  const problem = room ? getProblemById(room.problem_id) : null;
  const isPlayer1 = playerId === room?.player1_id;
  const myName = isPlayer1 ? room?.player1_name : room?.player2_name;
  const opponentName = isPlayer1 ? room?.player2_name : room?.player1_name;
  const opponentSubmitted = isPlayer1 ? room?.player2_submitted : room?.player1_submitted;
  const opponentTestsPassed = isPlayer1 ? room?.player2_tests_passed : room?.player1_tests_passed;
  const opponentTotalTests = isPlayer1 ? room?.player2_total_tests : room?.player1_total_tests;
  const myTestsPassed = isPlayer1 ? room?.player1_tests_passed : room?.player2_tests_passed;

  function handleRun() {
    if (!problem) return;
    const results = executeCode(code, problem.testCases);
    setTestResults(results);
  }

  const handleTimeUp = useCallback(async () => {
    if (submitted || !problem) return;
    const results = executeCode(code, problem.testCases);
    const passed = results.filter((r) => r.passed).length;
    setTestResults(results);
    setSubmitted(true);
    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomCode,
        playerId,
        code,
        testsPassed: passed,
        totalTests: problem.testCases.length,
      }),
    });
  }, [submitted, problem, code, roomCode, playerId]);

  async function handleSubmit() {
    if (!problem || submitted) return;
    const results = executeCode(code, problem.testCases);
    const passed = results.filter((r) => r.passed).length;
    setTestResults(results);
    setSubmitted(true);

    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomCode,
        playerId,
        code,
        testsPassed: passed,
        totalTests: problem.testCases.length,
      }),
    });

    const data = await res.json();
    if (data.finished) {
      // Room will update via subscription
    }
  }

  function copyRoomCode() {
    navigator.clipboard.writeText(roomCode);
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red text-lg mb-4">{error}</p>
          <button onClick={() => router.push('/')} className="text-teal hover:underline">Go Home</button>
        </div>
      </div>
    );
  }

  if (!room || !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-mono text-mid animate-pulse">Loading room...</div>
      </div>
    );
  }

  // Waiting for opponent
  if (room.status === 'waiting') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h2 className="font-display text-2xl font-bold mb-2">Waiting for opponent...</h2>
          <p className="text-mid mb-8">Share this code with your friend:</p>
          <button
            onClick={copyRoomCode}
            className="inline-flex items-center gap-3 bg-dark-3 border-2 border-dashed border-teal/40 rounded-2xl px-8 py-6 hover:border-teal transition-colors group"
          >
            <span className="font-mono text-4xl font-bold tracking-[0.3em] text-teal">{roomCode}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dim group-hover:text-teal transition-colors">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
          </button>
          <p className="text-dim text-sm mt-4">Click to copy</p>
          <div className="mt-8 flex items-center justify-center gap-2 text-mid">
            <div className="w-2 h-2 bg-teal rounded-full animate-pulse" />
            <span className="text-sm">You: {myName}</span>
          </div>
        </div>
      </div>
    );
  }

  // Countdown
  if (room.status === 'countdown' && countdown !== null && countdown > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-mid text-lg mb-4">{myName} vs {opponentName}</p>
          <div className="font-display text-8xl font-bold text-teal animate-countdown" key={countdown}>
            {countdown}
          </div>
          <p className="text-dim mt-4">Get ready...</p>
        </div>
      </div>
    );
  }

  // Finished
  if (room.status === 'finished') {
    const iWon = room.winner === (isPlayer1 ? 'player1' : 'player2');
    const isTie = room.winner === 'tie';

    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <div className="text-6xl mb-4">{isTie ? '🤝' : iWon ? '🏆' : '😢'}</div>
          <h1 className="font-display text-4xl font-bold mb-2">
            {isTie ? "It's a Tie!" : iWon ? 'You Won!' : 'You Lost'}
          </h1>
          <p className="text-mid mb-8">
            {problem.title} — {problem.difficulty}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className={`bg-panel border rounded-xl p-4 ${iWon && !isTie ? 'border-teal' : 'border-line'}`}>
              <div className="text-sm text-dim mb-1">{myName} (You)</div>
              <div className="font-display text-2xl font-bold text-teal">
                {myTestsPassed}/{problem.testCases.length}
              </div>
              <div className="text-xs text-dim">tests passed</div>
            </div>
            <div className={`bg-panel border rounded-xl p-4 ${!iWon && !isTie ? 'border-purple' : 'border-line'}`}>
              <div className="text-sm text-dim mb-1">{opponentName}</div>
              <div className="font-display text-2xl font-bold text-purple">
                {opponentTestsPassed}/{opponentTotalTests}
              </div>
              <div className="text-xs text-dim">tests passed</div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/')}
              className="bg-teal text-dark px-6 py-3 rounded-xl font-display font-semibold text-sm hover:shadow-[0_0_20px_var(--color-glow)] transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Playing
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="h-14 border-b border-line flex items-center justify-between px-4 shrink-0 bg-dark-2">
        <div className="flex items-center gap-4">
          <span className="font-display font-bold">
            Code<span className="text-teal">Duel</span>
          </span>
          <span className="text-dim text-xs font-mono">Room: {roomCode}</span>
        </div>

        {room.started_at && (
          <Timer startedAt={room.started_at} timeLimit={room.time_limit} onTimeUp={handleTimeUp} />
        )}

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-teal rounded-full" />
            <span className="text-mid">{myName}</span>
          </div>
          <span className="text-dim">vs</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${opponentSubmitted ? 'bg-green' : 'bg-purple animate-pulse'}`} />
            <span className="text-mid">
              {opponentName}
              {opponentSubmitted && <span className="text-green ml-1 text-xs">(submitted)</span>}
            </span>
          </div>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Problem */}
        <div className="w-[380px] shrink-0 border-r border-line overflow-y-auto p-5 bg-panel">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
              problem.difficulty === 'Easy' ? 'text-green border-green/30' :
              problem.difficulty === 'Medium' ? 'text-amber border-amber/30' : 'text-red border-red/30'
            }`}>
              {problem.difficulty}
            </span>
          </div>
          <h2 className="font-display text-xl font-bold mb-4">{problem.title}</h2>
          <p className="text-mid text-sm leading-relaxed mb-6 whitespace-pre-wrap">{problem.description}</p>

          <div className="space-y-4 mb-6">
            {problem.examples.map((ex, i) => (
              <div key={i} className="bg-dark-3 border border-line rounded-lg p-3 text-xs font-mono">
                <div className="text-dim mb-1">Example {i + 1}:</div>
                <div className="text-mid">Input: {ex.input}</div>
                <div className="text-teal">Output: {ex.output}</div>
                {ex.explanation && <div className="text-dim mt-1">{ex.explanation}</div>}
              </div>
            ))}
          </div>

          {/* Test results */}
          <TestResults results={testResults} />
        </div>

        {/* Right: Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <CodeEditor value={code} onChange={setCode} readOnly={submitted} />
          </div>

          {/* Bottom bar */}
          <div className="h-14 border-t border-line flex items-center justify-between px-4 bg-dark-2 shrink-0">
            <div className="flex items-center gap-2">
              {submitted && (
                <span className="text-green text-sm font-mono flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                  Submitted
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRun}
                disabled={submitted}
                className="flex items-center gap-2 bg-dark-3 border border-line text-mid px-4 py-2 rounded-lg text-sm font-medium hover:border-teal hover:text-teal transition-colors disabled:opacity-40"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                Run Tests
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitted}
                className="flex items-center gap-2 bg-teal text-dark px-5 py-2 rounded-lg text-sm font-semibold hover:shadow-[0_0_20px_var(--color-glow)] transition-all disabled:opacity-40"
              >
                Submit Solution
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
