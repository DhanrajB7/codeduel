'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { problems } from '@/lib/problems';
import { executeCode } from '@/lib/execute';
import TestResults from '@/components/TestResults';
import type { Problem, TestResult } from '@/lib/types';

const CodeEditor = dynamic(() => import('@/components/CodeEditor'), { ssr: false });

export default function PracticePage() {
  const [selectedProblem, setSelectedProblem] = useState<Problem>(problems[0]);
  const [code, setCode] = useState(problems[0].starterCode);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showList, setShowList] = useState(true);

  function selectProblem(p: Problem) {
    setSelectedProblem(p);
    setCode(p.starterCode);
    setTestResults([]);
    setShowList(false);
  }

  function handleRun() {
    const results = executeCode(code, selectedProblem.testCases);
    setTestResults(results);
  }

  const passed = testResults.filter((r) => r.passed).length;
  const allPassed = testResults.length > 0 && passed === testResults.length;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="h-14 border-b border-line flex items-center justify-between px-4 shrink-0 bg-dark-2">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-display font-bold">
            Code<span className="text-teal">Duel</span>
          </Link>
          <span className="text-dim text-sm">Solo Practice</span>
        </div>
        <button
          onClick={() => setShowList(!showList)}
          className="text-sm text-mid hover:text-teal transition-colors flex items-center gap-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          Problems
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Problem list sidebar */}
        {showList && (
          <div className="w-[280px] shrink-0 border-r border-line overflow-y-auto bg-panel p-4">
            <h3 className="font-display font-semibold text-sm mb-3 text-dim">Select a Problem</h3>
            <div className="space-y-1.5">
              {problems.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectProblem(p)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    selectedProblem.id === p.id
                      ? 'bg-teal/10 border border-teal/30 text-teal'
                      : 'hover:bg-dark-3 text-mid border border-transparent'
                  }`}
                >
                  <div className="font-medium">{p.title}</div>
                  <span className={`text-xs font-mono ${
                    p.difficulty === 'Easy' ? 'text-green' :
                    p.difficulty === 'Medium' ? 'text-amber' : 'text-red'
                  }`}>
                    {p.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Problem description */}
        <div className="w-[360px] shrink-0 border-r border-line overflow-y-auto p-5 bg-panel">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
              selectedProblem.difficulty === 'Easy' ? 'text-green border-green/30' :
              selectedProblem.difficulty === 'Medium' ? 'text-amber border-amber/30' : 'text-red border-red/30'
            }`}>
              {selectedProblem.difficulty}
            </span>
          </div>
          <h2 className="font-display text-xl font-bold mb-4">{selectedProblem.title}</h2>
          <p className="text-mid text-sm leading-relaxed mb-6 whitespace-pre-wrap">{selectedProblem.description}</p>

          <div className="space-y-4 mb-6">
            {selectedProblem.examples.map((ex, i) => (
              <div key={i} className="bg-dark-3 border border-line rounded-lg p-3 text-xs font-mono">
                <div className="text-dim mb-1">Example {i + 1}:</div>
                <div className="text-mid">Input: {ex.input}</div>
                <div className="text-teal">Output: {ex.output}</div>
                {ex.explanation && <div className="text-dim mt-1">{ex.explanation}</div>}
              </div>
            ))}
          </div>

          <TestResults results={testResults} />
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <CodeEditor value={code} onChange={setCode} />
          </div>
          <div className="h-14 border-t border-line flex items-center justify-between px-4 bg-dark-2 shrink-0">
            <div>
              {allPassed && (
                <span className="text-green text-sm font-mono flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                  All tests passed!
                </span>
              )}
            </div>
            <button
              onClick={handleRun}
              className="flex items-center gap-2 bg-teal text-dark px-5 py-2 rounded-lg text-sm font-semibold hover:shadow-[0_0_20px_var(--color-glow)] transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Run Tests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
