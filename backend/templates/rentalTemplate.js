module.exports = (booking) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Booking Received</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }

    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.08);
    }

    .header {
      text-align: center;
      margin-bottom: 20px;
    }

    .header h1 {
      color: #2e7d32;
      margin: 0;
    }

    .content {
      color: #333;
      font-size: 15px;
      line-height: 1.6;
    }

    .booking-box {
      margin: 25px 0;
      background: #f1f8e9;
      padding: 20px;
      border-radius: 8px;
    }

    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;
    }

    .label {
      color: #555;
    }

    .value {
      font-weight: bold;
      color: #2e7d32;
    }

    .highlight {
      color: #d32f2f;
      font-weight: bold;
    }

    .footer {
      margin-top: 30px;
      font-size: 13px;
      color: #777;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="container">

    <div class="header">
      <h1>FarmShare</h1>
      <p style="margin:5px 0 0 0; color:#555;">New Booking Received 🚜</p>
    </div>

    <div class="content">

      <p>Hello <strong>${booking.equipment?.farmer?.name || "Owner"}</strong> 👋</p>

      <p>
        Good news! A farmer has booked your equipment.
        Please find the booking details below:
      </p>

      <div class="booking-box">

        <div class="row">
          <span class="label">Equipment Name</span>
          <span class="value">${booking.equipment?.equipmentName || "-"}</span>
        </div>

        <div class="row">
          <span class="label">Farmer Name</span>
          <span class="value">${booking.farmer?.name || "-"}</span>
        </div>

        <div class="row">
          <span class="label">Village</span>
          <span class="value">${booking.farmer?.village || "-"}</span>
        </div>

        <div class="row">
          <span class="label">Phone Number</span>
          <span class="value">${booking.farmer?.phone_number || "-"}</span>
        </div>

        <div class="row">
          <span class="label">Booking Date</span>
          <span class="value">${booking.startDate || "-"}</span>
        </div>

        <div class="row">
          <span class="label">Time Slot</span>
          <span class="value">${booking.timeSlot?.startTime || "-"} - ${booking.timeSlot?.endTime || "-"}</span>
        </div>

        <div class="row">
          <span class="label">Duration</span>
          <span class="value">${booking.duration || "-"}</span>
        </div>

        ${
          booking.isOperatorRequired
            ? `
        <div class="row">
          <span class="label">Process of Operation</span>
          <span class="value">${booking.service.process || "-"}</span>
        </div>

        <div class="row">
          <span class="label">Land Size</span>
          <span class="value">${booking.service.landSize ? booking.service.landSize + " acres" : "-"}</span>
        </div>
        `
            : ""
        }

        <div class="row">
          <span class="label">Total Amount</span>
          <span class="value">₹ ${booking.totalAmount || "-"}</span>
        </div>

        <div class="row">
          <span class="label">Transport Required</span>
          <span class="value">${booking.isTransportRequired ? "Yes" : "No"}</span>
        </div>

        <div class="row">
          <span class="label">Operator Required</span>
          <span class="value">${booking.isOperatorRequired ? "Yes" : "No"}</span>
        </div>

        <div class="row">
          <span class="label">Booking Status</span>
          <span class="value highlight">${booking.bookingStatus || "-"}</span>
        </div>

      </div>

      <p>
        Please contact the farmer as soon as possible to confirm the pickup and availability.
      </p>

      <p>
        You can manage this booking from your dashboard.
      </p>

    </div>

    <div class="footer">
      <p>— FarmShare Team 🌱</p>
      <p>Helping farmers connect smarter</p>
    </div>

  </div>
</body>
</html>
`;