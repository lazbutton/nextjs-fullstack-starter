# Protected Branch Workflow

This guide explains how to work with protected branches (like `main`) that require pull requests.

## Understanding Protected Branches

When a branch is protected:
- ❌ You **cannot** push directly to it
- ✅ You **must** create a Pull Request (PR)
- ✅ All status checks must pass before merging

## Standard Workflow

### 1. Create a Feature Branch

```bash
# Create and switch to a new branch
git checkout -b fix/your-fix-name
# or
git checkout -b feat/your-feature-name
```

### 2. Make Your Changes

Make your code changes, commit them:

```bash
git add .
git commit -m "fix: description of your changes"
```

### 3. Push Your Branch

```bash
git push -u origin fix/your-fix-name
```

### 4. Create a Pull Request

#### Option A: Using GitHub CLI (Recommended)

```bash
gh pr create --title "fix: description" --body "Detailed description" --base main
```

#### Option B: Using GitHub Web Interface

1. Go to your repository on GitHub
2. You'll see a banner "Compare & pull request" - click it
3. Or go to **"Pull requests"** tab → **"New pull request"**
4. Select your branch → Click **"Create pull request"**
5. Fill in title and description → Click **"Create pull request"**

### 5. Wait for CI Checks

- GitHub Actions will run automatically
- Wait for all checks to pass (green ✅)
- Check the "Checks" tab on your PR if there are issues

### 6. Merge the PR

Once all checks pass:
- Click **"Merge pull request"** on GitHub
- Choose merge method (squash, merge, or rebase)
- Click **"Confirm merge"**

## Quick Reference

```bash
# Full workflow example
git checkout -b fix/eslint-errors
git add .
git commit -m "fix: resolve ESLint errors"
git push -u origin fix/eslint-errors
gh pr create --title "fix: resolve ESLint errors" --base main
```

## Troubleshooting

### "Protected branch update failed"

**Problem**: You tried to push directly to `main`

**Solution**: Create a branch and PR instead (see workflow above)

### "Required status checks are expected"

**Problem**: CI checks haven't run yet or are failing

**Solution**:
1. Wait a few minutes for checks to complete
2. Check the PR "Checks" tab for details
3. Fix any failing checks before merging

### "Changes must be made through a pull request"

**Problem**: Direct push to protected branch

**Solution**: Use the branch + PR workflow

## Bypassing Protection (Not Recommended)

If you're an admin and need to bypass (not recommended):
1. Temporarily disable branch protection
2. Push your changes
3. Re-enable protection

**Better approach**: Always use PRs, even for small fixes.

## Benefits of This Workflow

✅ Code review opportunity  
✅ Automatic CI checks  
✅ History of changes  
✅ Easy rollback if needed  
✅ Team collaboration  

