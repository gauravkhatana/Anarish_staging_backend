const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "anarish.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  pool: true, // Use connection pooling for better performance
  maxConnections: 5, // Maximum number of concurrent connections
  // connectionTimeout: 10000, // Increase timeout (in ms)
  // greetingTimeout: 20000, // Increase greeting timeout (in ms)
});

// Correcting sendEmail function to handle async behavior properly
const sendEmail = async (to, cc, subject, html) => {
  const mailOptions = { 
    from: { name: "Anarish Innovations", address: process.env.EMAIL_USER },
    to,
    cc,
    subject,
    html,
  };

  console.log("email send called");

  try {
    const info = await transporter.sendMail(mailOptions); 
    console.log("Email sent: " + info.response); 
  } catch (err) {
    console.error("Error sending email:", err); 
  }
};

module.exports = sendEmail;


  // return transporter.sendMail(mailOptions)
  // .then(info => {
  //   console.log("Email sent: " + info.response);
  // })
  // .catch(error => {
  //   console.error("Error sending email:", error);
  //   throw error;
  // });