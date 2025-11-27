# GitHub Actions & Dependabot Setup Guide

This guide explains how to activate GitHub Actions workflows, enable Dependabot, and configure secrets for your repository.

## 1. Activate GitHub Actions Workflows

### Automatic Activation

GitHub Actions workflows are **automatically activated** when you push the workflow files to your repository. Since we've already created the workflows, they should start working automatically.

### Verify Activation

1. Go to your GitHub repository: `https://github.com/lazbutton/nextjs-fullstack-starter`
2. Click on the **"Actions"** tab in the top navigation
3. You should see the workflows listed:
   - **CI** - Main workflow for checks
   - **PR Checks** - PR quality checks
   - **Auto-merge Dependabot** - Optional auto-merge

### Test the Workflows

1. Create a test branch:
   ```bash
   git checkout -b test/workflows
   git push origin test/workflows
   ```

2. Create a Pull Request from this branch to `main`

3. Go to the **"Actions"** tab and you should see the workflows running:
   - CI workflow should run automatically
   - PR Checks workflow should run when PR is created

4. Check the workflow status:
   - Green checkmark ✅ = All checks passed
   - Red X ❌ = Some checks failed (check the logs)

### Workflow Status on PRs

Once activated, you'll see status checks on your Pull Requests:
- ✅ All checks must pass before merging (if branch protection is enabled)
- Click on the status to see detailed logs

## 2. Enable Dependabot

### Step 1: Enable in GitHub Settings

1. Go to your repository on GitHub: `https://github.com/lazbutton/nextjs-fullstack-starter`
2. Click on **"Settings"** tab (top navigation)
3. In the left sidebar, click on **"Security"**
4. Scroll down to **"Code security and analysis"** section
5. Find **"Dependabot alerts"** and click **"Enable"**
   - This enables security alerts for vulnerable dependencies
6. Find **"Dependabot version updates"** and click **"Enable"**
   - This enables automatic dependency updates

### Step 2: Verify Configuration

1. Go to the **"Security"** tab in your repository
2. Click on **"Dependabot"** in the left sidebar
3. You should see:
   - **Alerts**: Security vulnerabilities (if any)
   - **Security updates**: PRs created automatically for security fixes
   - **Version updates**: PRs created based on `.github/dependabot.yml`

### Step 3: Configure Notifications (Optional)

1. Go to GitHub Settings → Notifications
2. Configure how you want to be notified about:
   - Dependabot alerts
   - Security updates
   - Dependency updates

### Dependabot Schedule

Based on our configuration in `.github/dependabot.yml`:
- **Updates**: Every Monday at 9:00 AM
- **Limit**: Maximum 5 open PRs at once
- **Grouping**: Dependencies are grouped to reduce PR count

## 3. Configure GitHub Secrets (Optional)

### Why Secrets?

GitHub Secrets store sensitive information that workflows can use. Currently, our workflows use **placeholders** that work for basic builds, but you can add real values for better testing.

### When to Configure Secrets

You should configure secrets if:
- ✅ You want to test with real environment variables
- ✅ You have tests that require actual API keys
- ✅ You want to deploy from GitHub Actions (not recommended, Vercel handles this)

**Note**: Our workflows use placeholders that work for basic build verification, so secrets are **optional**.

### How to Add Secrets

1. Go to your repository on GitHub
2. Click on **"Settings"** tab
3. In the left sidebar, click on **"Secrets and variables"** → **"Actions"**
4. Click on **"New repository secret"** button

5. Add secrets one by one:

   #### Secret 1: `NEXT_PUBLIC_SUPABASE_URL`
   - **Name**: `NEXT_PUBLIC_SUPABASE_APP_URL`
   - **Value**: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
   - Click **"Add secret"**

   #### Secret 2: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Your Supabase anonymous key (from Supabase dashboard)
   - Click **"Add secret"**

   #### Secret 3: `NEXT_PUBLIC_APP_URL`
   - **Name**: `NEXT_PUBLIC_APP_URL`
   - **Value**: Your app URL (e.g., `https://your-app.vercel.app` or `http://localhost:3000`)
   - Click **"Add secret"**

### View Existing Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. You'll see a list of all secrets (values are hidden)
3. You can update or delete secrets here

### Using Secrets in Workflows

Our workflows automatically use secrets if they exist, or fall back to placeholders:

```yaml
env:
  NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co' }}
```

## 4. Enable Branch Protection (Recommended)

Branch protection ensures code quality before merging to `main`:

1. Go to **Settings** → **Branches**
2. Click **"Add branch protection rule"**
3. Configure:
   - **Branch name pattern**: `main`
   - ✅ **Require a pull request before merging**
     - ✅ **Require approvals**: 1 (optional)
   - ✅ **Require status checks to pass before merging**
     - ✅ **Require branches to be up to date before merging**
     - Select the required checks:
       - `lint-and-typecheck`
       - `build`
   - ✅ **Do not allow bypassing the above settings** (optional, for admins)
4. Click **"Create"**

Now, all PRs must pass CI checks before merging!

## 5. Verify Everything Works

### Test Checklist

- [ ] Create a test PR and verify CI runs automatically
- [ ] Verify PR Checks workflow runs
- [ ] Check that status checks appear on the PR
- [ ] Verify Dependabot is enabled in Security tab
- [ ] Wait for Monday to see Dependabot PRs (or manually trigger)
- [ ] (Optional) Add secrets and verify they're used in workflows

### Manual Dependabot Trigger (Testing)

If you want to test Dependabot immediately:

1. Go to **Actions** tab
2. Click on **"Dependabot version updates"** workflow
3. Click **"Run workflow"** button (if available)
   - Note: Dependabot usually runs automatically on schedule

Or trigger via API:
```bash
# Requires GitHub CLI
gh workflow run "Dependabot version updates"
```

## Troubleshooting

### Workflows Not Running

**Problem**: Workflows don't appear or don't run

**Solutions**:
1. Check that workflow files are in `.github/workflows/`
2. Verify YAML syntax is correct
3. Check repository Actions are enabled:
   - Settings → Actions → General
   - Ensure "Allow all actions and reusable workflows" is selected

### Dependabot Not Creating PRs

**Problem**: Dependabot isn't creating update PRs

**Solutions**:
1. Verify Dependabot is enabled (Settings → Security)
2. Check `.github/dependabot.yml` syntax
3. Wait for the scheduled time (Monday 9 AM)
4. Check if you already have 5 open Dependabot PRs (limit)

### Secrets Not Working

**Problem**: Secrets aren't being used in workflows

**Solutions**:
1. Verify secret names match exactly (case-sensitive)
2. Check workflow YAML uses `secrets.SECRET_NAME`
3. Ensure secrets are added to the correct repository

## Summary

✅ **GitHub Actions**: Automatically active, no setup needed  
✅ **Dependabot**: Enable in Settings → Security  
✅ **Secrets**: Optional, add in Settings → Secrets and variables  
✅ **Branch Protection**: Recommended, configure in Settings → Branches

## Next Steps

1. Create a test PR to verify workflows work
2. Enable Dependabot for automatic dependency updates
3. (Optional) Add secrets for better CI testing
4. Enable branch protection for code quality

Your CI/CD setup is now complete! 🚀

