#!/bin/bash
# Update znt.group content after the daily group digest has completed.
set -euo pipefail

PROJECT_DIR="${AGENT_KB_DIR:-/Users/wangzong/Desktop/agent-knowledge-base}"
RUNTIME_DIR="${GROUP_DIGEST_RUNTIME:-/Users/wangzong/.group-digest-runtime}"
DATE="${1:-}"
DEPLOY="${2:-}"
LOG_DIR="$RUNTIME_DIR/logs"
LOG="$LOG_DIR/site-update.log"
LOCK_DIR="$RUNTIME_DIR/.schedule/site-update-${DATE:-auto}.running"

mkdir -p "$LOG_DIR" "$RUNTIME_DIR/.schedule"

if [ -z "$DATE" ]; then
  DATE=$(TZ=Asia/Shanghai date -v-1d '+%Y-%m-%d')
fi

if ! [[ "$DATE" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
  echo "Usage: $0 YYYY-MM-DD [--deploy]" >&2
  exit 2
fi

LOCK_DIR="$RUNTIME_DIR/.schedule/site-update-$DATE.running"
STAMP="$RUNTIME_DIR/.schedule/site-update-$DATE.ok"

log() {
  echo "[$(TZ=Asia/Shanghai date '+%F %T')] $*" | tee -a "$LOG"
}

mkdir "$LOCK_DIR" 2>/dev/null || {
  log "site update already running for $DATE"
  exit 0
}
trap 'rmdir "$LOCK_DIR" 2>/dev/null || true' EXIT

cd "$PROJECT_DIR"

log "site update start date=$DATE deploy=${DEPLOY:-no}"

python3 scripts/generate_daily_from_essence.py "$DATE" 2>&1 | tee -a "$LOG"
python3 scripts/check_daily_quality.py "$DATE" 2>&1 | tee -a "$LOG"
node scripts/sync_digest_images.mjs "$DATE" 2>&1 | tee -a "$LOG"
python3 scripts/generate_index.py 2>&1 | tee -a "$LOG"
python3 scripts/generate_search_index.py 2>&1 | tee -a "$LOG"

if [ "$DEPLOY" = "--deploy" ]; then
  if [ -e .vercel/output ]; then
    mv .vercel/output ".vercel/output.stale.$(date +%Y%m%d%H%M%S)"
  fi
  npx vercel build --prod 2>&1 | tee -a "$LOG"
  npx vercel deploy --prebuilt --prod -y --scope wangzong --archive=tgz 2>&1 | tee -a "$LOG"
  log "vercel production deploy completed for $DATE"
else
  npm run build 2>&1 | tee -a "$LOG"
fi

touch "$STAMP"
log "site update done date=$DATE"
