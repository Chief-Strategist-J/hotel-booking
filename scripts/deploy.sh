#!/usr/bin/env bash
# =============================================================================
# Hotel Booking — Full Deployment Script
# Targets: GitHub + Neon (PostgreSQL) + Vercel
# Usage:  bash scripts/deploy.sh
# =============================================================================
set -euo pipefail

# ── Colours ──────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
log()   { echo -e "${GREEN}▶${NC}  $1"; }
warn()  { echo -e "${YELLOW}⚠${NC}  $1"; }
error() { echo -e "${RED}✖${NC}  $1"; exit 1; }
info()  { echo -e "${CYAN}ℹ${NC}  $1"; }

REPO_NAME="hotel-booking"
NEON_PROJECT_NAME="hotel-booking"
NEON_ORG_ID="org-bitter-bar-73024891"   # Chief org
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

# ── 1. Prerequisites ──────────────────────────────────────────────────────────
log "Checking prerequisites..."
for cmd in gh vercel neonctl npx openssl jq; do
  command -v "$cmd" >/dev/null 2>&1 || error "'$cmd' not found. Please install it first."
done

gh auth status >/dev/null 2>&1    || error "Not authenticated with GitHub.  Run: gh auth login"
vercel whoami  >/dev/null 2>&1    || error "Not authenticated with Vercel.  Run: vercel login"
neonctl me     >/dev/null 2>&1    || error "Not authenticated with Neon.    Run: neonctl auth"

GH_USER=$(gh api user --jq '.login')
info "GitHub  : $GH_USER"
info "Vercel  : $(vercel whoami)"
info "Neon    : $(neonctl me --output json 2>/dev/null | jq -r '.login // .email // "authenticated"')"
echo ""

# ── 2. GitHub repo ────────────────────────────────────────────────────────────
log "Setting up GitHub repository..."
if gh repo view "$GH_USER/$REPO_NAME" >/dev/null 2>&1; then
  warn "Repo '$GH_USER/$REPO_NAME' already exists — skipping creation."
  if git remote get-url origin >/dev/null 2>&1; then
    git remote set-url origin "https://github.com/$GH_USER/$REPO_NAME.git"
  else
    git remote add origin "https://github.com/$GH_USER/$REPO_NAME.git"
  fi
else
  log "Creating public repo: $GH_USER/$REPO_NAME"
  gh repo create "$REPO_NAME" --public --source=. --remote=origin
fi

git branch -M main
git push -u origin main --force
info "Pushed to: https://github.com/$GH_USER/$REPO_NAME"
echo ""

# ── 3. Neon database ──────────────────────────────────────────────────────────
log "Setting up Neon PostgreSQL database..."
EXISTING_ID=$(neonctl projects list --output json --org-id "$NEON_ORG_ID" 2>/dev/null \
  | jq -r ".[] | select(.name == \"$NEON_PROJECT_NAME\") | .id" 2>/dev/null | head -1 || true)

if [ -n "$EXISTING_ID" ]; then
  warn "Neon project '$NEON_PROJECT_NAME' already exists (id: $EXISTING_ID) — reusing."
  PROJECT_ID="$EXISTING_ID"
else
  log "Creating Neon project: $NEON_PROJECT_NAME"
  PROJECT_ID=$(neonctl projects create \
    --name "$NEON_PROJECT_NAME" \
    --org-id "$NEON_ORG_ID" \
    --region-id aws-us-east-1 \
    --output json \
    | jq -r '.id')
  info "Created project: $PROJECT_ID"
fi

# Pooled + Prisma-compatible connection string
DATABASE_URL=$(neonctl connection-string \
  --project-id "$PROJECT_ID" \
  --pooled \
  --prisma \
  --output json \
  | jq -r '.')
info "DATABASE_URL obtained from Neon"
echo ""

