# Codesense AI - AI Code Reviewer 

A production-grade, full-stack AI-powered code review application built with **FastAPI**, **React**, and **Gemini 2.5 Flash**.

---

## Features

- **AI Code Review** — Bugs, vulnerabilities, performance, code smells, suggestions
- **Quality Score** — 1–10 rating with visual score ring
- **Optimized Code** — AI-generated improved version of your code
- **Analytics Dashboard** — Charts, trends, language stats, issue overview
- **Review History** — Search, filter, expand/collapse past reviews
- **JWT Auth** — Secure signup/login with bcrypt password hashing
- **Dark SaaS UI** — Glassmorphism, animations, responsive design

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Recharts |
| Backend | Python, FastAPI, SQLAlchemy, JWT, bcrypt |
| Database | MySQL 8+ |
| AI | Gemini 2.5 Flash (Google AI) |

---

## Project Structure

```
ai-code-reviewer/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config.py            # Settings from .env
│   │   ├── database/database.py # DB connection
│   │   ├── models/models.py     # SQLAlchemy ORM
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── services/            # Auth + Gemini logic
│   │   ├── routes/              # API route handlers
│   │   └── middleware/          # JWT auth dependency
│   ├── schema.sql               # MySQL setup script
│   ├── requirements.txt
│   └── .env                     # ← your secrets here
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── pages/               # Dashboard, Review, History, Account
    │   ├── components/          # UI components, charts, editor
    │   ├── context/             # Auth context
    │   ├── services/            # Axios API calls
    │   └── utils/               # Constants, helpers
    ├── tailwind.config.js
    └── package.json
```

---

## Setup Instructions

### Prerequisites

- Python 3.11+
- Node.js 18+
- MySQL 8+
- Google Gemini API key — get free at https://aistudio.google.com/apikey

---

### 1. MySQL Database

Open MySQL Workbench (or CLI) and run:

```sql
source /path/to/backend/schema.sql
```

Or paste the contents of `backend/schema.sql` into MySQL Workbench and execute.

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Configure `.env`:**

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ai_code_reviewer

SECRET_KEY=your-super-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

GEMINI_API_KEY=your_gemini_api_key_here

FRONTEND_URL=http://localhost:5173
```

**Start the backend:**

```bash
# From the backend/ directory
uvicorn app.main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: http://localhost:5173

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | ❌ | Register |
| POST | `/auth/login` | ❌ | Login → JWT |
| GET | `/auth/me` | ✅ | Current user |
| PUT | `/auth/update` | ✅ | Update profile |
| DELETE | `/auth/delete` | ✅ | Delete account |
| POST | `/reviews/` | ✅ | Submit code for review |
| GET | `/reviews/` | ✅ | List all reviews |
| GET | `/reviews/{id}` | ✅ | Get single review |
| DELETE | `/reviews/{id}` | ✅ | Delete review |
| GET | `/analytics/dashboard` | ✅ | Dashboard stats |

---

## Gemini AI Response Format

```json
{
  "score": 7,
  "bugs": [
    { "title": "Null pointer dereference", "description": "...", "line": "12", "severity": "high" }
  ],
  "vulnerabilities": [
    { "title": "SQL Injection", "description": "...", "severity": "critical" }
  ],
  "performance_issues": [
    { "title": "Inefficient loop", "description": "...", "impact": "medium" }
  ],
  "code_smells": [
    { "title": "Long method", "description": "..." }
  ],
  "suggestions": [
    { "title": "Use constants", "description": "...", "priority": "low" }
  ],
  "readability": { "score": 8, "comments": "Well named variables..." },
  "fixed_code": "// improved version...",
  "summary": "Overall the code is functional but has..."
}
```

---

## Security

- Passwords hashed with bcrypt (cost factor 12)
- JWT tokens with configurable expiry
- CORS restricted to frontend origin
- SQLAlchemy ORM prevents SQL injection
- Environment variables for all secrets
- Input validation via Pydantic

---

## Production Deployment

### Backend (e.g. Railway, Render, VPS)

```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend (e.g. Vercel, Netlify)

```bash
npm run build
# Deploy the dist/ folder
```

Update `FRONTEND_URL` in backend `.env` and update `baseURL` in `frontend/src/services/api.js` to your production API URL.

---

## License

MIT — free to use, modify, and deploy.
