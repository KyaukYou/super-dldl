# Battle HUD And Quickbar Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the battle HUD, left navigation, close buttons, and bottom quickbar so the interface is readable, controllable, and consistent with the new generated button assets.

**Architecture:** Update the Phaser battle scene for attack/escape behavior, extend the Pinia game store with saved quickbar assignments, then rebuild the Vue HUD and panel close buttons around those shared store primitives. Keep combat flow in the scene and persistent HUD configuration in the store.

**Tech Stack:** Vue 3, Pinia, Phaser 3, TypeScript, Vite

---

### Task 1: Add quickbar persistence and item assignment rules

**Files:**
- Modify: `E:\project\dldl-new\src\types\game.ts`
- Modify: `E:\project\dldl-new\src\stores\game.ts`

- [ ] Add a quickbar slot type and store field for eight saved item assignments.
- [ ] Add helper methods to assign, clear, validate, and read quickbar slots.
- [ ] Save and load quickbar data with the rest of the save payload.
- [ ] Keep assignments only for usable potion items.

### Task 2: Rebuild the bottom HUD

**Files:**
- Modify: `E:\project\dldl-new\src\ui\hud\BottomBar.vue`

- [ ] Repair visible Chinese text in the HUD.
- [ ] Increase the HUD height to about 200px and keep the log pane scrollable.
- [ ] Add the missing `hint` log tab and keep log filtering functional.
- [ ] Replace the fixed right-side controls with an 8-slot quickbar and cleaner layout.
- [ ] Remove the confusing fixed experience/full-heal/manual/idle controls from the bottom HUD.
- [ ] Add drag/drop hooks so the bag can populate quick slots.

### Task 3: Update bag interactions for drag and quick assignment

**Files:**
- Modify: `E:\project\dldl-new\src\ui\panels\BagPanel.vue`

- [ ] Repair visible Chinese text in the bag panel.
- [ ] Mark usable potion items as draggable for the quickbar.
- [ ] Keep spirit ring use/sell behavior intact.
- [ ] Swap the text close button for the generated close-button image.

### Task 4: Polish battle controls and exit behavior

**Files:**
- Modify: `E:\project\dldl-new\src\game\scenes\BattleScene.ts`
- Modify: `E:\project\dldl-new\src\game\utils\realtimeBattleRules.ts`
- Modify: `E:\project\dldl-new\src\game\scenes\GameScene.ts`

- [ ] Replace the normal attack text block with an icon-style control.
- [ ] Set normal attack cadence to 1 second.
- [ ] Add an escape/leave button in battle with no rewards.
- [ ] Stop battle immediately when the player leaves for another panel.
- [ ] Keep logs and result flow correct for victory, defeat, and escape.

### Task 5: Enlarge the left navigation and fix modal close buttons

**Files:**
- Modify: `E:\project\dldl-new\src\App.vue`
- Modify: `E:\project\dldl-new\src\ui\hud\LeftMenu.vue`
- Modify: `E:\project\dldl-new\src\ui\panels\AcademyPanel.vue`
- Modify: `E:\project\dldl-new\src\ui\panels\BagPanel.vue`
- Modify: `E:\project\dldl-new\src\ui\panels\BonePanel.vue`
- Modify: `E:\project\dldl-new\src\ui\panels\CharacterPanel.vue`
- Modify: `E:\project\dldl-new\src\ui\panels\CodexPanel.vue`
- Modify: `E:\project\dldl-new\src\ui\panels\RankPanel.vue`
- Modify: `E:\project\dldl-new\src\ui\panels\RingSkillSelectPanel.vue`
- Modify: `E:\project\dldl-new\src\ui\panels\SettingsPanel.vue`
- Modify: `E:\project\dldl-new\src\ui\panels\SkillPanel.vue`
- Modify: `E:\project\dldl-new\src\ui\panels\SpiritPanel.vue`
- Modify: `E:\project\dldl-new\src\ui\panels\WorldMapPanel.vue`

- [ ] Increase the left layout column to 142px.
- [ ] Scale up menu buttons and icons by about 30%.
- [ ] Replace remaining text close buttons with the generated close-button image.
- [ ] Keep close buttons fixed at the panel top-right during panel scrolling.

### Task 6: Verify

**Files:**
- Modify as needed from earlier tasks

- [ ] Run `npm run build`
- [ ] Run `npm run assets:verify`
- [ ] Report any remaining warnings honestly
