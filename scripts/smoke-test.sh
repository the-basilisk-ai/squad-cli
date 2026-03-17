#!/usr/bin/env bash
#
# Smoke test: exercises every CLI command against dev, then cleans up.
# Requires: already logged in via `squad auth login --env=dev`
#
set -euo pipefail

CLI="node $(dirname "$0")/../dist/cli.js"
ENV="--env=dev"
ORG="79a7e62a-8b4d-4324-8a7e-b36a6189e704"
WS="3e563226-fa01-441a-9a55-7c3a616a0617"

pass=0
fail=0
failed_cmds=()

# IDs to clean up
GOAL_ID=""
OPP_ID=""
SOL_ID=""
FEEDBACK_ID=""
INSIGHT_ID=""
KNOWLEDGE_ID=""

run() {
  local desc="$1"; shift
  printf "%-55s " "$desc"
  if output=$("$@" 2>&1); then
    echo "✅"
    pass=$((pass + 1))
  else
    echo "❌"
    echo "  $output" | head -5
    fail=$((fail + 1))
    failed_cmds+=("$desc")
  fi
}

# Extract .id from JSON output
get_id() {
  echo "$output" | grep -o '"id"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"id"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/' || true
}

cleanup() {
  echo ""
  echo "=== Cleanup ==="
  [[ -n "$SOL_ID" ]]       && run "delete solution"   $CLI $ENV solution delete "$SOL_ID"
  [[ -n "$OPP_ID" ]]       && run "delete opportunity" $CLI $ENV opportunity delete "$OPP_ID"
  [[ -n "$GOAL_ID" ]]      && run "delete goal"        $CLI $ENV goal delete "$GOAL_ID"
  [[ -n "$FEEDBACK_ID" ]]  && run "delete feedback"    $CLI $ENV feedback delete "$FEEDBACK_ID"
  [[ -n "$INSIGHT_ID" ]]   && run "delete insight"     $CLI $ENV insight delete "$INSIGHT_ID"
  [[ -n "$KNOWLEDGE_ID" ]] && run "delete knowledge"   $CLI $ENV knowledge delete "$KNOWLEDGE_ID"
}
trap cleanup EXIT

echo "=== Squad CLI Smoke Test (dev) ==="
echo ""

# --- Basics ---
run "version"                  $CLI --version
run "help"                     $CLI --help

# --- Auth ---
run "auth status"              $CLI $ENV auth status

# --- Workspace ---
run "workspace list"           $CLI $ENV workspace list
run "workspace select"         $CLI $ENV workspace select "$ORG" "$WS"
run "workspace get"            $CLI $ENV workspace get

# --- Knowledge CRUD ---
run "knowledge create"         $CLI $ENV knowledge create --title "Smoke test knowledge" --description "Smoke test summary" --content "Test content for smoke test"
KNOWLEDGE_ID=$(get_id)

run "knowledge list"           $CLI $ENV knowledge list
run "knowledge get"            $CLI $ENV knowledge get "$KNOWLEDGE_ID"

# --- Feedback CRUD ---
run "feedback create"          $CLI $ENV feedback create --content "Users want dark mode" --source "cli-smoke-test" --title "Smoke test feedback"
FEEDBACK_ID=$(get_id)

run "feedback list"            $CLI $ENV feedback list
run "feedback get"             $CLI $ENV feedback get "$FEEDBACK_ID"

# --- Insight CRUD ---
run "insight create"           $CLI $ENV insight create --title "Smoke test insight" --description "50% of users drop off at step 3" --type Feedback
INSIGHT_ID=$(get_id)

run "insight list"             $CLI $ENV insight list
run "insight get"              $CLI $ENV insight get "$INSIGHT_ID"

# --- Goal CRUD ---
run "goal create"              $CLI $ENV goal create --title "Smoke test goal" --description "Improve retention by 10%"
GOAL_ID=$(get_id)

run "goal list"                $CLI $ENV goal list
run "goal get"                 $CLI $ENV goal get "$GOAL_ID"
run "goal update"              $CLI $ENV goal update "$GOAL_ID" --description "Improve retention by 15%"
run "goal get w/ relationships" $CLI $ENV goal get "$GOAL_ID" --relationships opportunities,solutions

# --- Opportunity CRUD ---
run "opportunity create"       $CLI $ENV opportunity create --title "Smoke test opportunity" --description "Onboarding drop-off problem"
OPP_ID=$(get_id)

run "opportunity list"         $CLI $ENV opportunity list
run "opportunity get"          $CLI $ENV opportunity get "$OPP_ID"
run "opportunity update"       $CLI $ENV opportunity update "$OPP_ID" --status Planned

# --- Solution CRUD ---
run "solution create"          $CLI $ENV solution create --title "Smoke test solution" --description "Guided onboarding tour"
SOL_ID=$(get_id)

run "solution list"            $CLI $ENV solution list
run "solution get"             $CLI $ENV solution get "$SOL_ID"
run "solution update"          $CLI $ENV solution update "$SOL_ID" --title "Smoke test solution (updated)"
run "solution edit-prd"        $CLI $ENV solution edit-prd "$SOL_ID" --content "# PRD\n\nSmoke test PRD content"
run "solution get w/ rels"     $CLI $ENV solution get "$SOL_ID" --relationships opportunities,outcomes,insights

# --- Relationships ---
run "goal add opp rel"         $CLI $ENV goal relationships "$GOAL_ID" --action add --opportunity-ids "$OPP_ID"
run "opp add sol rel"          $CLI $ENV opportunity relationships "$OPP_ID" --action add --solution-ids "$SOL_ID"
run "sol add opp rel"          $CLI $ENV solution relationships "$SOL_ID" --action add --opportunity-ids "$OPP_ID"
run "opp get w/ relationships" $CLI $ENV opportunity get "$OPP_ID" --relationships solutions,outcomes,insights

# --- Relationship removal ---
run "sol remove opp rel"       $CLI $ENV solution relationships "$SOL_ID" --action remove --opportunity-ids "$OPP_ID"
run "opp remove sol rel"       $CLI $ENV opportunity relationships "$OPP_ID" --action remove --solution-ids "$SOL_ID"
run "goal remove opp rel"      $CLI $ENV goal relationships "$GOAL_ID" --action remove --opportunity-ids "$OPP_ID"

# --- AI features ---
run "opportunity gen solutions" $CLI $ENV opportunity generate-solutions "$OPP_ID"
run "solution prioritise"      $CLI $ENV solution prioritise --solution-ids "$SOL_ID"

# --- Search ---
run "search"                   $CLI $ENV search "onboarding"

# --- Views ---
run "view strategy-context"    $CLI $ENV view strategy-context
run "view roadmap"             $CLI $ENV view roadmap

# Cleanup happens via EXIT trap

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
