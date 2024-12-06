// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");

// dotenv.config();

// // Configure nodemailer transporter
// const transporter = nodemailer.createTransport({
//   host: "anarish.com",
//   port: 587,
//   secure: false, 
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
//   pool: true, // Use connection pooling for better performance
//   maxConnections: 5, // Maximum number of concurrent connections
//   // connectionTimeout: 10000, // Increase timeout (in ms)
//   // greetingTimeout: 20000, // Increase greeting timeout (in ms)
// });

// // Correcting sendEmail function to handle async behavior properly
// const sendEmail = async (to, cc, subject, html) => {
//   const mailOptions = { 
//     from: { name: "Anarish Innovations", address: process.env.EMAIL_USER },
//     to,
//     cc,
//     subject,
//     html,
//   };

//   console.log("email send called");

//   try {
//     const info = await transporter.sendMail(mailOptions); 
//     console.log("Email sent: " + info.response); 
//   } catch (err) {
//     console.error("Error sending email:", err); 
//   }
// };

// module.exports = sendEmail;

const nodemailer = require("nodemailer");
// const dotenv = require("dotenv");

dotenv.config();

// Log the email user and password to ensure correct loading of environment variables
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "anarish.com", // Make sure this is the correct SMTP server
  port: 587, // Default SMTP port for STARTTLS
  secure: false, // Use false for port 587 (true for 465)
  auth: {
    user: "mail@anarish.com",
    pass: "Anarish@123",
  },
  tls: {
    rejectUnauthorized: false, // Allows the connection even if the certificate is not verified
  },
  pool: true, // Connection pooling for better performance
  maxConnections: 5, // Limit number of concurrent connections
});

// Test SMTP connection to ensure the transporter works
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP connection successful:", success);
  }
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
    console.error("Error sending email:", err.message || err); 
    console.error(err);  // Log the entire error for better debugging
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