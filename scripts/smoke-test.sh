#!/usr/bin/env bash
#
# Smoke test: exercises the CLI command surface against dev.
# Requires: already logged in via `squad auth login --env=dev`.
#
# Usage: ./scripts/smoke-test.sh <org-id> <workspace-id>
#
# Note: the new Squad platform derives insights/actions/clusters from ingested
# signals asynchronously, and goals/documents have no delete mutation, so this
# test leans on reads plus a few safe writes (signal ingest is cleaned up via
# dismiss; a created goal/document persists on the dev workspace).
#
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <org-id> <workspace-id>" >&2
  exit 1
fi

CLI="node $(dirname "$0")/../dist/cli.js"
ENV="--env=dev"
ORG="$1"
WS="$2"

pass=0
fail=0
failed_cmds=()
SIGNAL_ID=""

run() {
  local desc="$1"; shift
  printf "%-45s " "$desc"
  if output=$("$@" 2>&1); then
    echo "PASS"
    pass=$((pass + 1))
  else
    echo "FAIL"
    echo "  $output" | head -5
    fail=$((fail + 1))
    failed_cmds+=("$desc")
  fi
}

first_signal_id() {
  echo "$output" | grep -o '"ids"[[:space:]]*:[[:space:]]*\[[[:space:]]*"[^"]*"' \
    | head -1 | sed 's/.*"\([^"]*\)"$/\1/' || true
}

cleanup() {
  echo ""
  echo "=== Cleanup ==="
  [[ -n "$SIGNAL_ID" ]] && run "signal dismiss" $CLI $ENV signal dismiss "$SIGNAL_ID" --reason "smoke test"
}
trap cleanup EXIT

echo "=== Squad CLI smoke test (dev) ==="

# Basics + auth
run "version"              $CLI --version
run "help"                 $CLI --help
run "auth status"          $CLI $ENV auth status

# Workspace targeting
run "workspace list"       $CLI $ENV workspace list
run "workspace select"     $CLI $ENV workspace select "$ORG" "$WS"
run "workspace overview"   $CLI $ENV workspace overview
run "workspace members"    $CLI $ENV workspace members

# Reads across the evidence chain
run "signal list"          $CLI $ENV signal list --limit 5
run "cluster list"         $CLI $ENV cluster list --limit 5
run "insight list"         $CLI $ENV insight list --limit 5
run "action list"          $CLI $ENV action list --limit 5
run "goal list"            $CLI $ENV goal list
run "research list"        $CLI $ENV research list --limit 5
run "document list"        $CLI $ENV document list --limit 5
run "brief list"           $CLI $ENV brief list --limit 5
run "integration list"     $CLI $ENV integration list
run "activity list"        $CLI $ENV activity list --limit 5
run "search"               $CLI $ENV search "onboarding"

# Writes
run "signal ingest"        $CLI $ENV signal ingest --content "Users want dark mode" --source api --title "Smoke test"
SIGNAL_ID=$(first_signal_id)
run "goal create"          $CLI $ENV goal create --title "Smoke test goal" --description "Improve retention" --importance 2

echo ""
echo "=== Results ==="
echo "Passed: $pass"
echo "Failed: $fail"
if [[ ${#failed_cmds[@]} -gt 0 ]]; then
  echo "Failed commands:"
  for cmd in "${failed_cmds[@]}"; do
    echo "  - $cmd"
  done
  exit 1
fi
