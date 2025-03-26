const express = require('express');
const router = express.Router();
const grocery = require('../model/inventory');
const User = require('../model/phoneModel');
const moment = require('moment');
const { sendEmail } = require('../utils/mailjet');  

// Function to check restock items and notify users
const checkRestockAndNotify = async () => {
  try {
    const partners = await grocery.find();  // Get all partner data

    const today = moment();
    const threeDaysFromNow = moment().add(3, 'days');

    partners.forEach(async (partner) => {
      const isRestockDue = moment(partner.restockDate).isBetween(today, threeDaysFromNow, null, '[]');
      if (isRestockDue || partner.restockQuantity === 0) {
        const users = await User.find();  // Get all users to notify
        const subject = `Restock Notification: ${partner.itemName}`;
        const text = `Dear User, \n\nThe item "${partner.itemName}" is due for restock on ${moment(partner.restockDate).format('YYYY-MM-DD')}. The restock quantity is ${partner.restockQuantity}.\n\nBest regards, \nHome Stock`;

        // Notify all users
        users.forEach((user) => {
          sendEmail(user.email, subject, text);  // Send email using Mailjet
        });
      }
    });
  } catch (error) {
    console.log('Error checking restock items:', error);
  }
};

router.get('/checkRestock', async (req, res) => {
  try {
    await checkRestockAndNotify();  // Check restock items and notify
    res.status(200).send('Restock check completed');
  } catch (error) {
    res.status(500).send('Error in checking restock');
  }
});

module.exports = router;
