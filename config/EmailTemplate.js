const mailOptions = (receiver, otp) => {
    return {
      from: {
        name: "Ashutosh Payasi.",
        address: process.env.EMAIL_USER, // Sender's email address
      },
      to: receiver, // Receiver's email address
      subject: "Verify your Account - OTP Inside",
      text: `Your OTP code is ${otp}`, // Fallback plain text version
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                width: 100%;
                padding: 20px;
                background-color: #ffffff;
                max-width: 600px;
                margin: 20px auto;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                padding-bottom: 20px;
              }
              .header h1 {
                color: #333333;
              }
              .content {
                text-align: center;
                font-size: 16px;
                color: #555555;
              }
              .otp-code {
                font-size: 24px;
                font-weight: bold;
                color: #ff6f61;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                color: #aaaaaa;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Verify Your Account</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>Thank you for registering with Ashutosh Payasi!</p>
                <p>Your OTP code to verify your account is:</p>
                <div class="otp-code">${otp}</div>
                <p>Please enter this code to complete your account verification.</p>
                <p>If you did not request this, please ignore this email.</p>
              </div>
              <div class="footer">
                <p>&copy; 2024 Ashutosh Payasi. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };
  };
  
  module.exports = mailOptions;
  