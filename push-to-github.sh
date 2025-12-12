#!/bin/bash

# =============================================================================
#                     PUSH TO GITHUB - HELPER SCRIPT
# =============================================================================

echo "🚀 Smart Stay - Push to GitHub"
echo "================================"
echo ""

# Check if remote already exists
if git remote -v | grep -q "origin"; then
    echo "✅ Remote 'origin' already configured:"
    git remote -v
    echo ""
    read -p "Do you want to push now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📤 Pushing to GitHub..."
        git push -u origin main
        exit 0
    fi
fi

# Get GitHub details
echo "📝 Please provide your GitHub repository details:"
echo ""
read -p "GitHub Username: " GITHUB_USER
read -p "Repository Name (e.g., smart-stay): " REPO_NAME

if [ -z "$GITHUB_USER" ] || [ -z "$REPO_NAME" ]; then
    echo "❌ Error: Username and repository name are required!"
    exit 1
fi

REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo ""
echo "🔗 Repository URL: $REPO_URL"
echo ""
read -p "Is this correct? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled."
    exit 1
fi

# Add remote
echo ""
echo "📡 Adding remote repository..."
git remote add origin "$REPO_URL" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "⚠️  Remote might already exist. Updating..."
    git remote set-url origin "$REPO_URL"
fi

# Verify remote
echo ""
echo "✅ Remote configured:"
git remote -v
echo ""

# Push
echo "📤 Pushing to GitHub..."
echo ""
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Success! Your code is now on GitHub!"
    echo "🔗 View it at: https://github.com/${GITHUB_USER}/${REPO_NAME}"
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo "   1. Repository doesn't exist on GitHub - create it first at:"
    echo "      https://github.com/new"
    echo "   2. Authentication failed - check your GitHub credentials"
    echo "   3. Branch name mismatch - try: git branch -M main"
fi

