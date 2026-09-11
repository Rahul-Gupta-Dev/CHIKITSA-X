# CHIKITSAX — FastAPI Backend Foundation (Phase 1)

AI-Powered Patient Intelligence, Care Navigation & Care-to-Cost Financial Assistance Platform.

---

## 🏗️ Architecture Stack
- **Framework**: FastAPI (Python 3.10+)
- **Database**: SQLite (`chikitsax.db` for dev) via SQLAlchemy 2.0 ORM
- **Validation**: Pydantic v2
- **Server**: Uvicorn (ASGI)
- **CORS**: Enabled for Vite React Frontend (`http://localhost:5173`)

---

## 📁 Directory Structure
```
backend/
├── app/
│   ├── main.py                # FastAPI Application Entrypoint & CORS
│   ├── database.py            # SQLAlchemy Engine & Session Configuration
│   ├── seed.py                # Stable Demo Dataset Seeder
│   ├── models/                # SQLAlchemy Models (User, Patient, Hospital, Doctor, OPD, QR, etc.)
│   ├── schemas/               # Pydantic Schemas
│   ├── routers/               # REST API Endpoints
│   └── services/              # Modular Services (OCR, Voice, Triage, Care Score, Financial)
├── chikitsax.db               # Auto-generated SQLite Database
├── requirements.txt           # Python Dependencies
├── .env.example               # Environment Variables Template
└── README.md                  # Backend Documentation
```

---

## ⚡ Quickstart Guide

### 1. Python & Virtual Environment
Requires Python 3.10 or higher (Python 3.14 supported).

```bash
cd backend
python -m venv venv
```

Activate virtual environment:
- **Windows (PowerShell)**: `.\venv\Scripts\Activate.ps1`
- **Linux / macOS**: `source venv/bin/activate`

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default configuration:
```ini
DATABASE_URL=sqlite:///./chikitsax.db
SECRET_KEY=chikitsax-dev-secret-key-2026-sih
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
VITE_API_BASE_URL=http://localhost:8000/api
```

### 4. Run Development Server
```bash
python app/main.py
```
*Or using Uvicorn directly*:
```bash
uvicorn app.main:app --reload --port 8000
```

The server automatically initializes database tables in `backend/chikitsax.db` and seeds stable demo dataset on first startup.

---

## 📡 API Endpoints Summary

### Health Check
- `GET /api/health` -> `{"status": "ok", "service": "CHIKITSAX backend"}`

### Patient & Records
- `GET /api/patients/{patient_id}`
- `POST /api/patients`
- `PUT /api/patients/{patient_id}`
- `GET /api/patients/{patient_id}/profile` (Unified Health Profile)
- `GET /api/patients/{patient_id}/records`
- `POST /api/medical-records`

### Voice Intake & Triage
- `POST /api/intake`
- `POST /api/triage` (Rule-based clinical risk triage + medical disclaimer)

### Hospitals & Doctors
- `GET /api/hospitals`
- `GET /api/hospitals/{hospital_id}`
- `POST /api/hospitals/recommend` (Care Score: Fit 35%, Affordability 25%, Distance 15%, Availability 15%, Financial Support 10%)
- `GET /api/doctors/{doctor_id}`
- `GET /api/doctors/{doctor_id}/appointments`

### OPD Appointment & QR Verification (Single Source of Truth)
- `POST /api/opd` (Generates Reference ID `CHX-2026-XXXXXX`)
- `POST /api/qr`
- `GET /api/qr/verify/{reference_id}`
- `POST /api/hospital/verify`

### Consent & Doctor Consultations
- `POST /api/consent`
- `POST /api/consultations`
- `GET /api/consultations/{appointment_id}`

### Care-to-Cost Financial Assistance
- `GET /api/financial/insurance/{patient_id}`
- `GET /api/financial/schemes/{patient_id}`
- `GET /api/financial/ngo-support/{patient_id}`
- `POST /api/financial/assess` (Calculates Insurance, Gov Schemes, NGO grants, Patient Gap)
- `POST /api/finance-plan`

### Audit Logging
- `GET /api/audit-logs`
- `POST /api/audit-logs`

---

## 🔒 Interactive API Documentation
Once running, open:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
