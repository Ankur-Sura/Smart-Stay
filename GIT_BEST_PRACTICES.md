# 🛡️ Git Best Practices - How to Avoid Common Issues

This guide will help you avoid common Git problems when working with this project.

## ✅ Current Status

Your repository is properly configured:
- ✅ `.gitignore` is working correctly
- ✅ No large files (node_modules, venv) are tracked
- ✅ No sensitive files (.env) are tracked
- ✅ Repository is clean and ready

---

## 🚨 Common Issues & How to Avoid Them

### 1. **Accidentally Committing Large Files**

**Problem:** `node_modules/` or `AI/venv/` get committed, making the repo huge.

**How to Avoid:**
```bash
# ALWAYS check what you're adding before committing
git status
git add --dry-run .  # Preview what will be added

# If you see node_modules or venv, STOP and check .gitignore
```

**If it happens:**
```bash
# Remove from Git (but keep locally)
git rm -r --cached node_modules/
git rm -r --cached AI/venv/
git commit -m "Remove large directories from Git"
```

---

### 2. **Committing Sensitive Files (.env with API keys)**

**Problem:** API keys get committed and exposed publicly.

**How to Avoid:**
```bash
# ALWAYS check for .env files before committing
git status | grep .env

# If you see .env files, they should NOT be there!
# Verify .gitignore is working:
git check-ignore .env AI/.env
```

**If it happens (URGENT!):**
```bash
# 1. Remove from Git immediately
git rm --cached .env AI/.env

# 2. Commit the removal
git commit -m "Remove sensitive .env files"

# 3. ROTATE YOUR API KEYS immediately!
#    - Generate new keys from OpenAI, Tavily, etc.
#    - Update your local .env file
#    - If already pushed, keys are compromised - change them NOW!
```

---

### 3. **Spaces in Directory Paths**

**Problem:** Your project is in "Git Upload" folder with a space.

**How to Avoid:**
```bash
# ALWAYS use quotes when navigating
cd "/Users/ankursura/Desktop/Git Upload/Smart Stay"

# Or use backslash escaping
cd /Users/ankursura/Desktop/Git\ Upload/Smart\ Stay
```

**Better Solution:** Rename folder to remove spaces:
```bash
mv "/Users/ankursura/Desktop/Git Upload" "/Users/ankursura/Desktop/GitUpload"
```

---

### 4. **File Size Limits (GitHub 100MB limit)**

**Problem:** Single file exceeds 100MB, GitHub rejects it.

**How to Avoid:**
```bash
# Before committing, check for large files
find . -type f -size +50M -not -path "./.git/*" \
  -not -path "./node_modules/*" \
  -not -path "./AI/venv/*"

# If you find large files, add them to .gitignore
```

**If it happens:**
```bash
# Remove large file from Git history (advanced)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/large/file" \
  --prune-empty --tag-name-filter cat -- --all
```

---

### 5. **Pushing to Wrong Branch**

**Problem:** Code pushed to wrong branch or wrong remote.

**How to Avoid:**
```bash
# ALWAYS check current branch and remote
git branch          # Shows current branch
git remote -v       # Shows remote URLs

# Before pushing, verify:
git status
git log --oneline -5
```

---

### 6. **Merge Conflicts**

**Problem:** Conflicts when pulling/pushing.

**How to Avoid:**
```bash
# ALWAYS pull before pushing
git pull origin main
# Resolve any conflicts
git push origin main
```

---

## 📋 Pre-Commit Checklist

**Before EVERY commit, run these checks:**

```bash
# 1. Check what files are staged
git status

# 2. Verify no large directories
git status | grep -E "(node_modules|venv|__pycache__)"

# 3. Verify no sensitive files
git status | grep -E "\.env"

# 4. Check file sizes
git diff --cached --stat

# 5. Preview what will be committed
git diff --cached
```

---

## 🔧 Useful Git Commands

### Check Repository Health
```bash
# See repository size
du -sh .git

# Count tracked files
git ls-files | wc -l

# See largest files in repo
git ls-files | xargs du -h | sort -rh | head -10
```

### Verify .gitignore is Working
```bash
# Check if specific files/dirs are ignored
git check-ignore -v node_modules/ AI/venv/ .env

# Should show output like:
# .gitignore:63:node_modules/	node_modules/
```

### Clean Up Repository
```bash
# Remove untracked files
git clean -n  # Preview
git clean -f  # Actually remove

# Remove ignored files from Git (if accidentally added)
git rm -r --cached node_modules/ AI/venv/
```

---

## 🎯 Recommended Workflow

### Daily Workflow:
```bash
# 1. Navigate to project (with quotes!)
cd "/Users/ankursura/Desktop/Git Upload/Smart Stay"

# 2. Check status
git status

# 3. Pull latest changes (if working with others)
git pull origin main

# 4. Make your changes...

# 5. Review what changed
git diff

# 6. Stage files
git add .

# 7. Verify what's staged (IMPORTANT!)
git status
git diff --cached

# 8. Commit
git commit -m "Descriptive commit message"

# 9. Push
git push origin main
```

---

## 🚀 First Time Setup (For New Projects)

When starting a new project:

1. **Create .gitignore FIRST** (before any commits)
   ```bash
   # Copy from this project or use a generator:
   # https://www.toptal.com/developers/gitignore
   ```

2. **Initialize Git**
   ```bash
   git init
   ```

3. **Verify .gitignore works**
   ```bash
   git check-ignore node_modules/ venv/
   ```

4. **Make initial commit**
   ```bash
   git add .
   git status  # Double-check!
   git commit -m "Initial commit"
   ```

---

## ⚠️ Red Flags - STOP if you see these!

- ❌ `node_modules/` in `git status`
- ❌ `venv/` or `AI/venv/` in `git status`
- ❌ `.env` files in `git status`
- ❌ Files over 50MB being added
- ❌ `__pycache__/` directories
- ❌ `.DS_Store` files (macOS)

**If you see any of these, check your .gitignore!**

---

## 🔐 Security Best Practices

1. **Never commit:**
   - `.env` files
   - API keys
   - Passwords
   - Private keys (`.pem`, `.key` files)
   - Database credentials

2. **Always use:**
   - Environment variables
   - `.env.example` (template without real values)
   - `.gitignore` to exclude sensitive files

3. **If you accidentally commit secrets:**
   - Rotate keys immediately
   - Remove from Git history (see above)
   - Consider using `git-secrets` tool

---

## 📚 Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [.gitignore Generator](https://www.toptal.com/developers/gitignore)
- [GitHub File Size Limits](https://docs.github.com/en/repositories/working-with-files/managing-large-files)

---

## 💡 Pro Tips

1. **Use Git GUI tools** (GitHub Desktop, SourceTree) if command line is confusing
2. **Commit often** with small, logical changes
3. **Write clear commit messages**: "Fix bug" ❌ vs "Fix hotel search filter not working" ✅
4. **Use branches** for new features: `git checkout -b feature-name`
5. **Review before pushing**: `git log --oneline -10` before push

---

**Remember: When in doubt, check `git status` first!** 🎯

