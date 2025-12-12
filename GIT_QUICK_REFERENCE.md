# ⚡ Git Quick Reference Card

## 🚨 Before Every Commit - Run These!

```bash
# 1. Check what you're about to commit
git status

# 2. Verify no large/sensitive files
git status | grep -E "(node_modules|venv|\.env)"

# 3. Preview changes
git diff --cached
```

## ✅ Your Repository is Healthy!

- **Tracked files:** 54 (good - no bloat)
- **Repository size:** 604K (tiny - perfect!)
- **.gitignore:** Working correctly ✅
- **No large files:** node_modules, venv properly ignored ✅
- **No secrets:** .env files properly ignored ✅

## 🔧 Common Fixes

### If you see node_modules/venv in git status:
```bash
git rm -r --cached node_modules/ AI/venv/
git commit -m "Remove large directories"
```

### If you see .env files:
```bash
git rm --cached .env AI/.env
git commit -m "Remove sensitive files"
# THEN ROTATE YOUR API KEYS!
```

### Check if .gitignore is working:
```bash
git check-ignore node_modules/ AI/venv/ .env
```

## 📋 Standard Workflow

```bash
cd "/Users/ankursura/Desktop/Git Upload/Smart Stay"
git status                    # Check status
git add .                     # Stage changes
git status                    # Verify what's staged
git commit -m "Your message"  # Commit
git push origin main          # Push
```

## 🎯 Remember

1. **Always check `git status` before committing**
2. **Never commit `.env` files**
3. **Never commit `node_modules/` or `venv/`**
4. **Use quotes for paths with spaces**

---

📖 **Full guide:** See `GIT_BEST_PRACTICES.md` for detailed information.

