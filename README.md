# 🔐 Managed Security Services (MSS) for SMEs

A lightweight, scalable backend system for delivering **Managed Security Services (MSS)** to small and medium-sized businesses (SMEs).
This platform provides centralized monitoring, alert management, and incident response — designed for a **subscription-based cybersecurity service**.

---

## 🚀 MVP Features

* 🏢 Multi-tenant client management
* 💻 Device tracking per client *(in progress)*
* 🚨 Alert ingestion (simulated SIEM integration)
* 🛠 Incident response handling *(coming soon)*
* 🔐 Authentication (JWT) *(coming soon)*
* 📊 Dashboard APIs *(coming soon)*

---

## 🧱 Tech Stack

### Backend

* Python
* Flask
* SQLAlchemy
* Flask-JWT-Extended
* Flask-CORS

### Future Integrations

* Microsoft Sentinel (SIEM)
* Wazuh (Open-source SIEM)
* Email alerting services (SendGrid, SMTP)

---


## ⚙️ Setup Instructions

### 1. Clone the Repository

```
git clone <https://github.com/Termication/Managed-Security-Services>
cd mss-backend
```

---

### 2. Create Virtual Environment

```
python -m venv venv
```

Activate:

**Windows**

```
venv\Scripts\activate
```

**Mac/Linux**

```
source venv/bin/activate
```

---

### 3. Install Dependencies

```
pip install flask flask_sqlalchemy flask_jwt_extended flask_cors
```

---

### 4. Initialize Database

Run Python shell:

```
python
```

Then:

```
from app import create_app
from app.extensions import db

app = create_app()

with app.app_context():
    db.create_all()
```

---

### 5. Run the Server

```
python run.py
```

Server runs at:

```
http://127.0.0.1:5000
```

---

## 🧪 API Endpoints

### ✅ Health Check

```
GET /
```

Response:

```
{
  "message": "MSS API is running 🚀"
}
```

---

### 🏢 Create Client

```
POST /clients
```

Body:

```
{
  "name": "ABC Company",
  "email": "admin@abc.com"
}
```

---

### 🚨 Create Alert

```
POST /alerts
```

Body:

```
{
  "title": "Suspicious login detected",
  "severity": "high",
  "client_id": 1
}
```

---

## 🧠 Architecture Overview

```
Client Devices
      ↓
Endpoint Protection
      ↓
Cloud SIEM (future)
      ↓
Flask API (this project)
      ↓
Alerts & Dashboard
```

---

## 💰 Business Model

This platform is designed for **recurring revenue**:

* Monthly subscription per client
* Pricing per device or user
* Tiered plans (Starter, Growth, Premium)

---

## 🔮 Roadmap

* [ ] JWT Authentication (Admin & Client users)
* [ ] Role-based access control
* [ ] Device management endpoints
* [ ] Incident response system
* [ ] SIEM integration (Microsoft Sentinel / Wazuh)
* [ ] Real-time alerts (WebSockets)
* [ ] Reporting & analytics dashboard
* [ ] POPIA compliance features

---

## ⚠️ Disclaimer

This is an MVP (Minimum Viable Product) and is **not production-ready**.
For production deployment:

* Use Gunicorn or uWSGI
* Add proper logging
* Secure secrets (env variables)
* Use PostgreSQL instead of SQLite

---

## 👨‍💻 Author

<details>
    <summary>Innocent Mohlala</summary>
    <ul>
    <li><a href="https://www.github.com/termication">Github</a></li>
    <li><a href="https://www.twitter.com/Termication_">Twitter</a></li>
    <li><a href="mailto:terminalkarabo@gmail.com">e-mail</a></li>
    </ul>

---

## 📄 License

MIT License
