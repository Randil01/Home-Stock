const router = require("express").Router();
const cron = require("node-cron");
const Grocery = require("../model/Inventory");
const User = require("../model/emailModel");
const moment = require("moment");
const { sendEmail } = require("../routes/mailjet");

const checkRestockAndNotify = async () => {
  try {
    const items = await Grocery.find();
    const users = await User.find();

    if (users.length === 0) {
      console.log("No users found to send notifications.");
      return;
    }

    const today = moment();
    const threeDaysFromNow = moment().add(3, "days");

    const restockItems = items.filter(item =>
      moment(item.restockDate).isBetween(today, threeDaysFromNow, null, "[]") ||
      item.restockQuantity === 0
    );

    if (restockItems.length === 0) {
      console.log("✅ No restock items due in the next 3 days.");
      return;
    }

    const logoUrl = "https://i.imgur.com/87wCkRe.png";

    for (const item of restockItems) {
      const subject = `🔔 Restock Alert: ${item.productName}`;
      const text = `Dear User,\n\nThe item "${item.productName}" needs restocking by ${moment(item.restockDate).format("YYYY-MM-DD")}.\nCurrent stock: ${item.restockQuantity}.\n\nBest regards,\nHome Stock Team`;

      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${logoUrl}" alt="Home Stock Logo" style="max-width: 100px;" />
          </div>
          <h2 style="color: #e63946;">🔔 Restock Alert: ${item.productName}</h2>
          <p>Dear User,</p>
          <p>The item <strong>"${item.productName}"</strong> needs restocking by <strong>${moment(item.restockDate).format("YYYY-MM-DD")}</strong>.</p>
          <p>Current stock: <strong>${item.restockQuantity}</strong></p>
          <p style="margin-top: 30px;">Best regards,<br/>Home Stock Team</p>
        </div>
      `;

      for (const user of users) {
        await sendEmail(user.email, subject, text, html);
      }
    }

    console.log("Restock notifications sent successfully.");
  } catch (error) {
    console.error("Error checking restock items:", error);
  }
};

router.get("/checkRestock", async (req, res) => {
  try {
    await checkRestockAndNotify();
    res.status(200).json({ message: "Restock check completed successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error in checking restock" });
  }
});

// every 2 day
cron.schedule("0 0 */2 * *", async () => {//cheking after one min to min '*/1 * * * *'
  console.log("Running scheduled restock check...");
  await checkRestockAndNotify();
});

module.exports = router;
