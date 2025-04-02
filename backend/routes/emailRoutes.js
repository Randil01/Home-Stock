const router = require("express").Router();
const mail = require("../model/emailModel");
const { sendEmail } = require("../routes/mailjet"); 

// Route to add a new email (subscribe)
router.post("/add", async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email input
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if the email is already subscribed
        const existingEmail = await mail.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already subscribed" });
        }

        // Save new email
        const newEmail = new mail({ email });
        await newEmail.save();

        // Send confirmation email
        const subject = "Welcome to Home Stock Smart Restock Alerts!";
        const text = `Hello,

        Thank you for subscribing to Home Stock Smart Restock Alerts! 

        You will now receive notifications about upcoming restocks of items.

        Best regards,
        Home Stock Team`;

        await sendEmail(email, subject, text);

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
