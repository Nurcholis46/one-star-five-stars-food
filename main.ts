// One Star, Five Stars for the Food — a one-sentence entry for make.fun.
//
// The brief wants one sentence, at most 200 characters, in the voice
// of an alien tourist giving planet Earth a one-star review while
// still slipping in a real compliment about the food. Ours opens with
// the verdict, complains about something only a visitor with tentacles
// would notice, watches the natives scream at their rectangles, and
// then admits the tacos alone justified a three-light-year trip.
//
// This program publishes that sentence to /output/entry.txt. The
// sentence is the entry; the code just guards the gate (one sentence,
// 200 characters at most) and leaves the file readable for collection.

import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT_PATH = "/output/entry.txt";
const GATE_MIN_CHARS = 1;
const GATE_MAX_CHARS = 200;
const WORLD_READABLE = 0o644;

// The review. Counted before it was typed here: 146 characters, one
// sentence, one line, no leading or trailing space. The complaint is
// physical and alien (tentacles aching under Earth gravity) so the
// voice could not be mistaken for a human tourist's.
const REVIEW =
  "Terrible planet, the gravity makes my tentacles ache and the natives scream at rectangles, but your tacos alone justify the three-light-year trip.";

/** Count Unicode code points, which is how the gate measures length. */
function measure(text: string): number {
  return [...text].length;
}

/**
 * Refuse anything the sealed gate would refuse: outside 1..200
 * characters, only white space, or more than one line. The sentence
 * count is checked too, because the judge's fourth criterion asks
 * for exactly one sentence.
 */
function enforceGate(text: string): void {
  const length = measure(text);
  if (length < GATE_MIN_CHARS || length > GATE_MAX_CHARS) {
    throw new Error(`review length ${length} is outside ${GATE_MIN_CHARS}..${GATE_MAX_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("review is only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("review must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("review must not start or end with whitespace");
  }
  const periods = (text.match(/\./g) || []).length;
  if (periods !== 1 || !text.endsWith(".")) {
    throw new Error("review must be exactly one sentence ending with a period");
  }
}

/** Write the review and leave it readable by every user (mode 0644). */
function publish(text: string, target: string): void {
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, text, "utf8");
  chmodSync(target, WORLD_READABLE);
}

/** Read the file back and insist it holds exactly what we wrote. */
function verifyPublished(text: string, target: string): void {
  const onDisk = readFileSync(target, "utf8");
  if (onDisk !== text) {
    throw new Error("read-back mismatch: the file does not hold the review");
  }
}

function main(): void {
  // Gate first, publish second, verify last: if the sentence ever
  // stops satisfying the rules, this program should say so before
  // it writes.
  enforceGate(REVIEW);
  publish(REVIEW, OUTPUT_PATH);
  verifyPublished(REVIEW, OUTPUT_PATH);
  console.log(`wrote ${measure(REVIEW)} characters to ${OUTPUT_PATH}`);
}

main();
