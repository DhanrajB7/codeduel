export interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  starterCode: string;
  functionName: string;
  testCases: { input: unknown[]; expected: unknown }[];
}

export interface Room {
  id: string;
  code: string;
  problem_id: number;
  status: 'waiting' | 'countdown' | 'playing' | 'finished';
  player1_id: string;
  player1_name: string;
  player2_id: string | null;
  player2_name: string | null;
  player1_code: string | null;
  player2_code: string | null;
  player1_tests_passed: number;
  player2_tests_passed: number;
  player1_total_tests: number;
  player2_total_tests: number;
  player1_submitted: boolean;
  player2_submitted: boolean;
  player1_submit_time: string | null;
  player2_submit_time: string | null;
  winner: string | null;
  time_limit: number;
  started_at: string | null;
  created_at: string;
}

export interface TestResult {
  passed: boolean;
  input: unknown[];
  expected: unknown;
  output?: unknown;
  error?: string;
  time?: number;
}
