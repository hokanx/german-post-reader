// Runs the *.test.ts files under src/ that no npm script previously invoked.
//
// They are standalone tsx scripts that set process.exitCode on failure, not
// node:test suites — so `tsx --test` would not run them correctly. This walks
// src/, runs each one, and fails the run if any file exits non-zero.
// Cross-platform: no shell globbing, which does not expand on Windows.
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

function findTests(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...findTests(full));
    else if (entry.endsWith(".test.ts")) out.push(full);
  }
  return out;
}

const files = findTests("src").sort();
if (files.length === 0) {
  console.error("no *.test.ts files found under src/");
  process.exit(1);
}

let failed = 0;
for (const file of files) {
  const res = spawnSync("npx", ["tsx", file], { stdio: "inherit", shell: true });
  const ok = res.status === 0;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${file}`);
}

console.log(`\n${files.length - failed}/${files.length} unit test files passed`);
process.exit(failed === 0 ? 0 : 1);
