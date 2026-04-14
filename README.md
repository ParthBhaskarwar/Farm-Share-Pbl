# Farmshare - Peer-to-Peer Farm Equipment Sharing Platform 🚜🌾

Farmshare is a comprehensive MERN (MongoDB, Express, React, Node.js) stack application designed to empower farmers by providing a marketplace for sharing and renting agricultural equipment. It integrates modern technologies like Razorpay for payments, Google OAuth for authentication, and various GIS services for route calculation.

## 🚀 Key Features

- **Equipment Marketplace**: Farmers can list their equipment for rent and browse available tools.
- **Smart Booking System**: Peer-to-peer booking with availability management.
- **Secure Payments**: Integrated with Razorpay for safe transactions.
- **Trust & Reputation**: Built-in trust scoring for both owners and renters based on reviews and history.
- **AI-Powered Insights**: Crop calendar and equipment health monitoring.
- **Route Optimization**: Integrated OpenRouteService for calculating distance and routes between farmers.
- **Authentication**: Secure login using JWT and Google OAuth (Passkey-ready implementation).

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Leaflet.js (Maps), Recharts.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Authentication**: JWT, Google OAuth.
- **Integrations**: Razorpay (Payments), Cloudinary (Image Uploads), SendGrid (Email), OpenRouteService (GIS).

## 📂 Project Structure

```text
Full-stack-1/
├── backend/               # Node.js/Express server
│   ├── controllers/       # Business logic
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API endpoints
│   └── app.js             # Entry point
├── farmshare-master/      # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   └── api/           # API integration (Axios)
└── README.md              # Root documentation
```

## 🏁 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB account
- API Keys for Razorpay, Cloudinary, SendGrid, and OpenRouteService

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Setup Backend**:
   - Navigate to `backend/`
   - Run `npm install`
   - Create `config.env` (refer to `config.env.example`)
   - Start the server: `npm run dev`

3. **Setup Frontend**:
   - Navigate to `farmshare-master/`
   - Run `npm install`
   - Create `.env` (refer to `.env.example`)
   - Start the app: `npm start`

## 👥 Contributors
- [Your Name/Organization]

## 📄 License
This project is licensed under the MIT License.
