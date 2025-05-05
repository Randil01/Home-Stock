const router = require("express").Router();
const mail = require("../model/emailModel");
const { sendEmail } = require("../routes/mailjet"); 

// Route to add a new email (subscribe)
router.post("/add", async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
  
      const existingEmail = await mail.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already subscribed" });
      }
  
      const newEmail = new mail({ email });
      await newEmail.save();
  
      // Email details
      const subject = "Welcome to Home Stock Smart Restock Alerts!";
      const text = `Hello,
  
        Thank you for subscribing to Home Stock Smart Restock Alerts!
  
        You will now receive notifications about upcoming restocks of items.
  
        Best regards,
        Home Stock Team`;
  
      const logoUrl = "https://i.imgur.com/87wCkRe.png";
  
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${logoUrl}" alt="Home Stock Logo" style="max-width: 100px;" />
          </div>
          <h2 style="color: #2d3748;">Welcome to Home Stock Smart Restock Alerts!</h2>
          <p>Hello,</p>
          <p>Thank you for subscribing to <strong>Home Stock Smart Restock Alerts</strong>!</p>
          <p>You will now receive notifications about upcoming restocks of items.</p>
          <p style="margin-top: 30px;">Best regards,<br/>Home Stock Team</p>
        </div>
      `;
  
      await sendEmail(email, subject, text, html);
  
      res.status(200).json({ message: "Email added and confirmation sent" });
    } catch (error) {
      console.error("Error adding email:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

// Route to check if an email is already subscribed
router.get("/check", async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: "Email parameter is required" });
        }
        const existingEmail = await mail.findOne({ email });
        res.json({ exists: !!existingEmail });
    } catch (error) {
        console.error("Error checking email:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
