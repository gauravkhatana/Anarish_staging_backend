const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

// MongoDB connection
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  isConnected = true;
};

// MongoDB Schema
const UserSchema = new mongoose.Schema({
    _id: new mongoose.Types.ObjectId(),
    name,
    email,
    phoneNumber,
    intrests,
    projectRequirements,
    date: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Nodemailer configuration
// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: process.env.EMAIL_USER, // Your email
//     pass: process.env.EMAIL_PASS  // Your email password
//   }
// });
const transporter = nodemailer.createTransport({
      host: "anarish.com",
      port: 587,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS 
      },
      tls: {
        rejectUnauthorized: false,
      },
      pool: true, // Use connection pooling for better performance
      maxConnections: 5, // Maximum number of concurrent connections
      // connectionTimeout: 10000, // Increase timeout (in ms)
      // greetingTimeout: 20000, // Increase greeting timeout (in ms)
    });
// Background function
export const config = { runtime: 'experimental-edge' };

export default async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  try {
    await connectToDatabase();

    // Save to database
    const newUser = new User({ name, email, phoneNumber, intrests, projectRequirements });
    await newUser.save();

    // Send emails in the background
    sendEmails({ name, email, phoneNumber, projectRequirements });

    return res.status(200).json({
      status: 'success',
      message: 'Your request has been submitted successfully.'
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while processing your request.'
    });
  }
}

// Background function to send emails
const sendEmails = async ({ name, email, phoneNumber, projectRequirements}) => {
  try {
    // Email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting us!',
      text: `Hi ${name},\n\nThank you for reaching out to us. We will get back to you shortly.\n\nBest regards,\nYour Company`
    };

    // Email to agency
    const agencyMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.AGENCY_EMAIL, // Replace with agency email
      subject: 'New Contact Us Submission',
      text: `You have received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(agencyMailOptions);
    console.log('Emails sent successfully');
  } catch (error) {
    console.error('Error sending emails:', error);
  }
};