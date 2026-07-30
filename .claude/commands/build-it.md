---
description: load BUILD_PROMPT.md and start the full build chain
---

## SPEC.md is the contract — read it first, do NOT re-brainstorm

before doing anything else, read `SPEC.md` in the project root in full. it contains the user's already-locked answers about what to build:
- **title, what_it_is, who_its_for** — the user-facing pitch
- **key_user_flows** — the 3-5 flows that must work
- **mvp_scope_in** — every "X works" bullet that defines v1
- **later_stages** — what to defer, NOT to build now
- **success_metrics, risks** — context for tradeoff decisions

these were captured in a multi-turn dialog on the web app **before** the kit was generated. they are LOCKED. do NOT invoke `superpowers:brainstorming` to re-ask the user questions whose answers are already in SPEC.md (e.g. "what auth method?" "should there be a client portal?" "do you want payments?"). the user already answered those; re-asking is broken UX. brainstorming is reserved for genuine new gaps SPEC.md doesn't cover — and SPEC.md should cover everything at the v1 scope level.

## what to do

1. read `SPEC.md` (the contract above).
2. read `CLAUDE.md` (project-specific rules and invariants).
3. read `BUILD_PROMPT.md` end-to-end and execute the steps in order.

## interpreting "brainstorm" / "spec" verbs in the steps

the first_steps may say things like "use superpowers to brainstorm the auth flow" or "write the spec for booking to docs/superpowers/specs/booking.md". those phrases mean: **write an implementation-level design doc (the "how") derived from SPEC.md (the "what")** — NOT restart a clarifying-questions dialog with the user. you are designing the implementation; you already know what to build. only ask the user a question if (a) SPEC.md is genuinely silent on a load-bearing decision AND (b) the answer would change the code materially.

## other rules from BUILD_PROMPT.md

- the terminal rule (YOU run commands, the user does not)
- the UI quality gate (design-system/MASTER.md and per-page briefs before JSX)
- verification-before-completion (never claim done without running the verify command and reading its output)
- bite-sized commits between steps

if `BUILD_PROMPT.md` does not exist in the current folder, tell the user and stop — don't guess what they want built.
