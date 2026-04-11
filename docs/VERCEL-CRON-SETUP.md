# Vercel Cron Setup Guide

## Overview

This guide explains how to enable Vercel's built-in cron support for processing background email tasks in TrackMyCash. Vercel Cron is the recommended solution because it's:

- **FREE** (included with all Vercel plans)
- **Native** to Vercel (no external services required)
- **Automatic** (no setup, just deploy)
- **Reliable** (managed by Vercel infrastructure)

## What Is Vercel Cron?

Vercel Cron allows you to schedule serverless functions to run at specific intervals. When you deploy your Next.js app to Vercel, the cron jobs defined in `vercel.json` automatically start executing.

## Current Implementation

The TrackMyCash system now includes:

### 1. **vercel.json** (Project Root)
Defines the cron schedule:
```json
{
  "crons": [
    {
      "path": "/api/cron/process-emails",
      "schedule": "*/1 * * * *"
    }
  ]
}
```

**Schedule Explanation:**
- `*/1 * * * *` = Run every 1 minute
- Format: `minute hour dayOfMonth month dayOfWeek`
- See [Cron Syntax Guide](#cron-syntax) below

### 2. **Cron Route Handler** (`app/api/cron/process-emails/route.ts`)
Processes pending email tasks every minute:
- ✅ Verifies `CRON_SECRET` for security
- ✅ Calls `transactionEmailService.processPendingEmailTasks()`
- ✅ Sets 60-second timeout (Vercel Pro default)
- ✅ Logs all activity
- ✅ Returns JSON response with results

## Installation & Configuration

### Step 1: Verify Files Are In Place

Ensure these files exist in your project:

```
vercel.json                              (project root)
app/api/cron/process-emails/route.ts    (new file)
```

**Check they exist:**
```bash
# On Windows
dir vercel.json
dir app\api\cron\process-emails\route.ts

# On Mac/Linux
ls vercel.json
ls app/api/cron/process-emails/route.ts
```

### Step 2: Set Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your TrackMyCash project
3. Click **Settings** → **Environment Variables**
4. Add the following variable:

| Variable Name | Value | Scope |
|---|---|---|
| `CRON_SECRET` | Generate a strong random string (see instructions below) | Production |

**How to generate a secure secret:**

**Windows PowerShell** (✅ WORKING):
```powershell
(1..44 | ForEach-Object { [char](Get-Random -Min 33 -Max 127) }) -join ''
```

**Mac/Linux**:
```bash
openssl rand -base64 32 | tr -d '='
```

**Or use an online generator:** https://www.uuidgenerator.net/

### Step 3: Redeploy Your Project

1. Commit the changes to Git:
   ```bash
   git add vercel.json app/api/cron/process-emails/route.ts .env.example
   git commit -m "feat: add Vercel Cron for automated email task processing"
   git push
   ```

2. Vercel automatically deploys and activates cron jobs
3. Check deployment logs to confirm cron is running

### Step 4: Verify Cron Is Running

#### View Cron Logs in Vercel Dashboard

1. Go to Vercel Dashboard → Your Project
2. Click **Deployments**
3. Select the latest deployment
4. Go to **Functions** tab
5. Look for `process-emails` function
6. Check the invocation timeline and logs

#### Test Cron Endpoint Manually

```bash
curl -X POST https://your-vercel-url.vercel.app/api/cron/process-emails \
  -H "Authorization: Bearer your-cron-secret"
```

**Success response (200):**
```json
{
  "success": true,
  "message": "Email tasks processed successfully",
  "processed": 2,
  "failed": 0,
  "timestamp": "2025-01-09T10:30:45.123Z"
}
```

**Unauthorized response (401):**
```json
{
  "error": "Unauthorized"
}
```

#### Health Check Endpoint

```bash
curl -X GET https://your-vercel-url.vercel.app/api/cron/process-emails \
  -H "Authorization: Bearer your-cron-secret"
```

## Cron Syntax Reference

The schedule uses standard UNIX cron syntax:

```
┌───────────── minute (0-59)
│ ┌───────────── hour (0-23)
│ │ ┌───────────── day of month (1-31)
│ │ │ ┌───────────── month (1-12)
│ │ │ │ ┌───────────── day of week (0-6, Sunday is 0)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

### Common Schedules

| Schedule | Meaning |
|---|---|
| `*/1 * * * *` | Every 1 minute |
| `*/5 * * * *` | Every 5 minutes |
| `*/15 * * * *` | Every 15 minutes |
| `0 * * * *` | Every hour at minute 0 |
| `0 9 * * *` | Daily at 9:00 AM UTC |
| `0 0 * * 0` | Weekly on Sunday at midnight UTC |

To change the schedule, edit `vercel.json` and redeploy.

## How It Works End-to-End

### When a Transaction is Created

1. **User creates transaction** → API creates transaction record
2. **Transaction service queues email** → EmailTask stored in MongoDB with status=PENDING, scheduledFor=now+1min
3. **Every 1 minute, Vercel Cron triggers** → `/api/cron/process-emails` is called
4. **Email processor runs** → Finds all overdue PENDING tasks and sends emails
5. **Email sent** → EmailTask status changed to SENT, sentAt timestamp recorded

### When a Transaction is Updated

1. **User updates transaction** → API updates transaction record
2. **Transaction service queues email** → New EmailTask created with type=UPDATED, previous values included
3. **Cron processes** → Email sent with before/after comparison

### When a Transaction is Deleted

1. **User deletes transaction** → API deletes transaction
2. **Transaction service cancels emails** → Any PENDING EmailTask for this transaction is set to CANCELLED
3. **Transaction service queues deletion email** → EmailTask created with type=DELETED, scheduledFor=now (immediate)
4. **Cron processes** → Deletion email sent immediately, CANCELLED tasks are skipped

## Monitoring & Troubleshooting

### Monitoring Email Tasks

Check pending tasks in MongoDB:

```javascript
// In MongoDB Atlas console:
db.emailtasks.find({ status: 'PENDING' }).pretty()
```

### Common Issues

#### Issue: Cron Not Running

**Check:**
1. `vercel.json` exists in project root
2. Cron secret is set in Vercel environment variables
3. Deployment completed successfully (check Vercel dashboard)
4. Check function logs: Vercel Dashboard → Deployment → Functions → process-emails

#### Issue: 401 Unauthorized Errors

**Solution:**
- Verify `CRON_SECRET` matches exactly in Vercel environment variables
- Ensure the value has no extra spaces or line breaks
- Redeploy after changing environment variables

#### Issue: Email Tasks Not Being Sent

**Check:**
1. Verify SMTP credentials are correct (EMAIL_USER, EMAIL_PASSWORD)
2. Check MongoDB connection (MONGODB_URI)
3. View logs: `app/logs/app.log`
4. Manually check EmailTask collection in MongoDB
5. Test endpoint with curl command above

#### Issue: Timeout Errors

**Cause:** Task processing takes > 60 seconds (Vercel Pro limit)

**Solution:**
1. Increase cron frequency (change schedule to `*/1 * * * *` if not already)
2. Process fewer emails per run (edit `processPendingEmailTasks()` maxTasks)
3. Upgrade Vercel plan for higher limits

### Enable Debug Logging

Edit `app/api/cron/process-emails/route.ts` and view Vercel Function Logs:

1. Vercel Dashboard → Deployments → Select Deployment
2. Go to **Functions** tab
3. Click on `process-emails`
4. View real-time logs

## Free Tier Limits

**Vercel Free Plan:**
- ✅ 10 cron jobs included
- ✅ Up to 10 second timeout per invocation
- ✅ Unlimited monthly executions

**Vercel Pro Plan:**
- ✅ 60 cron jobs
- ✅ Up to 60 second timeout per invocation
- ✅ Unlimited monthly executions

For most applications, Free Plan is sufficient. TrackMyCash uses only 1 cron job!

## Comparison with Other Cron Options

| Feature | Vercel Cron | GitHub Actions | EasyCron |
|---|---|---|---|
| Cost | FREE | FREE | FREE (100/mo) |
| Setup Time | 5 min | 10 min | 5 min |
| Maintenance | 0 | Low | Medium |
| Integration | Native | External | External |
| **Recommended for Vercel Apps** | ⭐⭐⭐ | ⭐⭐ | ⭐ |

## Additional Resources

- [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs)
- [UNIX Cron Syntax Cheat Sheet](https://crontab.guru/)
- [TrackMyCash Email Tasks Overview](./VERCEL-CRON-README.md)

## Support

For issues with:
- **Email system:** See [VERCEL-CRON-README.md](./VERCEL-CRON-README.md)
- **Vercel deployment:** See [Vercel Documentation](https://vercel.com/docs)
