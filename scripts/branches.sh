#!/usr/bin/env bash
# Zet de workshop-branches op de juiste commit van main (commits beginnen met "<branch>: ").
# Elk blok heeft een beginsituatie en een oplossing; "solution" is een alias van 07-solution.
# Met --check: per branch installeren, typechecken, testen en de dev-server starten.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

BRANCHES=(01-start 01-solution 02-state 02-solution 03-effects 03-solution 04-routing 04-solution 05-bestellen 05-solution 06-testing 06-solution 07-bundling 07-solution)

for branch in "${BRANCHES[@]}"; do
  sha=$(git log main -n 1 --format=%H --grep="^${branch}: ")
  if [[ -z "$sha" ]]; then
    echo "Geen commit gevonden voor $branch" >&2
    exit 1
  fi
  if [[ "$(git branch --show-current)" == "$branch" ]]; then
    echo "Je staat op $branch: wissel eerst naar main" >&2
    exit 1
  fi
  git branch -f "$branch" "$sha"
  echo "$branch -> $(git log -1 --format='%h %s' "$sha")"
done

if [[ "$(git branch --show-current)" == "solution" ]]; then
  echo "Je staat op solution: wissel eerst naar main" >&2
  exit 1
fi
git branch -f solution 07-solution
echo "solution -> 07-solution"

[[ "${1:-}" == "--check" ]] || exit 0

work="$(mktemp -d)"
trap 'git worktree remove --force "${work:?}/wt" >/dev/null 2>&1 || true; rm -rf "${work:?}"' EXIT

for branch in "${BRANCHES[@]}"; do
  echo "== $branch"
  git worktree add --detach "$work/wt" "$branch" >/dev/null 2>&1
  (
    cd "$work/wt"
    npm ci --no-audit --no-fund >/dev/null 2>&1
    npx tsc -b
    npx vitest run >/dev/null
    npx vite --port 5199 --strictPort >/dev/null 2>&1 &
    server=$!
    for _ in $(seq 1 40); do
      curl -s -o /dev/null http://localhost:5199/ && break
      sleep 0.5
    done
    curl -s -o /dev/null -f http://localhost:5199/
    kill "$server"
  )
  echo "   installeren, typecheck, tests en dev-server: OK"
  git worktree remove --force "$work/wt"
done
