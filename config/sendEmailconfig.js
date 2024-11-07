
const nodemailer=require("nodemailer")
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port:  587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASS,
    },
  });

  const sendMail = async (mailOptions) => {
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
      // Do not send response here, as it's outside of the route handler
    } catch (error) {
      console.error(error);
      // Do not send response here, as it's outside of the route handler
    }
  };

  module.exports=sendMail;




  