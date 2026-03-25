'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [joinCode, setJoinCode] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'home' | 'create' | 'join'>('home');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleCreate() {
    if (!name.trim()) { setError('Enter your name'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', playerName: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('playerId', data.playerId);
      localStorage.setItem('playerName', name.trim());
      router.push(`/room/${data.room.code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create room');
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (!name.trim()) { setError('Enter your name'); return; }
    if (!joinCode.trim()) { setError('Enter a room code'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join', playerName: name.trim(), code: joinCode.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('playerId', data.playerId);
      localStorage.setItem('playerName', name.trim());
      router.push(`/room/${joinCode.trim().toUpperCase()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join room');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-line px-6 h-16 flex items-center justify-between">
        <span className="font-display text-xl font-bold">
          Code<span className="text-teal">Duel</span>
        </span>
        <Link href="https://github.com/DhanrajB7" target="_blank" className="text-dim text-sm hover:text-teal transition-colors">
          by Dhanraj Bhalala
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="relative w-full max-w-lg">
          {/* Background glow */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-teal rounded-full opacity-[0.04] blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-purple rounded-full opacity-[0.04] blur-[100px] pointer-events-none" />

          <div className="relative text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="text-5xl sm:text-6xl font-mono font-bold text-teal">{`{`}</span>
              <span className="text-5xl sm:text-6xl font-mono font-bold text-purple">{`}`}</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Code<span className="text-teal">Duel</span>
            </h1>
            <p className="text-mid text-base sm:text-lg max-w-md mx-auto">
              Challenge a friend to a head-to-head coding battle. Same problem, live timer, side-by-side editors. May the best coder win.
            </p>
          </div>

          {mode === 'home' && (
            <div className="space-y-3">
              <button
                onClick={() => setMode('create')}
                className="w-full bg-teal text-dark py-4 rounded-xl font-display font-semibold text-base hover:shadow-[0_0_30px_var(--color-glow)] transition-all"
              >
                Create a Room
              </button>
              <button
                onClick={() => setMode('join')}
                className="w-full border border-line py-4 rounded-xl font-display font-semibold text-base text-mid hover:border-teal hover:text-teal transition-all"
              >
                Join a Room
              </button>
              <Link
                href="/practice"
                className="block w-full border border-line py-4 rounded-xl font-display font-semibold text-base text-dim text-center hover:border-line-2 hover:text-mid transition-all"
              >
                Solo Practice
              </Link>
            </div>
          )}

          {(mode === 'create' || mode === 'join') && (
            <div className="bg-panel border border-line rounded-2xl p-6 space-y-4">
              <button
                onClick={() => { setMode('home'); setError(''); }}
                className="text-dim text-sm hover:text-light transition-colors flex items-center gap-1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back
              </button>

              <h2 className="font-display text-xl font-semibold">
                {mode === 'create' ? 'Create a Room' : 'Join a Room'}
              </h2>

              <div>
                <label className="block text-sm text-mid mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={20}
                  className="w-full bg-dark-3 border border-line rounded-xl px-4 py-3 text-sm text-light placeholder:text-dim focus:outline-none focus:border-teal transition-colors"
                />
              </div>

              {mode === 'join' && (
                <div>
                  <label className="block text-sm text-mid mb-1.5">Room Code</label>
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="e.g. ABCDEF"
                    maxLength={6}
                    className="w-full bg-dark-3 border border-line rounded-xl px-4 py-3 text-sm text-light placeholder:text-dim focus:outline-none focus:border-teal transition-colors font-mono tracking-widest text-center text-lg"
                  />
                </div>
              )}

              {error && (
                <p className="text-red text-sm bg-red/10 border border-red/20 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                onClick={mode === 'create' ? handleCreate : handleJoin}
                disabled={loading}
                className="w-full bg-teal text-dark py-3.5 rounded-xl font-display font-semibold text-sm hover:shadow-[0_0_20px_var(--color-glow)] transition-all disabled:opacity-50"
              >
                {loading ? 'Loading...' : mode === 'create' ? 'Create & Get Code' : 'Join Battle'}
              </button>
            </div>
          )}

          {/* Features */}
          <div className="mt-16 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: '⚡', label: 'Real-time', desc: 'Live opponent status' },
              { icon: '⏱', label: '5 min timer', desc: 'Race against the clock' },
              { icon: '🏆', label: 'Win/Lose', desc: 'First to solve wins' },
            ].map((f, i) => (
              <div key={i} className="py-4">
                <div className="text-2xl mb-2">{f.icon}</div>
                <div className="font-display font-semibold text-sm">{f.label}</div>
                <div className="text-dim text-xs mt-0.5">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-line py-4 px-6 text-center text-dim text-sm">
        &copy; {new Date().getFullYear()} CodeDuel &middot; Built by Dhanraj Bhalala
      </footer>
    </div>
  );
}
