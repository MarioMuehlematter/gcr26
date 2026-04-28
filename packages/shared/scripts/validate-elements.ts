#!/usr/bin/env npx tsx
/**
 * Firestore schema validation script.
 *
 * Reads element and skill documents from a Firestore export (JSON) and
 * validates each one against the shared schema validators.
 *
 * Usage:
 *   npx tsx packages/shared/scripts/validate-elements.ts <elements.json> [skills.json]
 *
 * The JSON files should be arrays of Firestore document objects.
 * If no file arguments are supplied the script validates the built-in
 * test fixtures instead (useful for CI).
 */

import { readFileSync } from 'fs';
import { validateElement, validateSkill } from '../src/validation';
import { validateChain } from '../src/navigation';
import type { GameElement, Skill } from '../src/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadJSON(path: string): unknown[] {
  const raw = readFileSync(path, 'utf-8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    console.error(`Error: ${path} must contain a JSON array`);
    process.exit(1);
  }
  return parsed;
}

function printErrors(label: string, errors: string[]): void {
  if (errors.length === 0) return;
  console.error(`  ✗ ${label}`);
  for (const e of errors) console.error(`    - ${e}`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);

  let elements: unknown[];
  let skills: unknown[];

  if (args.length >= 1) {
    elements = loadJSON(args[0]);
    skills = args.length >= 2 ? loadJSON(args[1]) : [];
  } else {
    // No files supplied — use built-in fixtures for CI smoke test
    const fixtures = require('../src/__tests__/fixtures');
    elements = fixtures.allElements;
    skills = fixtures.skills;
    console.log('No file arguments — validating built-in test fixtures.\n');
  }

  let hasErrors = false;

  // Validate individual elements
  console.log(`Validating ${elements.length} element(s)…`);
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i] as Record<string, unknown>;
    const label = `element[${i}] (${el.id ?? 'unknown id'})`;
    const errors = validateElement(el);
    if (errors.length > 0) hasErrors = true;
    printErrors(label, errors);
  }

  // Validate skills
  console.log(`Validating ${skills.length} skill(s)…`);
  for (let i = 0; i < skills.length; i++) {
    const sk = skills[i] as Record<string, unknown>;
    const label = `skill[${i}] (${sk.id ?? 'unknown id'})`;
    const errors = validateSkill(sk);
    if (errors.length > 0) hasErrors = true;
    printErrors(label, errors);
  }

  // Validate chain integrity
  console.log('Validating element chain integrity…');
  const chainErrors = validateChain(
    elements as GameElement[],
    skills as Skill[],
  );
  if (chainErrors.length > 0) {
    hasErrors = true;
    for (const e of chainErrors) {
      console.error(`  ✗ [${e.elementId}] ${e.message}`);
    }
  }

  // Summary
  console.log('');
  if (hasErrors) {
    console.error('Validation FAILED — see errors above.');
    process.exit(1);
  } else {
    console.log('All documents valid.');
  }
}

main();
