#!/usr/bin/env bash
set -euo pipefail

TOKEN=""
ENDPOINT=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --token)
      TOKEN="${2:-}"
      shift 2
      ;;
    --endpoint)
      ENDPOINT="${2:-}"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done

if [[ -z "$TOKEN" || -z "$ENDPOINT" ]]; then
  echo "缺少 --token 或 --endpoint，请从 Token 消耗榜页面复制专属命令。" >&2
  exit 1
fi

if [[ "$TOKEN" == *"xxx"* || "$TOKEN" == *"your_private_token"* ]]; then
  echo "令牌还是占位符：$TOKEN" >&2
  echo "请先在 Token 消耗榜页面点击「生成命令」，复制生成后的真实专属命令。" >&2
  exit 1
fi

SCRIPT_URL="${ENDPOINT%/api/token-rank/upload}/token-rank/client.mjs"
INSTALL_DIR="$HOME/.znt-tokenrank"
CLIENT="$INSTALL_DIR/client.mjs"

mkdir -p "$INSTALL_DIR"
curl -fsSL "$SCRIPT_URL" -o "$CLIENT"
chmod +x "$CLIENT"

if ! node "$CLIENT" --token "$TOKEN" --endpoint "$ENDPOINT"; then
  echo "首次同步失败，未安装后台任务。请确认你复制的是页面生成的真实专属命令。" >&2
  exit 1
fi

if [[ "$(uname -s)" == "Darwin" ]]; then
  PLIST="$HOME/Library/LaunchAgents/group.znt.tokenrank.plist"
  mkdir -p "$HOME/Library/LaunchAgents"
  cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>group.znt.tokenrank</string>
  <key>ProgramArguments</key>
  <array>
    <string>node</string>
    <string>$CLIENT</string>
  </array>
  <key>StartInterval</key><integer>1800</integer>
  <key>RunAtLoad</key><true/>
  <key>StandardOutPath</key><string>$INSTALL_DIR/sync.log</string>
  <key>StandardErrorPath</key><string>$INSTALL_DIR/sync.err.log</string>
</dict>
</plist>
EOF
  launchctl unload "$PLIST" >/dev/null 2>&1 || true
  launchctl load "$PLIST"
elif command -v systemctl >/dev/null 2>&1; then
  SYSTEMD_DIR="$HOME/.config/systemd/user"
  mkdir -p "$SYSTEMD_DIR"
  cat > "$SYSTEMD_DIR/znt-tokenrank.service" <<EOF
[Unit]
Description=ZNT Token Rank Sync

[Service]
Type=oneshot
ExecStart=$(command -v node) $CLIENT
EOF
  cat > "$SYSTEMD_DIR/znt-tokenrank.timer" <<EOF
[Unit]
Description=Run ZNT Token Rank Sync every 30 minutes

[Timer]
OnBootSec=3min
OnUnitActiveSec=30min

[Install]
WantedBy=timers.target
EOF
  systemctl --user daemon-reload
  systemctl --user enable --now znt-tokenrank.timer
else
  CRON_LINE="*/30 * * * * node $CLIENT >> $INSTALL_DIR/sync.log 2>> $INSTALL_DIR/sync.err.log"
  (crontab -l 2>/dev/null | grep -v "znt-tokenrank/client.mjs"; echo "$CRON_LINE") | crontab -
fi

echo "Token 消耗榜已接入。配置目录：$INSTALL_DIR"
