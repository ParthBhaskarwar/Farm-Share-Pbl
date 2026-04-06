// routes/paymentRoutes.js
const express = require("express");
const axios = require('axios');
const AuthController = require('./../controllers/AuthController');
const FarmerController = require('./../controllers/FarmerController');
const BookingController = require('./../controllers/BookingController');
const TrustController = require('./../controllers/TrustController');
const ReviewController = require('./../controllers/ReviewController');
const FarmerModel = require('./../models/FarmerModel');
const FarmerEquipmentModel = require('./../models/FarmerEquipmentModel');
const BookingModel = require('./../models/BookingModel');
const multer = require('./../multer');
const router = express.Router();

router.get('/profile', AuthController.protect, FarmerController.getFarmer);
router.get('/me', AuthController.protect, AuthController.checkAuth);
router.patch(
  '/profile',
  AuthController.protect,
  multer.uploadSingle, // Parses photo if present, ignores if not
  FarmerController.updateFarmerProfile
);
router.put('/myPhoto', AuthController.protect, multer.uploadSingle, FarmerController.uploadFarmerPhoto);
router.get('/myEquipments', AuthController.protect, FarmerController.getMyEquipments);
router.get('/ownerTrust/:id', TrustController.getOwnerTrustScore);
router.get('/renterTrust/:id', TrustController.getRenterTrustScore);
router.post('/review/:farmerId', AuthController.protect, ReviewController.makeFarmerReview);
router.get('/:farmerId/review', AuthController.protect, ReviewController.getFarmerReviews);
router.get('/myRentals', AuthController.protect, BookingController.getRentals);
router.get('/myBookings', AuthController.protect, BookingController.getBookings);
router.post("/chat", AuthController.protect, async (req, res) => {
  try {
    const languageMap = {
      English: "en",
      Hindi: "hi",
      Marathi: "mr",
    };

    const farmerId = req.farmer._id;
    const { message } = req.body;

    // 1️⃣ Fetch farmer info
    const farmer = await FarmerModel.findById(farmerId);
    const farmerLoc = farmer.location.coordinates;
    const preferredCrops = farmer.preferredCrops || [];
    const preferredLang = languageMap[farmer.preferredLanguage] || "en";

    // 2️⃣ Detect query intent
    const lowerMessage = message.toLowerCase();
    const isEquipmentQuery =
      lowerMessage.includes('equipment') ||
      lowerMessage.includes('tractor') ||
      lowerMessage.includes('harvester') ||
      lowerMessage.includes('near') ||
      lowerMessage.includes('show') ||
      lowerMessage.includes('find') ||
      lowerMessage.includes('दिखाओ') ||
      lowerMessage.includes('ट्रैक्टर') ||
      lowerMessage.match(/wheat|rice|cotton|soybean|sugarcane/);

    let systemPrompt = '';

    if (isEquipmentQuery) {
      // 3️⃣ Fetch nearby equipment only if needed
      const nearbyEquipment = await FarmerEquipmentModel.find({
        available: true,
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: farmerLoc },
            $maxDistance: 20000,
          },
        },
      })
        .limit(5) // Limit to top 5
        .populate("equipment");

      const equipmentList = nearbyEquipment.map((e) => {
        return `${e.equipment.equipmentName} - ₹${e.dynamicPrice || e.pricePerHour}/hr - Operator: ${e.includesOperator ? "Yes" : "No"} - Suitable for: ${e.equipment.suitableCrops.join(", ")}`;
      }).join("\n");

      systemPrompt = `You are FarmShare AI assistant. Reply in ${preferredLang === 'hi' ? 'Hindi' : preferredLang === 'mr' ? 'Marathi' : 'English'}.

Farmer grows: ${preferredCrops.join(", ") || "All crops"}

Available equipment nearby:
${equipmentList || "No equipment available nearby"}

IMPORTANT: 
- Suggest 2-3 BEST equipment based on farmer's crops and question
- Mention price, operator availability, and suitability
- Keep response under 150 words
- Be conversational and helpful`;

    } else {
      // General knowledge queries
      systemPrompt = `You are FarmShare AI assistant helping farmers. Reply in ${preferredLang === 'hi' ? 'Hindi' : preferredLang === 'mr' ? 'Marathi' : 'English'}.

You can help with:
- Equipment recommendations and booking process
- Dynamic pricing explanation (adjusts based on demand, equipment health, distance)
- Crop planning and farming advice
- Trust score system (based on timely returns, equipment care, payment history)
- How to use the platform

IMPORTANT:
- Keep answers concise (under 200 words)
- Be practical and farmer-friendly
- If asked about specific equipment, suggest searching or checking the Search page`;
    }

    // 4️⃣ Call Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser question: ${message}\n\nProvide a helpful, concise answer.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 800, // Increased for better responses
          topP: 0.95,
          topK: 40
        }
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // 5️⃣ Extract reply
    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I cannot answer right now. Please try again.";

    res.json({ reply });

  } catch (err) {
    console.error('Gemini API Error:', err.response?.data || err.message);

    // Fallback responses
    const fallbackResponses = {
      'pricing': 'Our dynamic pricing adjusts based on equipment condition, distance, and demand. You typically save 60% compared to ownership. Check specific equipment for exact pricing.',
      'book': 'To book: 1) Search equipment 2) Select date & time 3) Choose services (operator/transport) 4) See price 5) Pay securely. Need help finding equipment?',
      'trust': 'Your trust score is based on: timely returns (40%), equipment care (30%), payment history (20%), and reviews (10%). Higher scores unlock better rates!',
      'default': 'I can help you find equipment, explain pricing, book rentals, or answer farming questions. What would you like to know?'
    };

    const lowerMsg = req.body.message.toLowerCase();
    let fallback = fallbackResponses.default;

    if (lowerMsg.includes('price') || lowerMsg.includes('cost')) fallback = fallbackResponses.pricing;
    else if (lowerMsg.includes('book') || lowerMsg.includes('rent')) fallback = fallbackResponses.book;
    else if (lowerMsg.includes('trust') || lowerMsg.includes('score')) fallback = fallbackResponses.trust;

    res.json({ reply: fallback });
  }
});

