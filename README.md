# AI-Enhanced-Real-Time-Occupancy-Planning-System


# 🧠 AI-Enhanced Real-Time Occupancy Planning System (VergeSense Integration)

An AI-powered prototype system for real-time workspace allocation and intelligent querying, integrating VergeSense occupancy data, employee preferences, and organizational policies. Built for Corporate Real Estate (CRE) teams seeking dynamic, preference-aware desk assignments and natural language interfaces.

---

## 📦 Project Structure

```
ai-occupancy-planner/
├── backend/               # Node.js Express API (TypeScript)
├── ai-nlp-service/        # FastAPI + OpenAI-based NLP processor
├── optimizer/             # Python optimization engine for desk assignment
├── frontend/              # Lightweight React app (optional)
├── docker-compose.yml     # Service orchestration
├── README.md              # This file
```

---

## ⚙️ Core Features

| Feature | Description |
|--------|-------------|
| 🔄 Real-time Sensor Integration | Fetches near real-time occupancy data from VergeSense API |
| 👤 Employee Preference Matching | Considers preferences like desk type, proximity, accessibility |
| 🧠 AI NLP Interface | Understands natural language queries (via OpenAI GPT or Claude) |
| ⚖️ Constraint-Based Optimization | Allocates desks using custom rule engines (policies & preferences) |
| 🌐 RESTful APIs | Interface for planners, employees, and external tools |
| 🧩 Desk-to-Sensor Mapping | Maintains critical mappings for desk-level tracking from area-level data |
| 🔐 Secure & Scalable | Designed for multi-location deployments with personal data protection |

---

## 🔗 API Endpoints

### 📍 Desk Assignment

```
POST /api/assign-desk
```
**Request:**
```json
{
  "employeeId": "EMP-101",
  "date": "2025-05-12"
}
```

**Response:**
```json
{
  "assignedDesk": "D-201",
  "area": "A-5002",
  "reason": "Matches preferences and complies with distancing policy"
}
```

---

### 🗺️ Availability Query

```
GET /api/query-availability?floor=5&date=2025-05-12
```
Returns list of currently available desks by area/floor.

---

### 💬 Natural Language Query

```
POST /api/nlp-query
```

**Request:**
```json
{
  "query": "Book me a quiet standing desk near the elevator for Tuesday",
  "employeeId": "EMP-102"
}
```

**Response:**
```json
{
  "intent": "book_desk",
  "parsed": {
    "date": "2025-05-13",
    "deskType": "standing",
    "locationHint": "near elevator",
    "noiseLevel": "quiet"
  },
  "suggestedDesks": ["D-301", "D-302"]
}
```

---

## 🛠️ Setup Instructions

### 1. Clone and Configure

```bash
git clone https://github.com/your-org/ai-occupancy-planner
cd ai-occupancy-planner
```

### 2. Set Environment Variables

Create `.env` files in `backend/`, `ai-nlp-service/`, and `optimizer/` with appropriate keys.

**backend/.env**
```
PORT=4000
VERGESENSE_API_KEY=your_api_key
MONGO_URI=mongodb+srv://...
OPENAI_API_KEY=your_openai_key
```

**ai-nlp-service/.env**
```
OPENAI_API_KEY=your_openai_key
```

### 3. Start with Docker

```bash
docker-compose up --build
```

OR run services individually:

```bash
# Backend
cd backend && npm install && npm run dev

# NLP Service
cd ai-nlp-service && pip install -r requirements.txt && uvicorn app:app --reload

# Optimizer
cd optimizer && pip install -r requirements.txt && uvicorn main:app --reload
```

---

## 🤖 AI Integration Details

| Tool | Role |
|------|------|
| **OpenAI GPT-4** | Natural language query parsing, structured action extraction |
| **Hugging Face Transformers (optional)** | For self-hosted NLP alternatives |
| **Constraint Optimization (Python + OR-Tools)** | Solves multi-objective desk assignment problems with policies and preferences |

---

## 🧩 VergeSense Integration

| Endpoint | Usage |
|----------|-------|
| `/v1/spaces` | Retrieve metadata for mapping desks to areas |
| `/v1/occupancy` | Real-time area-level occupancy data |
| `/v1/sensors` | Sensor mapping to spaces |
| `/v1/metrics` | Historical occupancy trends |

Refer to: [VergeSense Developer Portal](https://developer.vergesense.com/) for full API reference.

---

## 📐 Architecture Diagram

> Includes:
- Backend REST API
- VergeSense API connection
- Optimization service
- AI NLP microservice
- MongoDB + Redis layers
- (Optional) UI

📥 Want the diagram? Request the `.drawio` or image version from the author.

---

## 📋 Sample Policies & Constraints

- ✅ Employees requesting dual monitors must be assigned desks that have them.
- 🔒 No executive desks may be assigned unless explicitly reserved.
- ♿ Employees with accessibility needs are assigned designated desks.
- 📅 Hot desks can’t be used for >2 consecutive days.
- 🧍 Desks must be >6 ft apart in assigned layout.
- 🔥 Max floor occupancy = 80% to meet safety/fire code.

---

## 📚 Data Models (MongoDB)

- **Employee**: Preferences, accessibility needs, preferred days, team
- **Desk**: Location, features, status (occupied, reserved, available)
- **DeskAreaMapping**: Links desks to VergeSense area IDs
- **PolicyRules**: Organization-wide constraints

---

## 🧪 Testing

Use Postman or Swagger to test endpoints. Unit tests coming soon via:

- Jest (backend)
- PyTest (NLP/Optimizer)

---

## 📈 Future Enhancements

- [ ] Role-based Auth (Admin vs Employee)
- [ ] UI calendar booking view
- [ ] Real-time WebSocket push for desk availability
- [ ] Historical analytics dashboards
- [ ] Slack/Teams bot integration for NLP chat

---

## 📄 License

MIT License. See `LICENSE` file for details.


