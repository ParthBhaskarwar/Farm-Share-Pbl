# Farmshare Backend 🚀

This is the Node.js/Express backend for the Farmshare platform. It provides a RESTful API for managing farmers, equipment, bookings, payments, and trust scores.

## 🛠️ Features
- **Farmer Management**: Profiles, authentication, and trust scoring.
- **Equipment Catalog**: CRUD operations for tools, automated health score calculation.
- **Booking Engine**: Handle reservation logic and status updates.
- **Payment Integration**: Razorpay API for secure transactions.
- **Media Support**: Cloudinary integration for equipment image hosting.
- **Automated Tasks**: Cron jobs for daily equipment status updates.

## 📦 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Security**: JWT, bcryptjs, Google OAuth
- **Messaging/Email**: SendGrid
- **Mapping**: OpenRouteService (ORS)

## ⚙️ Configuration
The server uses environment variables stored in a `config.env` file. A template is provided in `config.env.example`.

### Required Variables:
- `DB`: MongoDB connection string.
- `SECRET_KEY`: JWT signing secret.
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`: Razorpay credentials.
- `CLOUD_NAME`, `API_KEY`, `API_SECRET`: Cloudinary configuration.
- `ORS_KEY`: OpenRouteService API key for distance calculations.

## 🚀 API Routes Summary

| Route | Description |
|-------|-------------|
| `/api/auth` | Login, Registration, Google OAuth |
| `/api/farmer` | Farmer profiles, dashboard data, trust scores |
| `/api/equipment` | Listing and searching for farm tools |
| `/api/booking` | Creating and managing rental bookings |
| `/api/admin` | Administrative controls (internal) |

## 🧪 Development
To start the server in development mode with `nodemon`:
```bash
npm install
npm run dev
```

## 🏗️ Folder Structure
- `controllers/`: Logic for each route.
- `models/`: Mongoose schemas.
- `routes/`: Express router definitions.
- `utils/`: Helper functions and services (Mail, Cloudinary).
- `app.js`: Application setup and middleware configuration.
