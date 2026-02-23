# 🚀 QUICK START CHECKLIST

Follow these steps in order:

## ☐ Step 1: Add Files to GitHub (5 minutes)

1. Download the 4 new files I created
2. Add to your GitHub repository:
   - `server.js` → root directory
   - `package.json` → root directory  
   - `.gitignore` → root directory
   - `chat-widget.js` → REPLACE the one in `/assets/` folder

3. Commit and push:
   ```bash
   git add .
   git commit -m "Add backend for AI chat"
   git push
   ```

## ☐ Step 2: Get Anthropic API Key (2 minutes)

1. Visit: https://console.anthropic.com/
2. Sign up (they give $5 free credit to start!)
3. Go to: **Settings** → **API Keys**
4. Click: **Create Key**
5. **COPY THE KEY** (starts with `sk-ant-`)

## ☐ Step 3: Add API Key to DigitalOcean (3 minutes)

1. Go to your DigitalOcean App
2. Click: **Settings** → **App-Level Environment Variables**
3. Click: **Edit**
4. Add variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: (paste your key here)
   - ✅ Check "Encrypt"
5. Click: **Save**

## ☐ Step 4: Update Build Settings (2 minutes)

1. Go to: **Settings** → **Components** → (your web service)
2. Set:
   - **Build Command:** `npm install`
   - **Run Command:** `npm start`
3. Click: **Save**

## ☐ Step 5: Deploy (3 minutes)

1. Click the big blue **Deploy** button
2. Wait 2-3 minutes for build to complete
3. Visit your website
4. Click the yellow chat button
5. Type "Hello" and press Enter

## ✅ Success!

If you see an AI response, you're done! 🎉

---

## ❌ If it doesn't work:

**Error: "API key not configured"**
→ Go back to Step 3, make sure you saved the environment variable

**Error: "Failed to get response"**  
→ Check DigitalOcean **Runtime Logs** for error messages

**Chat button appears but nothing happens when you type**
→ Make sure you replaced the old `chat-widget.js` file

**Server won't start / Build fails**
→ Make sure `server.js` and `package.json` are in the ROOT directory (not inside a folder)

---

## 📁 Your GitHub repo should look like this:

```
your-repo/
├── server.js          ← NEW
├── package.json       ← NEW
├── .gitignore         ← NEW
├── index.html
├── about.html
├── services.html
├── vehicles.html
├── booking.html
├── contact.html
├── assets/
│   ├── style.css
│   └── chat-widget.js ← REPLACED
└── img/
    └── (your images)
```

NOT like this (common mistake):
```
your-repo/
└── backend/           ← ❌ WRONG! Don't put in subfolder
    ├── server.js
    └── package.json
```

---

## 💡 Pro Tips:

- Anthropic gives you $5 free credit to start
- Each conversation costs about $0.01
- You'll get 500+ free conversations before you need to pay
- Monitor usage at: https://console.anthropic.com/settings/usage

That's it! You should be up and running in 15 minutes total. 🚀
