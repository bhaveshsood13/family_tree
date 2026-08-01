# 🌳 Sood Family Tree Application

A modern, interactive, full-stack Family Tree application built with **React 19**, **React Flow (`@xyflow/react`)**, **FastAPI**, and **MongoDB**. This application provides an infinite-canvas graph workspace for building, editing, digitizing, and visualizing multi-generational family trees with premium glassmorphism styling.

---

## 🖼️ Application Screenshots

| Interactive Family Tree Canvas & Vertical Generation Elevator | Generation Elevator Navigator Detail |
| :---: | :---: |
| ![Family Tree Overview](docs/screenshots/family_tree_overview.jpg) | ![Generation Navigator Detail](docs/screenshots/generation_navigator_detail.jpg) |

---

## 📐 System Architecture & Design Diagram

The application is architected with a decoupled frontend graph engine, a high-performance Python FastAPI backend, and a multi-tiered data persistence layer with automatic failover.

```
                  ┌─────────────────────────────────────────────────────────┐
                  │                 React 19 Frontend                       │
                  │  - React Flow (@xyflow/react) Canvas Engine             │
                  │  - Custom Nodes: PersonNode & MarriageNode              │
                  │  - Modals: EditModal & AI ImportModal                   │
                  │  - History Stack: 20-Step Undo / Redo                   │
                  └────────────────────────────┬────────────────────────────┘
                                               │
                                     HTTP REST API (/api/tree)
                                  Proxy via Vite on localhost:5173
                                               │
                  ┌────────────────────────────▼────────────────────────────┐
                  │                FastAPI Backend (Python 3.12)            │
                  │  - Uvicorn Server (http://127.0.0.1:8000)               │
                  │  - Async Motor MongoDB Client                           │
                  │  - Auto-Fallback Engine (MongoDB <-> JSON File)         │
                  └──────┬─────────────────────┬────────────────────┬───────┘
                         │                     │                    │
                         │ Primary             │ Backup             │ Seed Sync
                         ▼                     ▼                    ▼
             ┌──────────────────────┐ ┌─────────────────┐ ┌────────────────────┐
             │   MongoDB Database   │ │  tree_data.json │ │   initialData.js   │
             │ (mongodb://127.0.0.1)│ │  (Local File)   │ │  (Frontend Store)  │
             └──────────────────────┘ └─────────────────┘ └────────────────────┘
```

---

## 💾 How Data & Database Persistence Works

The app implements a **3-tier fail-safe persistence strategy**:

1. **MongoDB Database (Primary)**:
   - Connects via Motor to `mongodb://localhost:27017` (configurable via `backend/.env`).
   - Stores tree state in database `family_tree_db` and collection `tree_data`.
2. **Local JSON File Fallback (`tree_data.json`)**:
   - If MongoDB is offline or installing, FastAPI automatically falls back to reading and writing `backend/tree_data.json`. Zero data is ever lost.
3. **Frontend Initial Seed Sync (`initialData.js`)**:
   - Whenever you click **Save**, the backend also updates `src/store/initialData.js`. Even on fresh browser reloads or clean resets, the app loads your latest saved state.

---

## 🚀 Complete Step-by-Step Local Setup Guide

Follow these instructions to run the application locally on your machine with MongoDB, FastAPI, and Vite.

### 1. Start MongoDB Database

If MongoDB is not running, run these commands in your Mac terminal to fix permissions and launch the MongoDB Community service:

```bash
# Fix Homebrew folder permissions if needed
sudo chown -R $(whoami) /opt/homebrew/Cellar /opt/homebrew/Library/Taps

# Tap and install MongoDB Community Edition
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community
```

> 💡 **Cloud Alternative**: You can also use MongoDB Atlas! Simply edit `backend/.env`:
> ```env
> MONGODB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
> ```

---

### 2. Start the Backend API (FastAPI)

Open a terminal window in the project root:

