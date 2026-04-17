# Managed Security Services

A lean MVP for a subscription-based managed security service for SMEs. The current build includes:

- a Flask backend
- SQLite with SQLAlchemy models
- JWT-based authentication for admin and client users
- a simple web UI for login and dashboard access
- client and alert APIs with role-based access control

## Current Features

- Admin bootstrap flow for the first account
- Admin and client login with JWT
- Role-protected routes for clients and alerts
- Login page at `/login`
- Dashboard page at `/dashboard`
- Automatic local table creation on app startup

## Project Structure

```text
Managed Security Services/
|-- .env.example
|-- .gitignore
|-- README.md
|-- mss-backend/
|   |-- run.py
|   |-- app/
|   |   |-- __init__.py
|   |   |-- config.py
|   |   |-- extensions.py
|   |   |-- auth.py
|   |   |-- models/
|   |   |-- routes/
|   |   |-- static/
|   |   |-- templates/
```

## Environment Setup

Sensitive config has been moved out of source code.

1. Create a local `.env` file in the repo root.
2. Copy the values from [.env.example](C:/Users/termi/OneDrive/Documents/Managed%20Security%20Services/.env.example:1).
3. Replace them with your actual local settings.

Example:

```env
SQLALCHEMY_DATABASE_URI=sqlite:///C:/Users/termi/OneDrive/Documents/Managed Security Services/mss-backend/instance/mss.db
JWT_SECRET_KEY=put-a-long-random-secret-here
```

Notes:

- `.env` is ignored by git
- `.env.example` is safe to commit
- the app will not start unless `JWT_SECRET_KEY` is set

## Run The App

From the project root:

```powershell
cd "C:\Users\termi\OneDrive\Documents\Managed Security Services\mss-backend"
python run.py
```

If `python` is not available in your shell, use your virtual environment Python or `py -3`.

The default local app URL is:

```text
http://127.0.0.1:5000
```

## First Login Flow

1. Start the Flask server.
2. Open [http://127.0.0.1:5000/login](http://127.0.0.1:5000/login).
3. If no admin exists yet, the page will show the first-run admin setup form.
4. Create the admin account.
5. Sign in and continue to the dashboard.

## Current Routes

### UI Routes

- `GET /login`
- `GET /dashboard`

### Auth Routes

- `GET /auth/status`
- `POST /auth/setup-admin`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/client-users`

### Client Routes

- `GET /clients`
- `POST /clients`

### Alert Routes

- `GET /alerts`
- `POST /alerts`

## Role Behavior

- `admin` users can create and view all clients and alerts
- `client` users can sign in and only see their own client record and alerts

## Tech Stack

- Flask
- Flask-CORS
- Flask-JWT-Extended
- Flask-SQLAlchemy
- SQLite
- HTML, CSS, and vanilla JavaScript for the current frontend

## Local Development Notes

- SQLite data is stored locally and ignored by git
- Flask instance data is ignored by git
- local secret files are ignored by git
- the current frontend is server-rendered through Flask templates

## Next Recommended Steps

- add admin forms on the dashboard for creating clients and client users
- add alert creation and filtering in the UI
- add device management
- move from `db.create_all()` to proper migrations
- add password reset and account management
