'use client';

import type { TestResult } from '@/lib/types';

interface Props {
  results: TestResult[];
}

export default function TestResults({ results }: Props) {
  if (results.length === 0) return null;

  const passed = results.filter((r) => r.passed).length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-display font-semibold text-sm">Test Results</span>
        <span className={`font-mono text-sm font-bold ${passed === results.length ? 'text-green' : 'text-amber'}`}>
          {passed}/{results.length} passed
        </span>
      </div>
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {results.map((r, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 text-xs p-2.5 rounded-lg border ${
              r.passed
                ? 'bg-green/5 border-green/20 text-green'
                : 'bg-red/5 border-red/20 text-red'
            }`}
          >
            <span className="mt-0.5 shrink-0">{r.passed ? '✓' : '✗'}</span>
            <div className="min-w-0 font-mono">
              <div className="text-mid">Input: {JSON.stringify(r.input)}</div>
              <div>Expected: {JSON.stringify(r.expected)}</div>
              {r.error ? (
                <div className="text-red">Error: {r.error}</div>
              ) : (
                <div>Got: {JSON.stringify(r.output)}</div>
              )}
              {r.time !== undefined && <div className="text-dim">{r.time}ms</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
