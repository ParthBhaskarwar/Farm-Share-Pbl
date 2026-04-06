module.exports = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Equipment Return Verification</title>
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
    .otp-box {
      margin: 25px 0;
      text-align: center;
    }
    .otp {
      display: inline-block;
      background: #f1f8e9;
      color: #2e7d32;
      font-size: 28px;
      letter-spacing: 6px;
      padding: 12px 24px;
      border-radius: 6px;
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
    </div>

    <div class="content">
      <p>Hello 👋</p>

      <p>
        This email is to verify the return of your rented equipment
        <strong>to FarmShare</strong>.
      </p>

      <p>
        Please share the one-time verification code below at the time of equipment return.
      </p>

      <div class="otp-box">
        <div class="otp">${otp}</div>
      </div>

      <p>
        ⏳ This OTP is valid for <strong>24 hours</strong> and can be used only once.
        Please ensure the equipment is returned in proper condition before sharing the code.
      </p>

      <p>
        If you did not initiate this return request, please contact our support team immediately.
      </p>

      <p>
        Thank you for using FarmShare and supporting smarter farming 🚜
      </p>
    </div>

    <div class="footer">
      <p>— FarmShare Team 🌱</p>
      <p>Making equipment sharing simple & secure</p>
    </div>
  </div>
</body>
</html>
`;
