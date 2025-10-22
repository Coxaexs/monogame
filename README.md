# 🎲 Custom Monopoly Game - Online Multiplayer

A fully customizable, online multiplayer Monopoly-like board game with real-time synchronization using Firebase.

## ✨ Features

### 🎮 Gameplay
- **Real-time multiplayer** - Play with friends online
- **2-8 players** support
- **Customizable board** - Edit property names, prices, and values
- **Trading system** - Trade properties and money with other players
- **Chance & Community Chest cards** - Random events to spice up gameplay
- **Property management** - Buy properties, build houses and hotels
- **Jail mechanics** - Roll doubles, pay fine, or use cards to escape
- **Bankruptcy detection** - Players who run out of money are eliminated

### ⚙️ Customization
- Starting money amount
- Pass GO bonus amount
- Maximum player count (2-8)
- Enable/disable trading
- Edit all property names and prices
- Custom Chance and Community Chest cards (coming soon)
- Board layout customization

### 🤖 Additional Features
- **Game lobby system** - Host creates game, others join with Game ID
- **Real-time game state** - All players see updates instantly
- **Persistent player IDs** - Reconnect if disconnected
- **Visual game board** - See player pieces, property ownership, houses/hotels
- **Game log** - Track all actions and events
- **Responsive design** - Works on desktop and mobile

## 🚀 Quick Start

### Prerequisites
- A Firebase account (free tier works!)
- A modern web browser
- A local web server (optional, but recommended)

### Setup Instructions

#### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing one
3. Give your project a name (e.g., "monopoly-game")
4. Disable Google Analytics (optional)
5. Click "Create project"

#### 2. Enable Firestore Database

1. In your Firebase project, click "Firestore Database" in the left menu
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location closest to you
5. Click "Enable"

#### 3. Set Firestore Security Rules (Important!)

1. Go to "Firestore Database" → "Rules" tab
2. Replace the content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /games/{gameId} {
      allow read, write: if true;
    }
  }
}
```

3. Click "Publish"

> ⚠️ **Security Note**: These rules allow anyone to read/write. For production, implement proper authentication and rules.

#### 4. Get Your Firebase Config

1. Go to Project Settings (click the gear icon)
2. Scroll down to "Your apps"
3. Click the web icon `</>` to add a web app
4. Give it a nickname (e.g., "Monopoly Web")
5. Don't enable Firebase Hosting (unless you want to)
6. Click "Register app"
7. Copy the `firebaseConfig` object

#### 5. Update Your Code

Open `index.html` and find this section (around line 270):

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBXmhGDqT6F5rvQdkZL8nHKp9X2wJYmN4E",
    authDomain: "monopoly-game-demo.firebaseapp.com",
    projectId: "monopoly-game-demo",
    storageBucket: "monopoly-game-demo.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};
```

Replace these values with your actual Firebase config values from step 4.

#### 6. Run the Game

**Option A: Using Python (Recommended)**
```bash
cd /home/coxaexs/Desktop/mono
python3 -m http.server 8000
```
Then open: `http://localhost:8000`

**Option B: Using Node.js**
```bash
npx serve
```

**Option C: Using PHP**
```bash
php -S localhost:8000
```

**Option D: Just open the file**
Double-click `index.html` - might work but Firebase may have issues with `file://` protocol

## 🎯 How to Play

### Creating a Game

1. Enter your name
2. Click "Create New Game"
3. Customize game settings:
   - Starting money
   - Pass GO amount
   - Maximum players
   - Trading enabled/disabled
   - Property names and prices
4. Share the **Game ID** with friends
5. Wait for players to join
6. Click "Start Game" when ready

### Joining a Game

1. Enter your name
2. Get the Game ID from the host
3. Enter the Game ID
4. Click "Join Game"
5. Wait for the host to start

### Playing Your Turn

1. **Roll Dice** - Click to roll and move
2. **Landing on Properties**:
   - **Unowned** - Choose to buy or decline
   - **Owned by others** - Pay rent automatically
   - **Owned by you** - Nothing happens
3. **Manage Properties** - Build houses/hotels on your properties
4. **Trading** - Click "Trade" button on another player to propose trades
5. **End Turn** - Click when done to pass to next player

### Special Spaces

- **GO** - Collect money when passing
- **Jail** - Roll doubles, pay $50, or use Get Out of Jail card
- **Chance/Community Chest** - Draw a random card
- **Tax** - Pay the required amount
- **Go To Jail** - Sent directly to jail
- **Free Parking** - Just visiting, no effect

## 🔧 Troubleshooting

### "Firebase initialization error"
- Check that you've replaced the Firebase config with your actual values
- Make sure you've created a Firebase project
- Verify your API key is correct

### "Could not create game"
- Check browser console (F12) for errors
- Verify Firestore is enabled in your Firebase project
- Check that security rules allow write access

### "Game not found"
- Double-check the Game ID (case-sensitive)
- Make sure the host successfully created the game
- Check your internet connection

### Players can't see updates
- Verify all players are using the same Firebase project
- Check that Firestore rules allow read access
- Refresh the page and try again

### File:// Protocol Issues
- Use a local web server instead of opening the file directly
- Modern browsers restrict Firebase operations on file:// URLs

## 🎨 Customization Ideas

### Easy Customizations
- Change player starting money
- Adjust property prices
- Modify rent values
- Change property names to match your theme
- Adjust max players (2-8)

