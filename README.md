# Real-Time Host-Controlled Quiz Application

A serverless, real-time web quiz application built with vanilla JavaScript (ES modules) and Firebase Realtime Database. It features host session management, dynamic per-player randomization, automatic timer progression, skip functionality, and a live ranked leaderboard designed for embedding directly into Google Sites or running independently via GitHub Pages.

---

## Features

* **Host-Controlled Sessions**: Protect controls behind an administrative password with options to open the quiz, freeze/close the quiz without data loss, or wipe scores for a fresh round.
* **Live Ranked Leaderboard**: Sorts players in real-time by:
1. Highest number of correct answers.
2. Lowest total time taken (tie-breaker).


* **Per-Player Shuffling**: Every participant receives a uniquely shuffled question order and randomized option layout using the Fisher-Yates algorithm.
* **Session Integrity & Mandatory Nickname**: Blocks session persistence across reloads (`localStorage` cleanup) and validates nicknames before entering the quiz lobby.
* **Skip & Auto-Advance Mechanics**: Allows players to skip questions or auto-advances on countdown expiration while keeping time and answered count updated.
* **Google Sites Ready**: Built with vanilla HTML/CSS/JS without local build steps, enabling clean iframe embedding.

---

## File Structure

```text
├── index.html            # Player interface (nickname entry, randomized quiz cards, countdown timer, skip button)
├── host.html             # Host hub & live dashboard (password-protected controls + live leaderboard table)
├── firebase-config.js    # Firebase credentials, initialization, and exported database references
├── questions.js          # Exported question dataset containing text, options, durations, and answer keys
└── README.md             # Project documentation

```

---

## Architecture & Data Flow

```text
[ host.html ] (Host Controls)
      │
      ├── Writes 'OPEN' / 'CLOSED' / reset ──────────┐
      │                                              ▼
      │                                     [ Firebase Realtime DB ]
      │                                        ├── /gameState
      │                                        └── /players/{playerId}
      │                                              ▲
      └── Listens to player scores & ranks ──────────┤
                                                     │
[ index.html ] (Player Views)                        │
      │                                              │
      └── Writes stats (answered, correct, time) ────┘

```

---

## Firebase Database Schema

### `/gameState`

```json
{
  "status": "OPEN",
  "startedAt": 1773123456789
}

```

* `status`: `"OPEN"` (quiz active) or `"CLOSED"` (quiz stopped, leaderboard frozen).

### `/players/{playerId}`

```json
{
  "name": "Alex",
  "questionsAnswered": 20,
  "correctAnswers": 18,
  "totalTime": 142.35
}

```

---

## Setup & Deployment

### 1. Configure Firebase

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Create a **Realtime Database** in test mode (or configure custom security rules).
3. Update `firebase-config.js` with your project credentials:

```javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, set, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, set, update };

```

### 2. Configure Database Security Rules

Apply the following rules in Firebase Realtime Database to permit read/write access:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}

```

### 3. Deploy to GitHub Pages

1. Push all files (`index.html`, `host.html`, `firebase-config.js`, `questions.js`) to a GitHub repository.
2. In the repository settings, navigate to **Pages**.
3. Under **Branch**, select `main` (or `master`) and save.
4. Note your public URL: `https://<username>.github.io/<repo-name>/`.

### 4. Embed into Google Sites

* **Player Page**: Embed URL `https://<username>.github.io/<repo-name>/index.html`
* **Admin Dashboard Page**: Embed URL `https://<username>.github.io/<repo-name>/host.html`

---

## Administrative Controls (`host.html`)

* **Unlock Password**: Default configured inside `host.html` (`const ADMIN_PASSWORD = "admin";`).
* **🚀 Open Quiz for Players**: Broadcasts `"OPEN"` to `/gameState`. Active player screens immediately start question 1.
* **🔒 Close Quiz (Freeze Scores)**: Broadcasts `"CLOSED"` to `/gameState`. Halts timers and option submission on all player clients while keeping full score rankings on the dashboard intact.
* **🔄 Clear Scores & Reset Database**: Removes `/gameState` and `/players` nodes to prepare for a completely new session.
