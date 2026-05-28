# Claude Code Usage Widget

A lightweight, always-on-top desktop widget for Windows that shows your **Claude Code** token usage and rate-limit status in real time — directly on your screen while you work.

![Widget Preview](https://raw.githubusercontent.com/BrSilvinha/claude-widget/main/preview.png)

## Features

- **Session limit** — current 5-hour usage window (%)
- **Weekly limit** — rolling 7-day usage window (%)
- **Token counter** — tokens consumed today and this month
- Frameless, transparent glassmorphism card (always on top)
- Lives in the system tray (show/hide with a click)
- Auto-refreshes every 30 seconds
- Animates in with a smooth slide-up transition

## Requirements

- **Windows 10/11**
- [Node.js](https://nodejs.org) v18 or later
- [Claude Code CLI](https://claude.ai/code) installed and logged in
  - The widget reads `~/.claude/.credentials.json` and `~/.claude/projects/**/*.jsonl`

## Installation

```bash
git clone https://github.com/BrSilvinha/claude-widget.git
cd claude-widget
npm install
npm start
```

The widget will appear in the bottom-right corner of your primary display. An icon will also be added to your system tray.

## How It Works

| Source | Data |
|---|---|
| `~/.claude/projects/**/*.jsonl` | Token counts (today / month) |
| `https://claude.ai/api/oauth/usage` | Session & weekly limit percentages |

- **Token stats** are parsed locally — no network call needed.
- **Limit data** is fetched from Claude's API using the OAuth token stored by Claude Code at `~/.claude/.credentials.json`. No credentials are ever stored or transmitted elsewhere.

## Project Structure

```
claude-widget/
├── main.js          # Electron main process — window + tray setup
├── preload.js       # Secure IPC bridge (contextBridge)
├── index.html       # Widget UI (vanilla HTML/CSS/JS)
├── usage.js         # Reads .jsonl logs and aggregates token counts
├── limits.js        # Fetches live limit data from Claude's API
└── fetch-icon.js    # Downloads Claude's icon for the tray on first run
```

## Tray Menu

Right-click the tray icon to:
- **Show / Hide** the widget
- **Exit** the app

## Notes

- The widget uses Claude Code's existing OAuth session — no API key is required.
- Token counts include `input_tokens`, `cache_creation_input_tokens`, and `cache_read_input_tokens`.
- If `~/.claude/.credentials.json` is not found, limit bars will show as empty (token counts still work).

## License

MIT
