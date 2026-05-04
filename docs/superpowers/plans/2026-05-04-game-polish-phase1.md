# Game Polish Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the first pass of battle pacing, logs, button assets, modal controls, and generic audio without blocking on deeper art regeneration.

**Architecture:** Keep battle changes inside `BattleScene.ts` and shared battle helper functions, add a small UI log surface to the existing Pinia UI store, and keep generic sound in a browser WebAudio manager so no new audio files are required. Global CSS handles reusable button image backgrounds and sticky close buttons.

**Tech Stack:** Vue 3, Pinia, Phaser 3, TypeScript, Web Audio API, Vite.

---

### Task 1: Battle Rules And Logs

**Files:**
- Modify: `src/game/utils/realtimeBattleRules.ts`
- Modify: `src/stores/ui.ts`
- Modify: `src/ui/hud/BottomBar.vue`
- Modify: `src/game/scenes/BattleScene.ts`

- [x] **Step 1: Define desired behavior**

Skill cooldowns should be shorter but still visible, battle skill bar icons should reuse the same skill icons as the HUD, and every meaningful battle event should append a bottom-bar log line.

- [x] **Step 2: Implement minimal data path**

Add a bounded log list to the UI store and render that list in `BottomBar.vue`.

- [x] **Step 3: Wire battle events**

Push logs from normal attacks, skill casts, monster attacks, dodges, victory, defeat, and item drops.

### Task 2: UI Polish

**Files:**
- Modify: `src/style.css`
- Modify: `src/ui/components/GameIcon.vue`
- Modify: `src/ui/hud/LeftMenu.vue`
- Modify: `src/ui/hud/BottomBar.vue`

- [x] **Step 1: Reusable asset buttons**

Make `.btn-dark`, `.btn-gold`, `.asset-action`, and `.close-btn` able to use generated button images with clean hover and disabled states.

- [x] **Step 2: Reduce double borders**

Allow `GameIcon` to disable its extra quality frame for icons that already contain a border.

- [x] **Step 3: Clarify quick items**

Replace ambiguous single-character item fallback labels with explicit quick-slot labels.

### Task 3: Generic Audio

**Files:**
- Create: `src/game/audio/audioManager.ts`
- Modify: `src/main.ts`
- Modify: `src/stores/ui.ts`
- Modify: `src/game/scenes/BattleScene.ts`

- [x] **Step 1: Add WebAudio manager**

Create synth-based city and battle background loops plus click, hit, skill, victory, defeat, and item sounds.

- [x] **Step 2: Start after user gesture**

Use a global click/key listener to unlock the audio context and play city music. Switch to battle music inside `BattleScene`.

- [x] **Step 3: Attach key interaction sounds**

Trigger sound effects from UI panel switches, quick item use, attacks, skill casts, and result screens.

### Task 4: Verification

**Files:**
- No source edits.

- [ ] **Step 1: Run build**

Run `npm run build`. Expected: exit code 0. Existing Vite chunk warnings are acceptable.

- [ ] **Step 2: Run asset check**

Run `npm run assets:verify`. Expected: `missing 0`.