### Advanced Customizations (Edit the code)
- Add custom Chance/Community Chest cards
- Create different board layouts
- Add new property types
- Implement time limits per turn
- Add sound effects
- Create different game modes

## 🤖 Bot Support (Coming Soon)

Currently, the game supports multiplayer with human players. Bot support can be added by:
1. Creating an AI player that makes decisions
2. Implementing strategy logic for buying/trading
3. Auto-rolling dice on bot turns

## 📱 Hosting Online

### Option 1: Firebase Hosting (Free)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Option 2: Netlify/Vercel (Free)
1. Create account on Netlify or Vercel
2. Drag and drop your project folder
3. Share the URL with friends

> Note about the WebSocket server

This repository contains a Node WebSocket server (`server.js`) that serves the frontend and runs a WebSocket `ws` server for real-time multiplayer. Netlify (and Vercel's static hosting) only host static assets and do not support long-lived WebSocket servers.

Options to deploy the full app:

- Deploy only the frontend to Netlify (drag-and-drop or connect the repo). Then run the Node WebSocket server separately on a platform that supports Node processes and WebSockets (Heroku, Fly.io, Render, Railway, DigitalOcean App Platform, or a VPS). Update the client-side WebSocket URL in `index.html` to point to the server's public URL.
- Convert server-side multiplayer to serverless-friendly messaging (e.g., WebSocket support via specialized services) — this requires code changes.
- Use a platform that supports both static hosting and a Node server in the same project (e.g., Render or Fly.io) and deploy the repo there.

If you only want to host the static frontend on Netlify, the steps below will work. Keep in mind multiplayer features will not work unless a compatible WebSocket server is running elsewhere.

Netlify static deploy steps (frontend-only):

1. Go to Netlify and create a new site → "Deploy manually" → Drag & drop the project folder.
2. Set the publish directory to the project root (default). The included `netlify.toml` already sets publish = ".".
3. (Optional) Connect your Git repository and set build command to `npm run build` and publish directory to `.`.

Updating WebSocket endpoint

Open `index.html` and search for the WebSocket client code (look for `new WebSocket(`). Replace the local `ws://` URL with the public URL of your deployed server, for example:

```js
// Example change inside index.html
const socket = new WebSocket('wss://your-server.example.com');
```

If you need, I can prepare a small `.env`-driven client-side switch or a tiny script to set the WebSocket URL dynamically based on environment.

## Deploying the Node WebSocket server (full multiplayer)

If you want the full multiplayer experience, deploy the Node server (`server.js`) to a platform that supports long-lived Node processes and WebSocket connections. Two easy options:

1) Render (recommended simple option)

 - Create an account on Render (https://render.com)
 - Create a new Web Service, connect your GitHub/GitLab repo
 - Build command: `npm install`
 - Start command: `node server.js` (Procfile is provided)
 - Port: Render will set PORT env var automatically; `server.js` already uses process.env.PORT

 After deploy, you'll get a public URL like `https://my-monopoly.onrender.com`. Use `wss://my-monopoly.onrender.com` as `WS_URL` in `ws-config.js` on the frontend.

2) Docker (any container host)

 - A simple `Dockerfile` is included. Build and push the image to your container registry, then run on your hosting provider.
 - Example commands (local build/test):

```bash
docker build -t monopoly-server:latest .
docker run -p 8000:8000 monopoly-server:latest
```

 - Set `WS_URL` to the host's `wss://...` URL in `ws-config.js`.

Other hosts: Railway, Fly.io, DigitalOcean App Platform also work and are similar (set Node start command to `node server.js` and expose port 8000 or use the provided $PORT).

## Frontend-only on Netlify (no WebSocket server)

If you prefer the easiest path and don't need multiplayer, deploy the frontend to Netlify as described earlier. Multiplayer features will not function unless the `WS_URL` points to a running WebSocket server.

### Option 3: GitHub Pages (Free)
1. Create a GitHub repository
2. Push your code
3. Enable GitHub Pages in settings

## 📝 Todo / Upcoming Features

- [ ] Bot players with AI
- [ ] Custom card editor UI
- [ ] Mortgage properties
- [ ] Auction system for declined properties
- [ ] Player statistics and leaderboards
- [ ] Game replays
- [ ] Voice chat integration
- [ ] Mobile app version
- [ ] Tournament mode
- [ ] Custom themes/skins
- [ ] Save/load game state

## 🐛 Known Issues

- Card actions are simplified (not all effects implemented)
- No mortgage system yet
- Railroad/utility rent calculation may need refinement
- Bankruptcy doesn't redistribute properties yet

## 📄 License

Free to use and modify for personal and educational purposes.

## 🤝 Contributing

Feel free to fork, modify, and improve! Share your enhancements!

## 💡 Tips

1. **For best experience**: Use Chrome or Firefox
2. **Local network play**: Use your local IP instead of localhost
3. **Find local IP**: 
   - Windows: `ipconfig`
   - Mac/Linux: `ifconfig` or `ip addr`
4. **Share with friends**: Give them `http://YOUR_IP:8000`

## 🎉 Have Fun!

Enjoy playing your custom Monopoly game with friends! Feel free to customize everything to make it your own unique experience.

---

**Need help?** Check the browser console (F12) for error messages, or review the Firebase documentation.
