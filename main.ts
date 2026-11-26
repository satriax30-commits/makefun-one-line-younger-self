// main.ts — "One Line to Your Younger Self"
// make.fun bounty: u-boothlord-one-line-to-your-younger-self-22e97f76
//
// Writes exactly one line — the line the writer would send back to
// their younger self — to /output/entry.txt (default), or to the path
// given as the first CLI argument / OUTPUT_PATH (local testing).
//
// Deterministic by construction: no network, no wall-clock, no
// randomness. Node 22, stdlib only.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The line (decided entry, used verbatim — do not edit):
// a warning about one specific bike at one specific age, on one named
// street, with a broken arm, and the twist landing in the last clause:
// the cast is how you meet Maya, who is still in his life 20 years
// later, still stealing his fries. One sentence, one breath, a life
// only this older self could have lived.
const ENTRY =
  "Skip the red bike at 14 — the brakes fail on Maple Street, you break your left arm, and the cast is how you meet Maya, who still steals your fries 20 years later.";

// Gate: the entry must be UTF-8 text of 1-200 characters, not only
// whitespace, and a single line (the bounty is one line, nothing else).
function validateEntry(text: string): void {
  const length = [...text].length; // code-point count, not UTF-16 units
  if (length < 1 || length > 200) {
    throw new Error(`entry length ${length} is outside the 1-200 gate`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text !== text.trim()) {
    throw new Error("entry has leading or trailing whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

// Resolve the output file path: first CLI argument wins, then the
// OUTPUT_PATH environment variable, then the grader default.
// An argument naming a directory (no .txt suffix) means <dir>/entry.txt;
// anything else is taken as the file path itself.
function resolveOutPath(): string {
  const raw = process.argv[2] ?? process.env.OUTPUT_PATH ?? "/output/entry.txt";
  if (raw.endsWith(".txt")) {
    return raw;
  }
  return join(raw, "entry.txt");
}

function main(): void {
  const outPath = resolveOutPath();

  // Validate before writing: nothing invalid ever reaches the file.
  validateEntry(ENTRY);

  mkdirSync(dirname(outPath), { recursive: true });
  // No trailing newline: the gate counts the whole file content, so the
  // file is exactly the line and nothing else.
  writeFileSync(outPath, ENTRY, "utf8");

  // Read-back self-check: what is on disk must be byte-identical to
  // the validated line, and must still pass the gate.
  const back = readFileSync(outPath, "utf8");
  if (back !== ENTRY) {
    throw new Error("read-back mismatch: entry.txt differs from the line");
  }
  validateEntry(back);

  console.log(`wrote ${outPath} (${[...ENTRY].length} chars)`);
}

main();

