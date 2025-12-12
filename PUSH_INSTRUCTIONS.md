# 🚀 Push to GitHub - Instructions

## Option 1: Use the Helper Script (Easiest)

```bash
./push-to-github.sh
```

The script will:
1. Ask for your GitHub username
2. Ask for your repository name
3. Configure the remote
4. Push your code

---

## Option 2: Manual Push (Step by Step)

### Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `smart-stay` (or your preferred name)
3. **IMPORTANT:** Do NOT initialize with README, .gitignore, or license (we already have these!)
4. Click "Create repository"

### Step 2: Add Remote and Push

Replace `YOUR_USERNAME` and `smart-stay` with your actual values:

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/smart-stay.git

# Verify remote
git remote -v

# Push to GitHub
git push -u origin main
```

### Step 3: Authenticate

If prompted for credentials:
- **Username:** Your GitHub username
- **Password:** Use a Personal Access Token (not your GitHub password)
  - Get token: https://github.com/settings/tokens
  - Create token with `repo` permissions

---

## Option 3: Using SSH (If you have SSH keys set up)

```bash
# Add remote with SSH
git remote add origin git@github.com:YOUR_USERNAME/smart-stay.git

# Push
git push -u origin main
```

---

## 🔍 Verify Your Push

After pushing, check:
- Visit: `https://github.com/YOUR_USERNAME/smart-stay`
- You should see all your files
- Check that `node_modules/` and `AI/venv/` are NOT visible (they're in .gitignore ✅)

---

## ❌ Troubleshooting

### Error: "remote origin already exists"
```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/smart-stay.git
```

### Error: "repository not found"
- Make sure the repository exists on GitHub
- Check the username and repository name are correct
- Verify you have access to the repository

### Error: "authentication failed"
- Use Personal Access Token instead of password
- Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### Error: "failed to push some refs"
```bash
# Pull first, then push
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## ✅ Success Checklist

After pushing, verify:
- [ ] Repository is visible on GitHub
- [ ] All files are present (except node_modules, venv)
- [ ] README.md displays correctly
- [ ] .gitignore is working (large dirs not visible)
- [ ] No .env files are visible

---

**Need help?** Check `GIT_BEST_PRACTICES.md` for more Git tips!

