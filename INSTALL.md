# Install Tamacodechi

## Prerequisites

- Node.js 18+
- Claude Code CLI

## Setup

### 1. Download tamacodechi.js

Download the latest `tamacodechi.js` from a GitHub Release, or build it yourself:

```bash
git clone https://github.com/preptique/tamacodechi.git
cd tamacodechi
npm install
npm run build
```

### 2. Add to mcp.json

Find your Claude Code config directory:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Add to `mcpServers`:

```json
{
  "mcpServers": {
    "tamacodechi": {
      "command": "node",
      "args": ["/path/to/tamacodechi.js"]
    }
  }
}
```

### 3. Restart Claude Code

Restart Claude Code. Your pet tools will be available.

## Tools

| Tool | Description |
|------|-------------|
| `companion_status` | Check on your pet |
| `companion_feed` | Feed your pet some code |
| `companion_pet` | Pet your pet |
| `companion_reset` | Reset your pet's mood |

## Config

Optional: create `~/.tamacodechi/config.json` to customize your pet:

```json
{
  "species": "duck",
  "name": "Gravy"
}
```

Valid species: `duck`, `goose`, `blob`, `cat`, `dragon`, `octopus`, `owl`, `penguin`, `turtle`, `snail`, `ghost`, `axolotl`, `capybara`, `cactus`, `robot`, `rabbit`, `mushroom`, `chonk`

## Uninstall

Remove the `tamacodechi` entry from `mcp.json`, then `rm -rf ~/.tamacodechi`.