```bash
# Navigate to backend directory
cd backend

# Create & activate Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Seed accurate family tree data from handdrawn charts (68 members)
python seed_data.py

# Start FastAPI server on port 8000
uvicorn main:app --reload --port 8000 --host 127.0.0.1
```

The backend server will run live at `http://127.0.0.1:8000`.

---

### 3. Start the Frontend Application (Vite + React)

Open a **second terminal window** in the project root:

```bash
# Install frontend dependencies
npm install

# Start Vite dev server
npm run dev
```

Open your browser and navigate to: **`http://127.0.0.1:5173/`**

---

### 4. Run Unit Test Suite

Run the automated test suite verifying edge math, dataset integrity, and generation calculations:

```bash
npm test
```

All 14 tests across frontend and backend execute and pass automatically with 100% clean status.

---

## 🔑 Login Credentials

The application includes an authentication gatekeeper to protect family legacy data.

- **User ID**: `sood`
- **Password**: `family`

---

## 📖 Application Features & User Workflows

### 1. Main Canvas Navigation
- **Pan & Zoom**: Click and drag to pan, scroll wheel to zoom.
- **Fixed vs Free Mode**: Toggle **Free Mode** in the toolbar to drag person cards anywhere, or **Fixed Mode** to lock cards in alignment.

### 2. Contextual Node Actions
- **Adding Children (`+ Child`)**: Click `Child` on any person or hover over a spousal heart junction. The engine automatically routes parent lines through the marriage node.
- **Adding Spouses (`+ Spouse`)**: Creates a spouse node linked via a red marriage line and heart routing node.
- **Adding Siblings (`+ Sibling`)**: Creates a sibling card side-by-side sharing the same parent handle.
- **Adding Standalone Person (`+ New`)**: Click `+ New` in the top toolbar to insert a new root node.

### 3. Profile Editing & Photo Uploads
- Click any person card to open the glassmorphic **Edit Modal**.
- Edit Name, Gender, Birth Year, Death Year, and Occupation.
- Upload custom profile pictures displayed on person cards.

### 4. AI Scan & Auto-Import Simulation
- Click **AI Scan** in the toolbar to upload an image of a hand-drawn or printed family tree.
- The AI simulation extracts members and automatically converts them into interactive graph nodes.

### 5. History & Export Tools
- **Undo / Redo**: 20-step history stack.
- **Export PNG**: Download high-resolution PNG images of your tree canvas.
- **Save to Cloud**: Writes live tree state to MongoDB, `tree_data.json`, and `initialData.js`.

---

## 📂 Project Structure

```
family_tree/
├── README.md                 # Complete documentation & guide
├── index.html                # Main HTML entry point
├── package.json              # Frontend dependencies & scripts
├── vite.config.js            # Vite configuration & /api proxy
├── backend/
│   ├── .env                  # Environment variables (MONGODB_URL)
│   ├── main.py               # FastAPI server endpoints
│   ├── seed_data.py          # Data generator for handdrawn tree structure
│   ├── tree_data.json        # Local JSON database storage
│   ├── requirements.txt      # Python package requirements
│   └── venv/                 # Python virtual environment
└── src/
    ├── App.jsx               # Root component & auth router
    ├── api.js                # API client (fetchTree, saveTree)
    ├── index.css             # Glassmorphic CSS design system
    ├── components/
    │   ├── TreeCanvas.jsx    # React Flow canvas controller & toolbar
    │   ├── PersonNode.jsx    # Person node component
    │   ├── MarriageNode.jsx  # Spousal junction node component
    │   ├── EditModal.jsx     # Edit profile modal
    │   ├── ImportModal.jsx   # AI Scan import modal
    │   └── Login.jsx         # Auth login screen
    └── store/
        └── initialData.js    # Seed data fallback store
```

---

*Created by Bhavesh Sood ❤️ powered by Google AntiGravity AI*
