# Farmshare Frontend 🚜

The user-facing React application for the Farmshare Platform. It provides a modern, responsive interface for farmers to list, find, and book agriculture equipment.

## ✨ Features
- **Intuitive Dashboard**: Personal overview of listings, bookings, and trust metrics.
- **Advanced Search**: Filter equipment by type, location, and availability.
- **Interactive Maps**: Visualize equipment locations and calculate routes using Leaflet.js.
- **Booking Flow**: Streamlined calendar-based booking with instant payment integration.
- **Crop Calendar**: Seasonal guidance and agricultural insights.
- **Support Chatbot**: Integrated AI assistant for user queries.

## 🛠️ Tech Stack
- **Framework**: React.js (v19)
- **Styling**: Tailwind CSS
- **State Management**: React Context / Hooks
- **Data Visualization**: Recharts
- **Mapping**: Leaflet / React-Leaflet
- **Authentication**: Google OAuth 2.0 via `@react-oauth/google`

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in this directory with the following variables (see `.env.example`):
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GOOGLE_CLIENT_ID=your_google_id
```

### 3. Running Locally
```bash
npm start
```
The app will run at [http://localhost:3000](http://localhost:3000).

## 📁 Key Components
- `pages/Landing.js`: The main welcome page.
- `pages/SearchEquipment.js`: Equipment discovery with maps.
- `components/Profile/TrustScore.js`: Visualization of farmer reliability.
- `components/EquipmentDetails/PricingBookingCard.js`: Handles the rental transaction logic.

## 🎨 UI Design
Farmshare uses a custom green-centric palette to reflect the agricultural theme, utilizing Tailwind CSS for a modern, mobile-responsive experience.
