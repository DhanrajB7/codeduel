import type { TestResult } from './types';

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    // For group anagrams: sort inner arrays and outer array for comparison
    const sortedA = [...a].map((item) =>
      Array.isArray(item) ? [...item].sort() : item
    );
    const sortedB = [...b].map((item) =>
      Array.isArray(item) ? [...item].sort() : item
    );
    // Sort outer arrays by their string representation
    sortedA.sort((x, y) => JSON.stringify(x).localeCompare(JSON.stringify(y)));
    sortedB.sort((x, y) => JSON.stringify(x).localeCompare(JSON.stringify(y)));
    return JSON.stringify(sortedA) === JSON.stringify(sortedB);
  }
  return JSON.stringify(a) === JSON.stringify(b);
}

export function executeCode(
  code: string,
  testCases: { input: unknown[]; expected: unknown }[]
): TestResult[] {
  return testCases.map((test) => {
    try {
      // Create function from code string
      // eslint-disable-next-line no-new-func
      const fn = new Function('return (' + code + ')')();

      const start = performance.now();
      const output = fn(...structuredClone(test.input));
      const time = Math.round((performance.now() - start) * 100) / 100;

      const passed = deepEqual(output, test.expected);

      return {
        passed,
        input: test.input,
        expected: test.expected,
        output,
        time,
      };
    } catch (err) {
      return {
        passed: false,
        input: test.input,
        expected: test.expected,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  });
}
