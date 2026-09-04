# Vehicle Reselling — Django Backend

## Run

```bash
cd backend
.\.venv\Scripts\Activate.ps1
py manage.py migrate
py manage.py createsuperuser
# Bind to all interfaces so a physical phone on Wi‑Fi can reach the API:
py manage.py runserver 0.0.0.0:8000
```

API (this PC): `http://127.0.0.1:8000/`  
API (phone on same Wi‑Fi): `http://<your-lan-ip>:8000/` (e.g. `http://192.168.1.45:8000`)

In the mobile app, set `EXPO_PUBLIC_API_URL` in `.env`, or rely on auto-detect from Expo’s LAN IP.

### OTP by email (Azure Graph)

Configured via `.env`:

```text
AZURE_TENANT_ID=...
AZURE_CLIENT_ID=...
AZURE_CLIENT_SECRET=...
AZURE_SENDER_EMAIL=noreply@yourdomain.com
EMAIL_BACKEND=accounts.email_backends.AzureGraphEmailBackend
```

The Azure app needs **Application** permission `Mail.Send` with admin consent, and the sender mailbox must exist.

Without Azure vars, Django falls back to the console backend (OTP printed in the terminal).
In DEBUG, the API also returns `dev_otp`.

## Auth

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/auth/register/` | Public |
| POST | `/api/auth/register/verify-otp/` | Public |
| POST | `/api/auth/register/resend-otp/` | Public |
| POST | `/api/auth/login/otp/request/` | Public |
| POST | `/api/auth/login/otp/verify/` | Public |
| POST | `/api/auth/login/password/` | Public |
| GET/PATCH | `/api/auth/me/` | JWT |

### Register

```json
{
  "full_name": "Ada Sharma",
  "mobile": "9876543210",
  "email": "ada@example.com",
  "city": "Pune",
  "state": "Maharashtra",
  "pin_code": "411001",
  "password": "",
  "accepted_terms": true
}
```

Password is optional. Header after login: `Authorization: Bearer <access>`

## Listings

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/listings/` | Public (active) |
| POST | `/api/listings/` | JWT |
| GET/PATCH/DELETE | `/api/listings/<id>/` | Public read / owner write |

Query: `?city=Pune`, `?mine=true`
