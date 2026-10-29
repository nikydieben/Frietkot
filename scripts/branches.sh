#!/usr/bin/env bash
# Zet de workshop-branches op de juiste commit van main (commits beginnen met "<branch>: ").
# Met --check: per branch installeren, typechecken, testen en de dev-server starten.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

BRANCHES=(01-start 02-state 03-routing 04-bundling 05-testing 06-finale solution)

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