// Get today's jobs (for equipment owners)
router.get('/todaysJobs', AuthController.protect, async (req, res) => {
  try {
    const farmerId = req.farmer._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find equipment owned by this farmer
    const myEquipment = await FarmerEquipmentModel.find({ 
      farmer: farmerId 
    }).select('_id');
    
    const equipmentIds = myEquipment.map(eq => eq._id);

    // Find all bookings for my equipment today
    const jobs = await BookingModel.find({
      equipment: { $in: equipmentIds },
      startDate: { $gte: today, $lt: tomorrow },
      bookingStatus: { $in: ['confirmed', 'active'] }
    })
    .populate('farmer', 'name phone_number village location')
    .populate({
      path: 'equipment',
      populate: {
        path: 'equipment',
        select: 'equipmentName equipmentType'
      }
    });

    // Transform to map-friendly format
    const mapJobs = jobs.map(job => ({
      _id: job._id,
      renterName: job.farmer?.name,
      renterPhone: job.farmer?.phone_number,
      renterVillage: job.farmer?.village,
      equipmentName: job.equipment?.equipment?.equipmentName,
      startTime: job.timeSlot?.startTime,
      endTime: job.timeSlot?.endTime,
      location: {
        lat: job.farmer?.location?.coordinates?.[1],
        lng: job.farmer?.location?.coordinates?.[0]
      },
      isOperatorRequired:job.isOperatorRequired,
      isTransportRequired:job.isTransportRequired

    })).filter(job => job.location.lat && job.location.lng); // Filter out null locations

    // Owner's location
    const ownerLocation = {
      lat: req.farmer.location.coordinates[1],
      lng: req.farmer.location.coordinates[0]
    };

    res.json({
      status: 'success',
      ownerLocation,
      jobs: mapJobs
    });
  } catch (err) {
    console.error('todaysJobs error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get rented equipment locations (for renters)
router.get('/myRentedLocations', AuthController.protect, async (req, res) => {
  try {
    const farmerId = req.farmer._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find all bookings where I'm the renter and booking is today
    const rentals = await BookingModel.find({
      farmer: farmerId,
      startDate: { $gte: today, $lt: tomorrow },
      bookingStatus: { $in: ['confirmed', 'active'] }
    })
    .populate({
      path: 'equipment',
      populate: [
        {
          path: 'equipment',
          select: 'equipmentName equipmentType'
        },
        {
          path: 'farmer',
          select: 'name phone_number village'
        }
      ]
    });

    // Transform to map-friendly format
    const mapRentals = rentals.map(rental => ({
      _id: rental._id,
      ownerName: rental.equipment?.farmer?.name,
      ownerPhone: rental.equipment?.farmer?.phone_number,
      ownerVillage: rental.equipment?.farmer?.village,
      equipmentName: rental.equipment?.equipment?.equipmentName,
      startTime: rental.timeSlot?.startTime,
      endTime: rental.timeSlot?.endTime,
      location: {
        lat: rental.equipment?.location?.coordinates?.[1],
        lng: rental.equipment?.location?.coordinates?.[0]
      }
    })).filter(rental => rental.location.lat && rental.location.lng); // Filter out null locations

    // Renter's location
    const renterLocation = {
      lat: req.farmer.location.coordinates[1],
      lng: req.farmer.location.coordinates[0]
    };

    res.json({
      status: 'success',
      renterLocation,
      rentals: mapRentals
    });
  } catch (err) {
    console.error('myRentedLocations error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

