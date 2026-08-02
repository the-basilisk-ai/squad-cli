# Secret scanning

Secret scanning is a detective control on this repository: gitleaks scans every
pull request before it merges and everything that has landed on `main` once a day,
and a husky pre-commit hook catches most leaks before they leave a laptop. The same
setup runs in `squidge` and `squad-mcp`. The comparison against TruffleHog and the
reasoning behind choosing gitleaks live in `squidge` at
`docs/security/secret-scanning.md`.

## How it runs

`.github/workflows/secret-scan.yml` runs on pull requests, on a daily schedule,
and on demand through `workflow_dispatch`.

Every commit in this repository was scanned in full once, and the result is
recorded below. That is the baseline. Because `main` is protected against
force-pushes and history therefore cannot change underneath us, routine runs only
need to look at new commits.

A pull request run scans `base..head`, the commits the pull request adds. The
daily run scans `--all --since=7.days`, a rolling week of commits across every
ref, which gives every commit seven chances to be seen and catches anything that
reached a branch without going through the gate. Neither window needs any state
committed to the repository.

A full rescan is one click: dispatch the workflow with `full_history` set. Do that
after a gitleaks upgrade, because a clean baseline under one rule set is not a
clean baseline under the next one.

Each run uploads a redacted JSON report as an artifact with 90-day retention, and
writes rule, location, commit, author and fingerprint to the job summary.
`--redact=100` means no secret value reaches the log or the report.

The husky `pre-commit` hook runs `gitleaks git --staged` over staged changes only.
It is a preventive control that costs a few tens of milliseconds; it does not
replace the CI job, which is what actually blocks a merge. The hook skips with a
warning if gitleaks is not on `PATH`. `nix develop` provides it.

## The baseline

`gitleaks git --log-opts="--all"` with gitleaks 8.30.1, over every ref up to
`5ab5bb95`, on 2026-08-02. No findings, so `.gitleaksignore` is empty.

## When the scan fires

**A pull request check fails.** The author and reviewers see the failed Secret
Scan check. Read the job summary, not the raw log: it lists the rule, the file and
line, the commit and the fingerprint, and never the value.

**The scheduled run fails.** GitHub notifies whoever last changed the workflow
file. There is no Slack alert wired up for this yet, so a red daily run needs
someone to be watching Actions.

**Then, in order:**

1. Treat it as a suspected compromise until proven otherwise. A credential in a
   git object is readable by anyone who has ever cloned the repository, and
   deleting the line does not remove it from history.
2. Tell the CTO. Rotation is their call, and it happens before anything else.
   Rotate at the provider, then confirm the old value is dead.
3. Check for use. Look at the provider's audit log for the exposure window, which
   starts at the commit date shown in the summary.
4. Only once the credential is dead, decide what to do about the history. Removing
   it means a rewrite, which breaks every existing clone, so it is a deliberate
   decision rather than a reflex.
5. Record what happened. An auditor will ask how we found it, when we rotated and
   what the exposure was.

Never resolve a real finding by adding an allowlist entry.

## Adding an allowlist entry

Only for a confirmed false positive: a value that is not a credential, or one
that cannot authenticate to anything.

Copy the fingerprint from the job summary into `.gitleaksignore`, with a comment
above it giving your name, the date and why the value is harmless. Push it in the
pull request that the finding blocked, so the justification is reviewed by someone
who is not you.

```
# steven 2026-08-02: sample response body in a test fixture, the token field is a
# hand-written placeholder and authenticates to nothing.
1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b:src/__fixtures__/response.json:generic-api-key:12
```

A fingerprint pins one rule to one line of one commit, so an entry cannot hide a
different finding. Reject an entry with no justification, and reject a path or
regex allowlist. If a whole directory is noisy, the fix is a narrower rule, not a
blanket exclusion.

## Upgrading gitleaks

`GITLEAKS_VERSION` and `GITLEAKS_SHA256` in the workflow are bumped together. The
checksum is the `linux_x64` line of `gitleaks_<version>_checksums.txt` on the
release. Dependabot does not track this pin, so it needs a periodic look. After a
bump, dispatch with `full_history` and record the result above.
