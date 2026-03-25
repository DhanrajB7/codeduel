# CodeDuel — Real-time Coding Battles

**Live Demo:** [codeduel-seven.vercel.app](https://codeduel-seven.vercel.app)

CodeDuel is a real-time multiplayer coding battle platform. Challenge a friend to solve the same programming problem simultaneously — with a live timer, side-by-side Monaco editors, and instant code execution in the browser. First to pass all tests wins.

---

## How It Works

1. **Create a Room** — Enter your name, get a 6-character room code
2. **Share the Code** — Send the code to your friend
3. **They Join** — A 5-second countdown starts when both players are in
4. **Battle** — Both players see the same problem and code simultaneously
5. **Run & Test** — Execute code against test cases in real-time (browser-side)
6. **Submit** — First to pass all tests wins, or whoever has more passes when the 5-minute timer runs out
7. **Results** — Side-by-side comparison of scores

There's also a **Solo Practice** mode with 10 problems across Easy/Medium difficulties.

---

## Tech Stack

| Layer | Technology | Why I Chose It |
|-------|-----------|----------------|
| **Framework** | Next.js 14 (App Router) | Full-stack framework with API routes for room management and dynamic routing for game rooms |
| **Language** | TypeScript | End-to-end type safety. The `Room`, `Problem`, and `TestResult` types are shared between client and server |
| **Code Editor** | Monaco Editor | The same editor that powers VS Code — syntax highlighting, bracket matching, IntelliSense-quality UX. Loaded dynamically to avoid SSR issues |
| **Real-time** | Supabase Realtime | PostgreSQL change notifications via WebSocket subscriptions. When a room row updates (player joins, submits), all clients get instant updates without polling |
| **Database** | Supabase (PostgreSQL) | Stores room state: players, code, scores, timestamps. Schema designed for atomic updates to prevent race conditions on simultaneous submissions |
| **Styling** | Tailwind CSS v4 | Custom `@theme inline` tokens matching the portfolio design system. Dark theme with teal/purple accents |
| **Deployment** | Vercel | Zero-config Next.js deployment with serverless API routes |

---

## Architecture

```
src/
├── app/
│   ├── page.tsx                 # Landing — Create/Join room UI
│   ├── practice/page.tsx        # Solo practice mode with problem picker
│   ├── room/[code]/page.tsx     # Game room — editor, problem, timer, results
│   └── api/
│       ├── rooms/route.ts       # POST: create or join a room
│       └── submit/route.ts      # POST: submit solution, determine winner
├── components/
│   ├── CodeEditor.tsx           # Monaco Editor wrapper (dynamically imported)
│   ├── Timer.tsx                # Countdown timer with color states
│   └── TestResults.tsx          # Pass/fail display for test cases
└── lib/
    ├── problems.ts              # 10 coding problems with test cases
    ├── execute.ts               # Browser-side code execution engine
    ├── supabase.ts              # Supabase client
    └── types.ts                 # Shared TypeScript interfaces
```

### Game State Machine

```
WAITING ──[player 2 joins]──> COUNTDOWN ──[5 seconds]──> PLAYING ──[submit/timer]──> FINISHED
   │                              │                          │                          │
   │  Room code displayed         │  3...2...1...GO          │  Editor + Timer active   │  Results shown
   │  Waiting for opponent        │  Names shown             │  Real-time opponent      │  Winner declared
   │                              │                          │  status via Supabase     │  Play again CTA
```

### Data Flow

```
Player A creates room
        │
        ▼
  API: INSERT into codeduel_rooms (status: 'waiting')
        │
Player B joins with code
        │
        ▼
  API: UPDATE room (player2, status: 'countdown', started_at: now+5s)
        │
  Supabase Realtime → Both clients notified → Countdown starts
        │
        ▼
  Status: 'playing' → Timer starts, editors unlocked
        │
  Player A submits ──> API: UPDATE (player1_submitted, tests_passed)
        │                     │
        │              Is other player done? ──> No: wait
        │                     │
        │                    Yes ──> Compare scores ──> Set winner, status: 'finished'
        │
  Supabase Realtime → Both clients see results
```

---

## Code Execution Engine

Code runs **entirely in the browser** — no server-side execution, no external APIs, zero cost.

```typescript
const fn = new Function('return (' + userCode + ')')();
const output = fn(...testCase.input);
const passed = deepEqual(output, testCase.expected);
```

Key decisions:
- **`new Function()` constructor** — Creates a function from the user's code string. Safer than `eval()` since it doesn't access the calling scope
- **`structuredClone()` on inputs** — Prevents test cases from being mutated between runs
- **Deep equality comparison** — Custom `deepEqual` handles nested arrays and objects, with special sorting logic for problems like Group Anagrams where order doesn't matter

---

## Key Engineering Decisions

### Monaco Editor Dynamic Import
Monaco Editor is ~2MB and requires browser APIs. Using Next.js `dynamic()` with `ssr: false` prevents server-side rendering errors and lazy-loads the editor only when needed.

### Supabase Realtime vs WebSockets vs Polling
- **WebSockets (Socket.io)** — Requires a persistent server, incompatible with Vercel's serverless model
- **Polling** — Simple but introduces latency and unnecessary API calls
- **Supabase Realtime** — Subscribes to PostgreSQL row changes via WebSocket. Zero additional infrastructure

### Room Code Design
Room codes use `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (no I/1, O/0 to avoid confusion). 6 characters = 887M combinations.

### Winner Determination Logic
1. Player passes **all test cases** → instant win
2. Both submit → compare tests passed → higher wins
3. Tied on tests → declared a tie
4. Timer expires → auto-submit whatever code is in the editor

---

## Problem Set

| # | Problem | Difficulty | Key Concept |
|---|---------|-----------|-------------|
| 1 | Two Sum | Easy | Hash map lookup |
| 2 | Palindrome Check | Easy | String manipulation |
| 3 | FizzBuzz | Easy | Conditionals, modulo |
| 4 | Reverse Array | Medium | In-place reversal |
| 5 | Valid Anagram | Easy | Character frequency |
| 6 | Maximum Subarray | Medium | Kadane's algorithm |
| 7 | Count Vowels | Easy | String iteration |
| 8 | Flatten Array | Medium | Recursion |
| 9 | Binary Search | Easy | Divide and conquer |
| 10 | Group Anagrams | Medium | Hash map grouping |

---

## Challenges & Solutions

| Challenge | What Happened | How I Solved It |
|-----------|--------------|-----------------|
| **Monaco SSR crash** | Monaco requires `window`/`document` which don't exist during server rendering | Used Next.js `dynamic()` with `ssr: false` for client-only loading |
| **Race condition on submit** | Simultaneous submissions could both declare a winner | Server checks `otherSubmitted` atomically; Supabase row-level updates prevent conflicts |
| **Deep equality for unordered arrays** | `JSON.stringify` fails for Group Anagrams where inner array order doesn't matter | Custom `deepEqual` sorts inner/outer arrays by string representation before comparing |
| **Countdown sync across clients** | Both players need identical countdowns despite clock differences | Server sets `started_at = now + 5s`; clients independently calculate time from that timestamp |
| **Code execution security** | `new Function()` can theoretically access globals | Accepted tradeoff for portfolio; production would use Web Worker sandboxing |

---

## Running Locally

```bash
git clone https://github.com/DhanrajB7/codeduel.git
cd codeduel
npm install

cp .env.example .env.local
# Add Supabase URL and anon key

# Run supabase-schema.sql in Supabase SQL Editor

npm run dev
```

Open two browser tabs at `localhost:3000` to test multiplayer.

---

## What I Would Add Next

- **Spectator mode** — Watch live duels
- **ELO ranking** — Persistent ratings with matchmaking
- **More languages** — Python, Java via Piston API
- **Tournament brackets** — Multi-round elimination
- **Custom problems** — User-created challenges

---

## Built With

Next.js 14 &bull; TypeScript &bull; Tailwind CSS v4 &bull; Monaco Editor &bull; Supabase Realtime &bull; Vercel

Built by [Dhanraj Bhalala](https://github.com/DhanrajB7)
