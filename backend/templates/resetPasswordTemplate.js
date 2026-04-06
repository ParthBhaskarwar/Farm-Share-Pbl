module.exports = (resetUrl) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f6f8;
      padding: 20px;
    }
    .container {
      max-width: 500px;
      background: white;
      padding: 30px;
      border-radius: 8px;
    }
    .btn {
      display: inline-block;
      padding: 12px 20px;
      background: #2563eb;
      color: white;
      text-decoration: none;
      border-radius: 6px;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Reset</h2>
    <p>You requested to reset your password.</p>
    <a class="btn" href="${resetUrl}">Reset Password</a>
    <p class="footer">
      Link expires in 15 minutes.<br/>
      If you didn't request this, ignore this email.
    </p>
  </div>
</body>
</html>
`;
