# subscribe-email-resend-worker

Cloudflare Worker for email subscription relay. Routes subscribe requests to GitHub Actions `repository_dispatch` to trigger the email subscription workflow.

## What it does

1. Receives `POST` requests with `{ email: "user@example.com" }` from the frontend
2. Validates email format
3. Triggers a `repository_dispatch` event on `xi7ang/xi7ang.github.io`
4. Returns `{ success: true }` or `{ success: false, error: "..." }`

## Environment Variables

Set in Cloudflare Workers dashboard → Settings → Variables:

| Variable | Value |
|----------|-------|
| `GITHUB_TOKEN` | GitHub Personal Access Token with `repo` scope |

## Worker Endpoint

```
POST https://subscribe-email-resend-worker.wsheng-980210.workers.dev/
Content-Type: application/json

{ "email": "user@example.com" }
```

## Deployment

```bash
wrangler deploy
```

Or deploy manually via [Cloudflare Workers Dashboard](https://dash.cloudflare.com/).

## Related

- [xi7ang/xi7ang.github.io](https://github.com/xi7ang/xi7ang.github.io) — frontend with subscription form
- [xi7ang/xi7ang.github.io/.github/workflows/subscribe.yml](https://github.com/xi7ang/xi7ang.github.io/blob/main/.github/workflows/subscribe.yml) — downstream workflow