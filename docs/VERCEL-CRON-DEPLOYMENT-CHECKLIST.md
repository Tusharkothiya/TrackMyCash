# Vercel Cron Deployment Checklist

✅ **Status:** Implementation Complete & Ready to Deploy

## What Was Implemented

### Files Created
- ✅ [vercel.json](../vercel.json) - Cron configuration
- ✅ [app/api/cron/process-emails/route.ts](../app/api/cron/process-emails/route.ts) - Cron endpoint handler
- ✅ [.env.example](../.env.example) - Updated with CRON_SECRET documentation

### Code Status
- ✅ No TypeScript errors
- ✅ Proper imports and exports
- ✅ Security: Bearer token authentication
- ✅ Error handling: Graceful failures with logging
- ✅ Backward compatible: No breaking changes to existing code

## Deployment Steps (Follow in Order)

### Step 1: Generate CRON_SECRET (2 minutes)

Choose one method:

**Option A: PowerShell (Windows)** ✅ WORKING
```powershell
(1..44 | ForEach-Object { [char](Get-Random -Min 33 -Max 127) }) -join ''
```

**Option B: Terminal (Mac/Linux)**
```bash
openssl rand -base64 32 | tr -d '='
```

**Option C: Online Generator**
Go to https://www.uuidgenerator.net/ and generate a UUID or use any 32+ character random string

Save this value - you'll need it in Step 2.

---

### Step 2: Add CRON_SECRET to Vercel (2 minutes)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click your **TrackMyCash** project
3. Click **Settings** (top navigation)
4. Click **Environment Variables** (left sidebar)
5. Click **Add New**
   - **Name:** `CRON_SECRET`
   - **Value:** Paste your secret from Step 1
   - **Scope:** Select `Production`
   - Click **Save**

✅ Environment variable added to Vercel.

---

### Step 3: Commit Changes (1 minute)

```bash
git add .
git commit -m "feat: implement Vercel Cron for automated background email processing

- Add vercel.json with cron schedule (every 1 minute)
- Implement /api/cron/process-emails endpoint with security
- Update .env.example with CRON_SECRET documentation"
```

---

### Step 4: Push to Repository (1 minute)

```bash
git push
```

Vercel automatically detects the push and begins deployment.

---

### Step 5: Verify Deployment (2 minutes)

**In Vercel Dashboard:**
1. Go to **Deployments** tab
2. Wait for latest deployment status: **Ready** ✓
3. Note your deployment URL (e.g., `https://track-my-cash.vercel.app`)

**Check Cron Function Logs:**
1. Click the latest deployment
2. Go to **Functions** tab
3. Look for `process-emails` function
4. Verify invocation timeline shows executions every 1 minute

---

### Step 6: Test the Endpoint (Optional but Recommended)

**Health Check (verify it's working):**
```bash
curl -X GET https://YOUR_DEPLOYMENT_URL/api/cron/process-emails \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Replace:
- `YOUR_DEPLOYMENT_URL` - Your Vercel URL from Vercel Dashboard
- `YOUR_CRON_SECRET` - The secret from Step 1

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Vercel Cron endpoint is healthy",
  "timestamp": "2025-01-09T10:30:45.123Z"
}
```

---

### Step 7: Test Complete Email Flow (5 minutes)

Create a test transaction in your app:

1. Log in to TrackMyCash
2. Go to **Transactions**
3. Click **Add Transaction**
4. Fill in details and **Save**
5. Check your email (wait up to 2 minutes for cron execution)
6. Verify email received

---

## Verification Checklist

- [ ] CRON_SECRET generated and saved
- [ ] CRON_SECRET added to Vercel environment variables (Production scope)
- [ ] Changes committed to Git
- [ ] Changes pushed to repository
- [ ] Deployment shows "Ready" status in Vercel
- [ ] Cron function visible in Functions tab
- [ ] (Optional) Health check request successful
- [ ] (Optional) Test transaction email received

---

## How It Works

```
Every 1 minute:
  ├─ Vercel calls /api/cron/process-emails
  ├─ Endpoint verifies CRON_SECRET
  ├─ Fetches pending emails from MongoDB with scheduledFor <= now
  ├─ Sends each email via SMTP (max 100 per run)
  ├─ Updates EmailTask status to SENT
  └─ Returns processed/failed count
```

---

## Troubleshooting

### Cron Not Running

**Check:**
- `vercel.json` exists in project root
- No syntax errors in `vercel.json`
- Deployment completed (shows "Ready")
- Wait 1-2 minutes after deployment

**Fix:**
1. Vercel Dashboard → Latest Deployment → Functions
2. Look for `process-emails` function
3. Check the function log for errors

### 401 Unauthorized Errors

**Check:**
- `CRON_SECRET` value matches exactly (copy from Vercel dashboard)
- No extra spaces or line breaks in the secret
- Authorization header format: `Authorization: Bearer YOUR_SECRET`

**Fix:**
1. Copy exact secret from Vercel Dashboard
2. Redeploy after changing environment variables
3. Try test request again

### Emails Not Sending

**Check:**
- SMTP credentials correct (GOOGLE_APP_PASSWORD_SECRET, etc.)
- MongoDB connection working (test in MongoDB Atlas)
- EmailTask collection populated (query MongoDB)

**Debug:**
1. Check Vercel Function Logs for error messages
2. Query MongoDB for failed tasks: `db.emailtasks.find({ status: 'FAILED' })`
3. Check app logs: `app/logs/app.log`

---

## Summary

You now have a **production-ready, fully automated email system**:

- ✅ Transactions create/update/delete emails automatically
- ✅ Vercel Cron processes emails every 1 minute (configurable)
- ✅ Deleted transactions immediately cancel pending emails
- ✅ Built-in retry logic (3 attempts with 5-min intervals)
- ✅ Zero additional cost (included with Vercel)
- ✅ No external service dependencies
- ✅ Fully logged and monitored
- ✅ Production-ready for Vercel deployment

**Total Setup Time:** ~10 minutes

---

**Questions?** See [VERCEL-CRON-README.md](./VERCEL-CRON-README.md) or visit [Vercel Docs](https://vercel.com/docs/cron-jobs)
