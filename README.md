# 🩸 SHADOWBORNE v5 — Universal Dev Bot

Dev: **DEV AUSTIN**  •  Version: **5.0.0**

SHADOWBORNE is a cross-platform developer/utility bot with WhatsApp as its primary command interface. v5 adds a clan recognition database, five operating modes, service monitoring, health telemetry and an API laboratory while preserving the v4 command set.

## Setup
Set `TELEGRAM_BOT_TOKEN` and `BAN_CHECKER_API_KEY` in `.env`.

## Run
```bash
npm install
npm start
```

## New v5 commands
- `.mode` / `.mode self|public|dev|maintenance|stealth`
- `.scan` / `.scan <number>` / `.scan list` / `.scan add ...`
- `.monitor <url>` / `.monitor list` / `.monitor remove <url>`
- `.watch <url>`
- `.health`
- `.services`
- `.apilab get|post|put|delete|patch <url>`
- `.api get|post|put|delete|patch <url>` is also supported without replacing the original `.api` information command.

## Clan database
Seed data lives in `data/clans.json`. Add real clan entries using the owner-only `.scan add <name> | <tag> | <description>` command or edit the seed database before deployment.

## Security
The monitoring and API-lab HTTP clients only accept HTTP(S), reject embedded credentials, block local/private IP targets and do not follow redirects. This reduces the risk of turning the bot into an unrestricted internal-network proxy.

## Termux
```bash
bash termux-install.sh
```

## VPS / PM2
```bash
npm install
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
```

## Docker
```bash
docker compose up -d
```

## Health
`GET /` returns JSON status, uptime, mode and active session count.

## Persistence
Preserve `sessions/`, `data/`, and `logs/`, or set `SESSION_DIR` / `DATA_DIR`.

## WhatsApp
Use `.menu` after pairing. Owner/sudo-only v5 features remain protected by the same role system used by the existing bot.

## Source note
The prompt referenced separate v3 source files that were not present in the available materials. This v5 package keeps the existing v4 implementation and adds compatible modules around it rather than pretending unavailable source was copied. Provider-dependent OSINT commands fail closed until configured.
