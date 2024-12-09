import { sendEmailToRequester, sendEmailToAnarish } from "../utils/emailService";

// This is the background function that will be triggered asynchronously
export const background = true;  // Enable background mode for Vercel

export default async function handler(req, res) {
    console.log('I have been called');
  const { email, name, phoneNumber, projectRequirements, date } = req.body;

  try {
    // Send both emails concurrently using Promise.all
    await Promise.all([
      sendEmailToRequester(email, name),
      sendEmailToAnarish(email, name, phoneNumber, projectRequirements, date)
    ]);

    // Respond to Vercel (this won't delay the main function)
    res.status(200).json({ message: "Emails sent successfully in the background" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ message: "Failed to send emails", error: error.message });
  }
}