# ── 4. Generate secrets ───────────────────────────────────────────────────────
log "Generating NEXTAUTH_SECRET..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# ── 5. Vercel — link & set env vars ──────────────────────────────────────────
log "Linking project to Vercel..."
vercel link --yes --repo="$GH_USER/$REPO_NAME" 2>/dev/null \
  || vercel link --yes 2>/dev/null \
  || warn "vercel link had a warning — continuing."

log "Setting Vercel environment variables..."
set_vercel_env() {
  local KEY="$1"
  local VAL="$2"
  for ENV in production preview development; do
    # Remove existing then add fresh (--force not available on all versions)
    vercel env rm "$KEY" "$ENV" --yes 2>/dev/null || true
    printf '%s' "$VAL" | vercel env add "$KEY" "$ENV" 2>/dev/null \
      && info "  set $KEY → $ENV" \
      || warn "  failed to set $KEY → $ENV (check manually)"
  done
}

set_vercel_env "DATABASE_URL"      "$DATABASE_URL"
set_vercel_env "NEXTAUTH_SECRET"   "$NEXTAUTH_SECRET"
# NEXTAUTH_URL will be updated below once we have the deploy URL
echo ""

# ── 6. Deploy to Vercel ───────────────────────────────────────────────────────
log "Deploying to Vercel (production)..."
DEPLOY_OUTPUT=$(vercel --prod --yes 2>&1)
echo "$DEPLOY_OUTPUT"
DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -oE 'https://[a-zA-Z0-9._-]+\.vercel\.app' | tail -1 || true)

if [ -z "$DEPLOY_URL" ]; then
  warn "Could not parse deploy URL — fetching from Vercel..."
  DEPLOY_URL=$(vercel inspect --json 2>/dev/null | jq -r '.alias[0] // empty' | head -1 || true)
  [ -n "$DEPLOY_URL" ] && DEPLOY_URL="https://$DEPLOY_URL"
fi

info "Deploy URL: ${DEPLOY_URL:-unknown}"
echo ""

# ── 7. Set NEXTAUTH_URL now that we know the URL ──────────────────────────────
if [ -n "$DEPLOY_URL" ]; then
  log "Updating NEXTAUTH_URL to $DEPLOY_URL..."
  set_vercel_env "NEXTAUTH_URL" "$DEPLOY_URL"
  echo ""
fi

# ── 8. Run DB migrations on production ───────────────────────────────────────
log "Pushing Prisma schema to Neon..."
DATABASE_URL="$DATABASE_URL" npx prisma db push --accept-data-loss
info "Schema synced"

log "Seeding production database..."
DATABASE_URL="$DATABASE_URL" npx tsx prisma/seed.ts
info "Seed complete"
echo ""

# ── 9. Trigger a fresh redeploy so env vars are picked up ────────────────────
log "Triggering redeploy to apply all env vars..."
vercel redeploy --prod --yes 2>/dev/null || warn "Redeploy failed — trigger manually in Vercel dashboard."
echo ""

# ── Summary ───────────────────────────────────────────────────────────────────
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅  Deployment Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${CYAN}🌐 App${NC}         ${DEPLOY_URL:-check Vercel dashboard}"
echo -e "  ${CYAN}🔐 Admin${NC}       ${DEPLOY_URL:-<url>}/admin"
echo -e "  ${CYAN}👤 Login${NC}       admin@hotel.com / admin123"
echo -e "  ${CYAN}🐙 GitHub${NC}      https://github.com/$GH_USER/$REPO_NAME"
echo -e "  ${CYAN}🗄️  Neon${NC}        https://console.neon.tech/app/projects/$PROJECT_ID"
echo ""
echo -e "  ${YELLOW}⚠️  Still needed:${NC}"
echo -e "     • PAYSTACK_SECRET_KEY + NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY"
echo -e "     • SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS"
echo -e "     • STORAGE_* (Cloudflare R2 or AWS S3) for image uploads"
echo -e "     Add these at: https://vercel.com/dashboard → Project → Settings → Env Vars"
echo ""
