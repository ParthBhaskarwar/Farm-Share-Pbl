module.exports = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Your Email</title>
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
        Thank you for starting your registration with <strong>FarmShare</strong>.
        To continue, please verify your email address using the one-time verification code below.
      </p>

      <div class="otp-box">
        <div class="otp">${otp}</div>
      </div>

      <p>
        ⏳ This code is valid for <strong>10 minutes</strong>.
        Please do not share this code with anyone.
      </p>

      <p>
        If you did not request this verification, you can safely ignore this email.
      </p>

      <p>
        After verification, you’ll be able to complete your registration and start using FarmShare.
      </p>
    </div>

    <div class="footer">
      <p>— FarmShare Team 🌱</p>
      <p>Helping farmers connect smarter</p>
    </div>
  </div>
</body>
</html>
`