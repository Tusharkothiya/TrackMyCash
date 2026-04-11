# Quick Start: Vercel Cron Setup (RECOMMENDED)

> 🚀 **TL;DR:** Add `CRON_SECRET` to Vercel, deploy, and you're done! Cron runs automatically.

## What You Need

- TrackMyCash deployed on Vercel
- `vercel.json` in project root ✅ (already created)
- `app/api/cron/process-emails/route.ts` ✅ (already created)
- `CRON_SECRET` environment variable (3 minutes to add)

## Setup Steps (5 minutes)

### 1. Generate a Secure Secret

**Windows PowerShell (✅ WORKING):**
```powershell
(1..44 | ForEach-Object { [char](Get-Random -Min 33 -Max 127) }) -join ''
```

**Mac/Linux:**
```bash
openssl rand -base64 32 | tr -d '='
```

**Or use this online:** https://www.uuidgenerator.net/

Save the output string.

### 2. Add Secret to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your TrackMyCash project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
   - **Name:** `CRON_SECRET`
   - **Value:** Paste your generated secret
   - **Scope:** Production
5. Click **Save**

### 3. Deploy

```bash
git add .
git commit -m "feat: implement Vercel Cron for emails"
git push
```

Vercel automatically deploys and activates cron! ✅

### 4. Verify It's Working (optional)

After deployment, wait 1-2 minutes and check:

1. **Vercel Dashboard** → Deployments → Latest → Functions tab
   - Look for `process-emails`
   - Check invocation timeline

2. **Manual test:**
   ```bash
   curl -X POST https://your-vercel-url.vercel.app/api/cron/process-emails \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

   Expected response:
   ```json
   {
     "success": true,
     "message": "Email tasks processed successfully",
     "processed": 0,
     "failed": 0,
     "timestamp": "2025-01-09T10:30:45.123Z"
   }
   ```

## How It Works

```
Every 1 minute:
  Vercel calls → /api/cron/process-emails
       ↓
  Verifies CRON_SECRET
       ↓
  Processes pending emails from MongoDB
       ↓
  Sends emails (100 max per run)
       ↓
  Updates EmailTask status to SENT
```

## That's It!

You now have:
- ✅ Automatic email processing every 1 minute
- ✅ No external services needed
- ✅ Zero additional cost
- ✅ Managed by Vercel infrastructure
- ✅ Automatic retries on failure

## What Happens Next

When a user creates a transaction:
1. **Minute 0:** Transaction created, email queued
2. **Minute 1:** Cron runs, email sent

When a user deletes a transaction:
1. **Immediately:** Pending email cancelled
2. **Within 1 minute:** Deletion email sent

## Troubleshooting

### Emails not sending?

1. Check MongoDB is accessible
2. Check SMTP credentials (EMAIL_FROM_ADDRESS, etc.)
3. View logs: Vercel Dashboard → Deployments → Functions → process-emails

### Cron not running?

1. Verify `vercel.json` exists in project root
2. Verify `CRON_SECRET` is set (no typos, no spaces)
3. Check deployment completed successfully
4. Wait 1-2 minutes after deployment

### 401 Errors?

- Make sure `CRON_SECRET` matches exactly
- Check for extra spaces or line breaks
- Redeploy after changing environment variables

## Need More Info?

- Full setup guide: [VERCEL-CRON-DEPLOYMENT-CHECKLIST.md](./VERCEL-CRON-DEPLOYMENT-CHECKLIST.md)
- Complete reference: [VERCEL-CRON-README.md](./VERCEL-CRON-README.md)

---

**Status:** ✅ Ready to use
**Cost:** FREE (included with Vercel)
**Maintenance:** None (Vercel handles everything)
