# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Vanilla HTML5 Canvas + JavaScript: no package.json, bundler, linter or test suite. Docs and UI strings are in Spanish.

- Run: open `index.html` directly, or serve the folder (`npx serve .` or `python -m http.server 8000`).
- Syntax check: `node --check game.js`

## Architecture

Three files: `index.html` (canvas `#board`, side panel with score/lines/level, `#next-canvas` preview, `#overlay` for pause/game over), `style.css` (dark retro theme), `game.js` (all logic, ~300 lines, top-level globals).

- Board is a `ROWS×COLS` matrix of `0` or a color index (1–7) that also indexes `COLORS` and `PIECES`.
- Pieces are square matrices rotated by `rotateCW` (transpose + reverse rows); `tryRotate` applies wall kicks of ±1/±2 columns.
- `loop(ts)` is `requestAnimationFrame`, accumulating `dropAccum` against `dropInterval`. Speed is `max(100, 1000 − (level − 1) × 90)` ms; level rises every 10 lines.
- Scoring: `LINE_SCORES` × level; hard drop +2/cell, soft drop +1/row.
- A piece that collides on `spawn()` triggers `endGame()`.
- If you change `COLS`, `ROWS` or `BLOCK`, update the `<canvas id="board">` width/height in `index.html` to `COLS×BLOCK` by `ROWS×BLOCK` (currently 300×600).

`README.md` has a fuller description and the game flow diagram.
