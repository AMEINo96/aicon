# 🚀 Hackathon Teammate Setup Checklist: AICON

Welcome to the **AICON** project team! Before the hackathon begins, please complete every step in this checklist on your local laptop to ensure a smooth, friction-free environment setup.

---

## 📋 Checklist Summary

- [ ] **Section 1**: Install Core System Requirements
- [ ] **Section 2**: Install Global CLI Tools
- [ ] **Section 3**: Configure Python / Anaconda Virtual Environment
- [ ] **Section 4**: Configure Recommended IDE Extensions & Optimize AI Token Budget
- [ ] **Section 5**: Clone Repository & Run Frontend + Backend Locally

---

## 1. 💻 System Requirements

Make sure you have the following prerequisites installed and updated on your machine:

| Component | Required Version | Verification Command | Download / Link |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v20.x` or higher (LTS) | `node -v` | [nodejs.org](https://nodejs.org/) |
| **Python** | `3.10` – `3.12` | `python --version` or `python3 --version` | [python.org](https://www.python.org/) |
| **Git** | `2.x` or higher | `git --version` | [git-scm.com](https://git-scm.com/) |
| **IDE** | VS Code, Cursor, or Antigravity | N/A | [VS Code](https://code.visualstudio.com/) / [Cursor](https://cursor.com/) |

> [!IMPORTANT]
> Ensure Node.js is at least **v20+** (Next.js 14+ requirement) and Python is strictly between **3.10 and 3.12** for optimal Scikit-Learn and FastAPI compatibility.

---

## 2. 🌐 Global CLI Tools

Install the required global command-line utilities for deployment and GitHub integration.

### A. Vercel CLI
Used for deploying and previewing the frontend application.

```bash
npm install -g vercel
```
- **Verify**: `vercel --version`

### B. GitHub CLI (`gh`)
Used for quick PR creation, repo management, and issue tracking directly from your terminal.

- **Windows (PowerShell)**:
  ```powershell
  winget install --id GitHub.cli
  ```
- **macOS (Homebrew)**:
  ```bash
  brew install gh
  ```
- **Linux (apt)**:
  ```bash
  sudo apt install gh
  ```
- **Authenticate**:
  ```bash
  gh auth login
  ```
- **Verify**: `gh --version`

---

## 3. 🐍 Python / Anaconda Virtual Environment Setup

Choose **Option A** (Standard Python `venv`) or **Option B** (Anaconda / Miniconda) based on your local preference.

### Option A: Standard Python `venv`

#### Windows (PowerShell / Command Prompt)
```powershell
# Navigate to the backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# PowerShell:
.\venv\Scripts\Activate.ps1
# CMD:
.\venv\Scripts\activate.bat
```

#### macOS / Linux
```bash
# Navigate to the backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate
```

---

### Option B: Anaconda / Miniconda

If you prefer Conda for environment management:

```bash
# Create a new conda environment with Python 3.11
conda create -n aicon-backend python=3.11 -y

# Activate the environment
conda activate aicon-backend
```

---

### Installing Backend Dependencies

Once your virtual environment (`venv` or `conda`) is active, install all required Python packages:

```bash
# Inside the /backend directory with active virtual environment:
pip install -r requirements.txt
```

#### Installed Packages Overview:
- `fastapi` & `uvicorn` — API web framework and server
- `scikit-learn` & `pandas` & `joblib` — ML model loading & data processing
- `google-generativeai` — Gemini AI integration
- `python-dotenv` & `pydantic` — Configuration and data schema validation

---

## 4. 🧩 Recommended Extensions & AI Token Budget Optimization

### 🛠 Essential IDE Extensions to Install / Keep

- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) — Autocomplete for classes
- **ES7+ React/Redux/React-Native snippets** (`dsznajder.es7-react-js-snippets`)
- **Python** (`ms-python.python`) & **Pylance** (`ms-python.vscode-pylance`)
- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **GitLens** (`eamodio.gitlens`) — Line-by-line blame and branch tracking

---

### ⚠️ CRITICAL: Token Budget & Performance Optimization

When pairing with AI Assistants (Cursor, Antigravity, GitHub Copilot, Claude Dev):

> [!WARNING]
> **Disable or remove heavy domain-specific plugins (e.g., bio/science/chemistry/genomics/heavy data science tooling)**.
> 
> **Why?**
> 1. **Conserve AI Token Budget & Context Window**: Heavy plugins scan files and inject bloated schemas, language servers, or broad AST symbols into the AI context, depleting your available token window.
> 2. **Prevent IDE Latency**: Unnecessary extension background processes reduce CPU/RAM availability needed for local server reloads and AI inference.

---

## 5. 🚦 Step-by-Step Repository Setup & Running Locally

Follow these exact steps to clone the project repository and launch both the backend and frontend services locally.

### Step 1: Clone the Repository

```bash
git clone https://github.com/AMEINo96/aicon.git
cd aicon
```

---

### Step 2: Set Up and Run Backend (`FastAPI`)

1. Open a terminal window and navigate to `/backend`:
   ```bash
   cd backend
   ```

2. Activate your Python environment:
   - **`venv` (Windows)**: `.\venv\Scripts\activate`
   - **`venv` (macOS/Linux)**: `source venv/bin/activate`
   - **`conda`**: `conda activate aicon-backend`

3. Set up Environment Variables:
   - Copy `.env.example` to `.env` (if custom secrets like `GEMINI_API_KEY` are required):
     ```bash
     # Windows PowerShell:
     Copy-Item .env.example .env
     # Bash/macOS:
     cp .env.example .env
     ```

4. Launch the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

5. Verify backend health:
   - Open [http://localhost:8000](http://localhost:8000) in your browser.
   - Interactive API docs available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

### Step 3: Set Up and Run Frontend (`Next.js`)

1. Open a **second terminal window** and navigate to `/frontend`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Local Environment:
   - Verify `.env.local` contains:
     ```env
     NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
     ```

4. Start the Next.js development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   - [http://localhost:3000](http://localhost:3000)

---

## 🎉 You're All Set!

If both servers are running without errors:
- **Backend API**: `http://localhost:8000`
- **Frontend Dashboard**: `http://localhost:3000`

If you encounter any issues during setup, reach out on the team chat or open an issue using `gh issue create`! Happy hacking! 🚀
