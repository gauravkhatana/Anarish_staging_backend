import { sendEmailToRequester, sendEmailToAnarish } from "../utils/emailService"; // Assuming these functions are defined in your utils

// This is the background function
export const background = true;  // Enable background mode for Vercel

export default async function handler(req, res) {
  const { email, name, phoneNumber, projectRequirements, date } = req.body;

  try {
    // Call both email functions concurrently
    await Promise.all([
      sendEmailToRequester(email, name),
      sendEmailToAnarish(email, name, phoneNumber, projectRequirements, date)
    ]);

    // Responding to Vercel after the emails are sent
    res.status(200).json({ message: "Emails sent successfully in the background" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ message: "Failed to send emails", error: error.message });
  }
}