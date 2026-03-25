import type { Problem } from './types';

export const problems: Problem[] = [
  {
    id: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    description:
      'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`. You may assume each input has exactly one solution, and you may not use the same element twice. Return the answer as an array of two indices.',
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]' },
    ],
    starterCode: `function twoSum(nums, target) {\n  // Your code here\n\n}`,
    functionName: 'twoSum',
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] },
      { input: [[1, 5, 3, 7], 8], expected: [1, 2] },
      { input: [[0, 4, 3, 0], 0], expected: [0, 3] },
    ],
  },
  {
    id: 2,
    title: 'Palindrome Check',
    difficulty: 'Easy',
    description:
      'Given a string `s`, return `true` if it is a palindrome (reads the same forwards and backwards), ignoring case and non-alphanumeric characters.',
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true' },
      { input: 's = "race a car"', output: 'false' },
    ],
    starterCode: `function isPalindrome(s) {\n  // Your code here\n\n}`,
    functionName: 'isPalindrome',
    testCases: [
      { input: ['A man, a plan, a canal: Panama'], expected: true },
      { input: ['race a car'], expected: false },
      { input: [''], expected: true },
      { input: ['ab_a'], expected: true },
      { input: ['hello'], expected: false },
    ],
  },
  {
    id: 3,
    title: 'FizzBuzz',
    difficulty: 'Easy',
    description:
      'Given an integer `n`, return an array of strings from 1 to n where: multiples of 3 are "Fizz", multiples of 5 are "Buzz", multiples of both are "FizzBuzz", and all others are the number as a string.',
    examples: [
      { input: 'n = 5', output: '["1", "2", "Fizz", "4", "Buzz"]' },
      { input: 'n = 15', output: '["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]' },
    ],
    starterCode: `function fizzBuzz(n) {\n  // Your code here\n\n}`,
    functionName: 'fizzBuzz',
    testCases: [
      { input: [3], expected: ['1', '2', 'Fizz'] },
      { input: [5], expected: ['1', '2', 'Fizz', '4', 'Buzz'] },
      { input: [15], expected: ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz'] },
      { input: [1], expected: ['1'] },
    ],
  },
  {
    id: 4,
    title: 'Reverse Linked List',
    difficulty: 'Medium',
    description:
      'Given an array representing a linked list, reverse it in place and return the reversed array. (We use arrays to simplify — treat it as reversing a sequence.)',
    examples: [
      { input: 'arr = [1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]' },
      { input: 'arr = [1, 2]', output: '[2, 1]' },
    ],
    starterCode: `function reverseArray(arr) {\n  // Your code here\n\n}`,
    functionName: 'reverseArray',
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
      { input: [[1, 2]], expected: [2, 1] },
      { input: [[1]], expected: [1] },
      { input: [[]], expected: [] },
      { input: [[10, 20, 30]], expected: [30, 20, 10] },
    ],
  },
  {
    id: 5,
    title: 'Valid Anagram',
    difficulty: 'Easy',
    description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise. An anagram uses the same characters with the same frequency.',
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' },
    ],
    starterCode: `function isAnagram(s, t) {\n  // Your code here\n\n}`,
    functionName: 'isAnagram',
    testCases: [
      { input: ['anagram', 'nagaram'], expected: true },
      { input: ['rat', 'car'], expected: false },
      { input: ['listen', 'silent'], expected: true },
      { input: ['hello', 'world'], expected: false },
      { input: ['', ''], expected: true },
    ],
  },
  {
    id: 6,
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    description: 'Given an integer array `nums`, find the contiguous subarray with the largest sum and return that sum.',
    examples: [
      { input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6', explanation: 'Subarray [4, -1, 2, 1] has the largest sum = 6' },
      { input: 'nums = [1]', output: '1' },
    ],
    starterCode: `function maxSubArray(nums) {\n  // Your code here\n\n}`,
    functionName: 'maxSubArray',
    testCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { input: [[1]], expected: 1 },
      { input: [[5, 4, -1, 7, 8]], expected: 23 },
      { input: [[-1]], expected: -1 },
      { input: [[-2, -1]], expected: -1 },
    ],
  },
  {
    id: 7,
    title: 'Count Vowels',
    difficulty: 'Easy',
    description: 'Given a string `s`, return the number of vowels (a, e, i, o, u) in the string. Count both uppercase and lowercase vowels.',
    examples: [
      { input: 's = "Hello World"', output: '3' },
      { input: 's = "AEIOU"', output: '5' },
    ],
    starterCode: `function countVowels(s) {\n  // Your code here\n\n}`,
    functionName: 'countVowels',
    testCases: [
      { input: ['Hello World'], expected: 3 },
      { input: ['AEIOU'], expected: 5 },
      { input: ['bcdfg'], expected: 0 },
      { input: [''], expected: 0 },
      { input: ['aEiOu'], expected: 5 },
    ],
  },
  {
    id: 8,
    title: 'Flatten Array',
    difficulty: 'Medium',
    description: 'Given a nested array of integers, return a flat array with all elements in order. The array can be nested to any depth.',
    examples: [
      { input: 'arr = [1, [2, [3, 4], 5]]', output: '[1, 2, 3, 4, 5]' },
      { input: 'arr = [[1, 2], [3, [4]]]', output: '[1, 2, 3, 4]' },
    ],
    starterCode: `function flattenArray(arr) {\n  // Your code here\n\n}`,
    functionName: 'flattenArray',
    testCases: [
      { input: [[1, [2, [3, 4], 5]]], expected: [1, 2, 3, 4, 5] },
      { input: [[[1, 2], [3, [4]]]], expected: [1, 2, 3, 4] },
      { input: [[1, 2, 3]], expected: [1, 2, 3] },
      { input: [[]], expected: [] },
      { input: [[[[[1]]]]], expected: [1] },
    ],
  },
  {
    id: 9,
    title: 'Binary Search',
    difficulty: 'Easy',
    description: 'Given a sorted array of integers `nums` and a `target`, return the index of the target if found, otherwise return -1. You must write an algorithm with O(log n) runtime.',
    examples: [
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9', output: '4' },
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2', output: '-1' },
    ],
    starterCode: `function binarySearch(nums, target) {\n  // Your code here\n\n}`,
    functionName: 'binarySearch',
    testCases: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { input: [[5], 5], expected: 0 },
      { input: [[1, 3, 5, 7, 9], 7], expected: 3 },
      { input: [[2, 4, 6, 8], 1], expected: -1 },
    ],
  },
  {
    id: 10,
    title: 'Group Anagrams',
    difficulty: 'Medium',
    description: 'Given an array of strings, group the anagrams together. Return an array of groups (each group is an array of strings). Order does not matter.',
    examples: [
      { input: 'strs = ["eat", "tea", "tan", "ate", "nat", "bat"]', output: '[["eat","tea","ate"], ["tan","nat"], ["bat"]]' },
    ],
    starterCode: `function groupAnagrams(strs) {\n  // Your code here\n\n}`,
    functionName: 'groupAnagrams',
    testCases: [
      {
        input: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']],
        expected: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']],
      },
      { input: [['', '']], expected: [['', '']] },
      { input: [['a']], expected: [['a']] },
    ],
  },
];

export function getRandomProblem(): Problem {
  return problems[Math.floor(Math.random() * problems.length)];
}

export function getProblemById(id: number): Problem | undefined {
  return problems.find((p) => p.id === id);
}
