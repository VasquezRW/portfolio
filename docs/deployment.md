# Deployment and repository setup

## Pipelines

| Workflow                                  | Trigger                                | Steps                                                                                                          |
| ----------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `.github/workflows/ci.yml` → job `ci`     | Pull request, push to `main`           | install → lint → `astro check` → unit tests → build → Playwright e2e + axe → (on `main`) upload Pages artifact |
| `.github/workflows/ci.yml` → job `deploy` | Push to `main`, only after `ci` passes | deploy the built artifact to GitHub Pages                                                                      |
| Dependabot                                | Weekly                                 | Update npm packages and GitHub Actions                                                                         |

## Secrets

**None are required.** The deploy workflow uses the automatic `GITHUB_TOKEN` with `pages: write` and `id-token: write` permissions declared in the workflow file.

Optional, only if added later: a contact form service key as a repository **variable** (`PUBLIC_FORM_KEY`).

## Manual setup with GitHub CLI

Requires [`gh`](https://cli.github.com/) ≥ 2.40 on the host (`winget install GitHub.cli`); it is the only host tool besides Docker and Git. Run from the repository root.

### 1. Authenticate

```bash
gh auth login            # GitHub.com → HTTPS → login with browser
gh auth status
```

Values for this repository: account `VasquezRW`, repository `VasquezRW/portfolio`, domain `wilmervasquez.page` (registered at name.com through the Student Pack on the institutional GitHub account; the domain belongs to the name.com account, so it can serve Pages for any GitHub account, and Pages on public repositories needs no Pro plan).

Run the steps in this order: Pages must exist before the first push, otherwise the first `deploy` job fails.

### 2. Create the repository (without pushing yet)

```bash
git init -b main
gh repo create VasquezRW/portfolio --public --source=. --remote=origin \
  --description "Personal portfolio: Astro + Tailwind, bilingual EN/ES" \
  --homepage https://wilmervasquez.page
```

### 3. Enable GitHub Pages with Actions as source and set the domain

```bash
gh api -X POST repos/VasquezRW/portfolio/pages -f build_type=workflow
gh api -X PUT repos/VasquezRW/portfolio/pages -f cname=wilmervasquez.page
gh api repos/VasquezRW/portfolio/pages --jq '{build_type, cname, status}'
```

### 4. Verify the domain for the account (prevents takeover)

GitHub (logged in as **VasquezRW**) → Settings → Pages → _Add a domain_ → `wilmervasquez.page`. It shows a `TXT` record (`_github-pages-challenge-VasquezRW`); add it at name.com (step 5) and press _Verify_.

### 5. DNS at name.com

name.com → My Domains → `wilmervasquez.page` → **Manage DNS Records**. First delete any default/parking `A`, `AAAA` or `CNAME` records, then add (Host empty = apex):

| Type  | Host                                | Answer                    |
| ----- | ----------------------------------- | ------------------------- |
| A     | _(empty)_                           | `185.199.108.153`         |
| A     | _(empty)_                           | `185.199.109.153`         |
| A     | _(empty)_                           | `185.199.110.153`         |
| A     | _(empty)_                           | `185.199.111.153`         |
| AAAA  | _(empty)_                           | `2606:50c0:8000::153`     |
| AAAA  | _(empty)_                           | `2606:50c0:8001::153`     |
| AAAA  | _(empty)_                           | `2606:50c0:8002::153`     |
| AAAA  | _(empty)_                           | `2606:50c0:8003::153`     |
| CNAME | `www`                               | `vasquezrw.github.io`     |
| TXT   | `_github-pages-challenge-VasquezRW` | _(value shown in step 4)_ |

Check propagation (minutes to a few hours):

```bash
nslookup wilmervasquez.page          # the four 185.199.x.153 addresses
nslookup www.wilmervasquez.page      # alias of vasquezrw.github.io
```

`.page` is on the browser HSTS preload list: it **only** works over HTTPS, so the site will not open until GitHub issues the certificate (usually under an hour after DNS resolves).

### 6. First push (you make the commit)

```bash
git add .
git commit -m "feat: first version of the portfolio"
git push -u origin main
gh run watch                          # follow CI + deploy
```

Then enforce HTTPS once the certificate exists:

```bash
gh api repos/VasquezRW/portfolio/pages --jq '.https_certificate.state'   # wait for "approved"
gh api -X PUT repos/VasquezRW/portfolio/pages -F https_enforced=true
```

### 7. Protect `main` (after the first CI run, so the `ci` check exists)

```bash
cat > ruleset.json <<'JSON'
{
  "name": "protect-main",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "pull_request", "parameters": {
        "required_approving_review_count": 0,
        "dismiss_stale_reviews_on_push": false,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_review_thread_resolution": false } },
    { "type": "required_status_checks", "parameters": {
        "strict_required_status_checks_policy": true,
        "required_status_checks": [ { "context": "ci" } ] } }
  ]
}
JSON
gh api -X POST repos/VasquezRW/portfolio/rulesets --input ruleset.json
rm ruleset.json
```

`"context": "ci"` is the job name in `ci.yml`. Approvals are 0 because you are the only maintainer; the PR still has to go green. From now on changes go through branches and PRs.

### 8. Security and housekeeping

```bash
gh api -X PUT repos/VasquezRW/portfolio/vulnerability-alerts
gh api -X PUT repos/VasquezRW/portfolio/automated-security-fixes
gh repo edit VasquezRW/portfolio --delete-branch-on-merge --enable-squash-merge \
  --enable-merge-commit=false --enable-rebase-merge=false \
  --enable-wiki=false --enable-projects=false
gh repo edit VasquezRW/portfolio --add-topic portfolio,astro,tailwindcss,qa-automation
```

The domain is configured in `astro.config.mjs` (`SITE`), `public/CNAME` and `public/robots.txt`; change all three together if it ever changes. The Student Pack domain is free for the first year: check the renewal price at name.com before it expires.

## Day-to-day with gh

```bash
git switch -c feat/projects-section
# ...commit work...
git push -u origin HEAD
gh pr create --fill                 # title/body from commits
gh pr checks --watch                # follow CI
gh pr merge --squash --delete-branch
gh run list --workflow ci.yml       # CI and deployment status
gh run view --log-failed            # inspect a failed run
```

## Rollback

```bash
git switch main && git pull
git switch -c fix/revert-<sha>
git revert <sha>
git push -u origin HEAD && gh pr create --fill
```

Merging the revert redeploys the previous state. Past deployments: `gh api repos/VasquezRW/portfolio/deployments`.
