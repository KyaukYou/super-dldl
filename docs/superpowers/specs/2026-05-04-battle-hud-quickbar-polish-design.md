# Battle HUD And Quickbar Polish Design

## Scope

This phase improves the battle controls, left navigation, bottom HUD, modal close buttons, and quick item bar. It does not redesign combat formulas or add new item types.

## Battle Controls

- Replace the plain text normal attack button with a visual icon-style button that matches the skill slots.
- Set normal attack cooldown to 1 second.
- Add a visible escape/leave button in battle. Escaping stops the battle immediately, gives no reward, logs the action, and returns to the previous non-battle view.
- When the player opens any left-side page while battle is active, stop the battle immediately so combat cannot continue in the background.

## Left Navigation

- Increase the main layout left column from 92px to 142px.
- Enlarge menu buttons and icons by roughly 30%.
- Let icons occupy most of each button, with the text label kept small below the icon.
- Keep the menu scrollable if the viewport is too short.

## Bottom HUD

- Increase bottom HUD height from 132px to about 200px.
- Keep the log area fixed inside the HUD with its own scrollbar.
- Keep log tabs because they are functional, and add the missing hint tab so the filters become: All, System, Hint, World, Battle.
- Rework the right side into two readable rows: equipped soul skills and quick-use items.
- Remove unclear fixed controls from the bottom HUD, including the current manual/idle buttons. Auto battle remains a battle-scene control.

## Quick Item Bar

- Replace the fixed four quick items with eight saved quick slots.
- Allow dragging usable potion items from the bag into quick slots.
- Reject non-usable items such as materials, spirit rings, and bones.
- Clicking a quick slot uses that item if available. If quantity is zero, the slot remains assigned but appears disabled.
- Save quick slot assignments in localStorage together with the existing save data.

## Modal Close Buttons

- Replace text close buttons in panels/modals with the generated close button image.
- Close buttons are fixed at the top-right of the panel surface so they remain visible while content scrolls.
- Avoid adding an extra decorative frame around an image that already has its own border.

## Verification

- Run the project build.
- Run asset verification.
- Manually inspect likely affected files for remaining mojibake or `???` display strings.
