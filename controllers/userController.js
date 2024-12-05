// const User = require("../models/users");
// const sendEmail  = require("../utils/emailService");
// const mongoose = require("mongoose");

// exports.saveUser = async (req, res) => {
//   console.log("Saving user");

//   // Validate request body to ensure all required fields are present and valid
//   let { name, email, phoneNumber, intrests, projectRequirements, date } = req.body;

//   // Basic validation
//   const missingFields = [];
//   if (!name) missingFields.push("name");
//   if (!email) missingFields.push("email");
//   if (!phoneNumber) missingFields.push("phoneNumber");
//   if (!intrests) missingFields.push("intrests");
//   if (!projectRequirements) missingFields.push("projectRequirements");
//   if (!date) missingFields.push("date");

//   if (missingFields.length) {
//     return res.status(400).json({ error: `Missing fields: ${missingFields.join(", ")}` });
//   }

//   try {
//     console.log("initiating user saving in database : ", name, email, phoneNumber, intrests, projectRequirements, date);

//     // Create the user instance
//     const user = new User({
//       _id: new mongoose.Types.ObjectId(),
//       name,  // Corrected the fields to match the request body
//       email,
//       phoneNumber,
//       intrests,
//       projectRequirements,
//       date,
//     });

//     // Save the user to the database
//     await user.save();

//     // Send email to the requester and Anarish AFTER saving user
//     sendEmailToRequester(email, name);
//     sendEmailToAnarish(email, name, phoneNumber, projectRequirements, date);

//     // Send response to the client immediately
//     res.status(201).json({ message: "User created successfully" });

//   } catch (error) {
//     res.status(500).json({ message: "Failed to submit Contact Us Form", error: error.message });
//   }
// };


// // Function to send email to the requester
// function sendEmailToRequester(email, userName) {
//   const subject = "Welcome to Anarish Innovation - We are excited to Connect!";
//   const emailBody = `
//     Hi ${userName} <br/>
//     Welcome to Our Platform! We're thrilled to have the opportunity to work with you! <br/>
//     We have received your inquiry and one of our team members will get in touch with you soon to discuss your needs in more detail.
//     <br/><br/>
//     Warm Regards,<br/> Team Anarish
//   `;
//   sendEmail(email, "", subject, emailBody);  
// }

// // Function to send email to Anarish
// function sendEmailToAnarish(email, userName, userPhone, projectRequirements, date) {
//   const anairshEmail = "kumartech0102@gmail.com";  
//   const subject = "New Query from Website";
//   const emailBody = `
//     Following user has tried to contact Anarish on ${date}: <br/><br/>
//     <p><b>Name:</b> ${userName}</p>
//     <p><b>Email:</b> ${email}</p>
//     <p><b>Phone Number:</b> ${userPhone}</p>
//     <p><b>Interested In:</b> ${projectRequirements}</p>
//     <p><b>Message Shared:</b> ${projectRequirements}</p>
//   `;
//   sendEmail(anairshEmail, "", subject, emailBody);  
// }

const User = require("../models/users");
const sendEmail = require("../utils/emailService");
const mongoose = require("mongoose");

exports.saveUser = async (req, res) => {
  console.log("Saving user");

  // Validate request body to ensure all required fields are present and valid
  let { name, email, phoneNumber, intrests, projectRequirements, date } = req.body;

  // Basic validation
  const missingFields = [];
  if (!name) missingFields.push("name");
  if (!email) missingFields.push("email");
  if (!phoneNumber) missingFields.push("phoneNumber");
  if (!intrests) missingFields.push("intrests");
  if (!projectRequirements) missingFields.push("projectRequirements");
  if (!date) missingFields.push("date");

  if (missingFields.length) {
    return res.status(400).json({ error: `Missing fields: ${missingFields.join(", ")}` });
  }

  try {
    console.log("Initiating user saving in database:", name, email, phoneNumber, intrests, projectRequirements, date);

    // Create the user instance
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name,  
      email,
      phoneNumber,
      intrests,
      projectRequirements,
      date,
    });

    // Save the user to the database
    await user.save();
    console.log("User saved successfully in the database");

    // Send a response to the client immediately after saving the user
    res.status(201).json({ message: "User created successfully" });

    // Send the first email to the requester immediately
    try {
      await sendEmailToRequester(email, name);
      console.log(`Email sent to requester: ${email}`);
    } catch (error) {
      console.error("Error sending email to requester:", error);
    }

    // Send the second email to anarish
    try {
      await sendEmailToAnarish(email, name, phoneNumber, projectRequirements, date);
      console.log(`Email sent to Anarish: maheshwari.charu@gmail.com`);
    } catch (error) {
      console.error("Error sending email to Anarish:", error);
    }  

  } catch (error) {
    console.error("Error during user saving process:", error);
    res.status(500).json({ message: "Failed to submit Contact Us Form", error: error.message });
  }
};

// Function to send email to the requester
async function sendEmailToRequester(email, userName) {
  const subject = "Welcome to Anarish Innovation - We are excited to Connect!";
  const emailBody = `
    Hi ${userName} <br/>
    Welcome to Our Platform! We're thrilled to have the opportunity to work with you! <br/>
    We have received your inquiry and one of our team members will get in touch with you soon to discuss your needs in more detail.
    <br/><br/>
    Warm Regards,<br/> Team Anarish
  `;
  await sendEmail(email, "", subject, emailBody);  
}

// Function to send email to Anarish
async function sendEmailToAnarish(email, userName, userPhone, projectRequirements, date) {
  const anairshEmail = "maheshwari.charu@gmail.com";  
  const subject = "New Query from Website";
  const emailBody = `
    Following user has tried to contact Anarish on ${date}: <br/><br/>
    <p><b>Name:</b> ${userName}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Phone Number:</b> ${userPhone}</p>
    <p><b>Interested In:</b> ${projectRequirements}</p>
    <p><b>Message Shared:</b> ${projectRequirements}</p>
  `;
  await sendEmail(anairshEmail, "", subject, emailBody);  
}




exports.getUser = async (req, resp) => {
  User.find()
    .then((result) => {
      console.log(result);
      resp.status(200).json({
        message: "User fetched successfully",
        users: result,
      });
    })
    .catch((err) => resp.status(500).json({ error: err.message }));
};

exports.getUserById = async (req, resp) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return resp.status(404).json({ message: "User not found" });
    }
    resp.status(200).json({
      message: `User with id : ${id} fetched successfully`,
      user,
    });
  } catch (error) {
    resp.status(500).json({ error: "Failed to retrieve user" });
  }
};

exports.updateUser = async (req, resp) => {
  const id = req.params.id;
  User.findById(id)
    .then((result) => {
      if (result != null) {
        User.update({ _id: id }, { $set: req.body });
      } else {
        resp.status(500).json({
          message: `No user present with this id`,
        });
      }
    })
    .catch((err) => resp.status(500).json({ error: err.message }));
};

exports.deleteUser = async (req, resp) => {
  const id = req.params.id;
  User.findById(id)
    .then((result) => {
      if (result != null) {
        User.remove({ _id: id });
      } else {
        resp.status(500).json({
          message: `No user present with this id`,
        });
      }
    })
    .catch((err) => resp.status(500).json({ error: err.message }));
};