// const nodemailer = require('nodemailer');
// const mongoose = require('mongoose');
// const User = require("../models/users");

// // MongoDB connection
// let isConnected = false;

// // const connectToDatabase = async () => {
// //   if (isConnected) return;
// //   await mongoose.connect(process.env.MONGO_URI, {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true
// //   });
// //   isConnected = true;
// // };

// // MongoDB Schema


// // const User = mongoose.models.User || mongoose.model('User', User);

// // Nodemailer configuration
// // const transporter = nodemailer.createTransport({
// //   service: 'Gmail',
// //   auth: {
// //     user: process.env.EMAIL_USER, // Your email
// //     pass: process.env.EMAIL_PASS  // Your email password
// //   }
// // });
// const transporter = nodemailer.createTransport({
//       host: "anarish.com",
//       port: 465,
//       secure: true, 
//       auth: {
//         user: process.env.EMAIL_USER, // Your email
//         pass: process.env.EMAIL_PASS 
//       },
//       tls: {
//         rejectUnauthorized: false,
//       },
//       pool: true, // Use connection pooling for better performance
//       maxConnections: 5, // Maximum number of concurrent connections
//       // connectionTimeout: 10000, // Increase timeout (in ms)
//       // greetingTimeout: 20000, // Increase greeting timeout (in ms)
//     });
// // Background function
// const config = { runtime: 'experimental-edge' };

// exports.saveUser =  async function (req, res) {
//     // const { name, email, phoneNumber, intrests, projectRequirements, date } = req.body;



//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   const {name, email, phoneNumber, intrests, projectRequirements, date } = req.body;

//   try {
//     const user = new User({
//         _id: new mongoose.Types.ObjectId(),
//         name,
//         email,
//         phoneNumber,
//         intrests,
//         projectRequirements,
//         date
//     });

//     // Save to database
//     await user.save();

//     // Send emails in the background
//   sendEmails({ name, email, phoneNumber, projectRequirements });

//     return res.status(200).json({
//       status: 'success',
//       message: 'Your request has been submitted successfully.'
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     return res.status(500).json({
//       status: 'error',
//       message: 'An error occurred while processing your request.'
//     });
//   }
// }

// // Background function to send emails
// const sendEmails = async ({ name, email, phoneNumber, projectRequirements}) => {
//     // Email to user
//     const userMailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'Thank you for contacting us!',
//       text: `Hi ${name},\n\nThank you for reaching out to us. We will get back to you shortly.\n\nBest regards,\nYour Company`
//     };

//     // Email to agency
//     const agencyMailOptions = {
//       from: process.env.EMAIL_USER,
//       to: process.env.AGENCY_EMAIL, // Replace with agency email
//       subject: 'New Contact Us Submission',
//       text: `You have received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${projectRequirements}`
//     };
//     try {
//         await transporter.sendMail(userMailOptions);
//     } catch(err) {
//         console.error('Error has occured while sending mail to User' +err);
//     }

//     try {
//         await transporter.sendMail(agencyMailOptions);
//     } catch(err) {
//         console.error('Error has occured while sending mail to Anarish' +err);
//     }
// };


const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const User = require("../models/users");

// MongoDB connection
let isConnected = false;

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
          host: "smtp.anarish.com",
          port: 587,       
          secure: false,           
        //   secureProtocol: 'TLSv1_3_method',  
          auth: {
            user: process.env.EMAIL_USER, 
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

// Main handler to save user and send emails
exports.saveUser = async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, phoneNumber, intrests, projectRequirements, date } = req.body;

  try {

    // Save user to MongoDB
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name,
      email,
      phoneNumber,
      intrests,
      projectRequirements,
      date,
    });
    await user.save();

    // Send emails in the background
    await sendEmails({ name, email, phoneNumber, projectRequirements });

    return res.status(200).json({
      status: 'success',
      message: 'Your request has been submitted successfully.',
    });
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while processing your request.',
    });
  }
};

// Function to send emails with proper promise-based error handling
const sendEmails = async ({ name, email, phoneNumber, projectRequirements }) => {
  // Email to the user
  const userMailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank you for contacting us!',
    text: `Hi ${name},\n\nThank you for reaching out to us. We will get back to you shortly.\n\nBest regards,\nYour Company`,
  };

  // Email to the agency
  const agencyMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.AGENCY_EMAIL, // Replace with agency email
    subject: 'New Contact Us Submission',
    text: `You have received a new message:\n\nName: ${name}\nEmail: ${email}\nPhone Number: ${phoneNumber}\nMessage: ${projectRequirements}`,
  };

  try {
    await Promise.all([
      sendMail(userMailOptions, 'User'),
      sendMail(agencyMailOptions, 'Agency')
    ]);
    console.log('Both emails sent successfully.');
  } catch (error) {
    console.error('Error occurred while sending emails:', error);
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused, check server or firewall.');
    } else if (error.code === '421') {
      console.error('Too many connections, try again later.');
    } else if (error.message.includes('SMTP AUTH')) {
      console.error('SMTP Authentication error.');
    } else {
      console.error('General error:', error.message);
    }
  }
};

// Helper function to send emails
const sendMail = (mailOptions, recipientType) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(`Failed to send email to ${recipientType}:`, err.message);
        reject(err);
      } else {
        console.log(`Email sent to ${recipientType}:`, info.response);
        resolve(info);
      }
    });
  });
};

exports.getUser = async (req, resp) => {
    try {
      const users = await User.find();
      resp.status(200).json({
        message: "Users fetched successfully",
        users,
      });
    } catch (err) {
      resp.status(500).json({ error: err.message });
    }
  };
  
  // Get user by ID
  exports.getUserById = async (req, resp) => {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return resp.status(404).json({ message: "User not found" });
      }
      resp.status(200).json({
        message: `User with ID: ${id} fetched successfully`,
        user,
      });
    } catch (error) {
      resp.status(500).json({ error: "Failed to retrieve user" });
    }
  };
  
  // Update user
  exports.updateUser = async (req, resp) => {
    const { id } = req.params;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedUser) {
        return resp.status(404).json({
          message: `No user present with this ID: ${id}`,
        });
      }
      resp.status(200).json({
        message: `User with ID: ${id} updated successfully`,
        updatedUser,
      });
    } catch (err) {
      resp.status(500).json({ error: err.message });
    }
  };
  
  // Delete user
  exports.deleteUser = async (req, resp) => {
    const { id } = req.params;
  
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return resp.status(404).json({
          message: `No user present with this ID: ${id}`,
        });
      }
      resp.status(200).json({
        message: `User with ID: ${id} deleted successfully`,
      });
    } catch (err) {
      resp.status(500).json({ error: err.message });
    }
  };