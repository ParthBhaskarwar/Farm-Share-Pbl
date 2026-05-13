const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');

const globalErrorHandler = require('./controllers/ErrorController');
const EquipmentController = require('./controllers/EquipmentController');
const AdminRouter = require('./routes/adminRoutes');
const AuthRouter = require('./routes/authRoutes');
const FarmerRouter = require('./routes/farmerRoutes');
const EquipmentRouter = require('./routes/equipmentRoutes');
const BookingRouter = require('./routes/bookingRoutes');
const FarmerEquipmentModel = require('./models/FarmerEquipmentModel');

const app = express();

app.use(express.json());

app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:3000'].filter(Boolean),
  credentials: true
}));

app.use(cookieParser());

app.use(express.static("public"));

mongoose.connect(process.env.DB).then(() => console.log('DB connected'))
  .catch(err => {
    console.error('DB connection failed', err);
    process.exit(1);
  });

cron.schedule('0 0 * * *', async () => {
  const pending = await FarmerEquipmentModel.find({
    status: 'listed',
    inspectionCompleted: true,
    equipmentPublished: false
  });

  for (const equip of pending) {
    await EquipmentController.calculateHealthAndPublish(equip._id);
  }
});

app.post("/distance", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      req.body,
      {
        headers: {
          Authorization: process.env.ORS_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("ORS backend error:", err.response?.data || err.message);
    res.status(500).json({ error: "Route fetch failed" });
  }
});

app.use("/api/admin", AdminRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/booking", BookingRouter);
app.use("/api/equipment", EquipmentRouter);
app.use("/api/farmer", FarmerRouter);


app.use(globalErrorHandler);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
