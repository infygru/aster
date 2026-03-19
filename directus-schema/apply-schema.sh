#!/usr/bin/env bash
# ============================================================
# Aster Homecare — Directus Schema + Seed Setup Script (Bash)
# Usage: bash directus-schema/apply-schema.sh
# ============================================================

set -euo pipefail

DIRECTUS_URL="${DIRECTUS_URL:-http://localhost:8055}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@asterhomecare.co.uk}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-AsterAdmin2024!}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo ""
echo "========================================"
echo "  Aster Homecare — Directus Setup"
echo "========================================"
echo ""

# ── Step 1: Wait for Directus ─────────────────────────────────────────────────
echo "Waiting for Directus to start..."
attempt=0
until curl -sf "$DIRECTUS_URL/server/health" | grep -q '"status":"ok"'; do
    attempt=$((attempt + 1))
    if [ "$attempt" -ge 30 ]; then
        echo "ERROR: Directus did not become healthy after 30 attempts." >&2
        exit 1
    fi
    echo "  Attempt $attempt/30 — waiting 5s..."
    sleep 5
done
echo "✓ Directus is healthy."

# ── Step 2: Authenticate ──────────────────────────────────────────────────────
echo ""
echo "Authenticating..."
TOKEN=$(curl -sf -X POST "$DIRECTUS_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
    | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['access_token'])")
echo "✓ Authenticated."

# ── Step 3: Apply Schema ──────────────────────────────────────────────────────
echo ""
echo "Applying schema snapshot..."
DIFF=$(curl -sf -X POST "$DIRECTUS_URL/schema/diff" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d @"$SCRIPT_DIR/schema-snapshot.json")

CHANGE_COUNT=$(echo "$DIFF" | python3 -c "
import sys, json
d = json.load(sys.stdin).get('data', {})
print(len(d.get('collections',[])) + len(d.get('fields',[])))
" 2>/dev/null || echo "0")

if [ "$CHANGE_COUNT" -eq "0" ]; then
    echo "  Schema is already up to date."
else
    DIFF_DATA=$(echo "$DIFF" | python3 -c "import sys,json; print(json.dumps(json.load(sys.stdin)['data']))")
    curl -sf -X POST "$DIRECTUS_URL/schema/apply" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "$DIFF_DATA" > /dev/null
    echo "✓ Schema applied ($CHANGE_COUNT changes)."
fi

# ── Step 4: Set static API token ──────────────────────────────────────────────
echo ""
echo "Setting static API token..."
curl -sf -X PATCH "$DIRECTUS_URL/users/me" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"token":"aster-nextjs-static-token-change-in-production"}' > /dev/null
echo "✓ Static token set."

# ── Step 5: Public read permissions ───────────────────────────────────────────
echo ""
echo "Setting public read permissions..."
for collection in services testimonials job_openings team; do
    curl -sf -X POST "$DIRECTUS_URL/permissions" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"role\":null,\"collection\":\"$collection\",\"action\":\"read\",\"fields\":\"*\",\"permissions\":{},\"validation\":{}}" > /dev/null 2>&1 || true
    echo "  ✓ Public read set: $collection"
done

# ── Step 6: Seed Data ──────────────────────────────────────────────────────────
echo ""
echo "Seeding collections..."
python3 - <<EOF
import json, urllib.request, urllib.error

token = "$TOKEN"
base = "$DIRECTUS_URL"
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

with open("$SCRIPT_DIR/seed-data.json") as f:
    seed = json.load(f)

for collection, items in seed.items():
    # Check existing count
    req = urllib.request.Request(
        f"{base}/items/{collection}?aggregate[count]=*",
        headers=headers
    )
    try:
        with urllib.request.urlopen(req) as r:
            data = json.load(r)
        count = int(data["data"][0].get("count", 0))
        if count > 0:
            print(f"  Skipping '{collection}' — already has {count} record(s).")
            continue
    except Exception as e:
        print(f"  Warning checking {collection}: {e}")

    for item in items:
        body = json.dumps(item).encode()
        req = urllib.request.Request(
            f"{base}/items/{collection}",
            data=body,
            headers=headers,
            method="POST"
        )
        try:
            urllib.request.urlopen(req)
        except Exception as e:
            print(f"  Warning seeding {collection}: {e}")
    print(f"  ✓ Seeded {len(items)} record(s) into '{collection}'.")
EOF

# ── Step 7: Write .env.local ───────────────────────────────────────────────────
echo ""
ENV_FILE="$PROJECT_ROOT/.env.local"
if [ ! -f "$ENV_FILE" ]; then
    cat > "$ENV_FILE" <<ENVFILE
NEXT_PUBLIC_DIRECTUS_URL=$DIRECTUS_URL
DIRECTUS_TOKEN=aster-nextjs-static-token-change-in-production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
ENVFILE
    echo "✓ .env.local created."
else
    echo "  .env.local already exists — not overwriting."
fi

# ── Done ───────────────────────────────────────────────────────────────────────
echo ""
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "Directus Admin:  $DIRECTUS_URL/admin"
echo "Email:           $ADMIN_EMAIL"
echo "Password:        $ADMIN_PASSWORD"
echo ""
echo "Next: npm run dev  →  http://localhost:3000"
echo ""
echo "IMPORTANT: Change admin password and token before production!"
echo ""
