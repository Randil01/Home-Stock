const mailjet = require('node-mailjet').apiConnect(
  '17919e91b89ea7d9abf6cceb14313145', 
  '581db2d4ccf9ba9d4fdfd3bb36dfe906'
);

const sendEmail = async (toEmail, subject, text) => {
  try {
    const request = await mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'thenularandila2002@gmail.com',
              Name: 'Home Stock',
            },
            To: [{ Email: toEmail }], //Send email to one recipient at a time
            Subject: subject,
            TextPart: text,
            HTMLPart: `<h3>${text}</h3>`, 
          },
        ],
      });

    console.log(`Email sent to ${toEmail}:`, request.body);
    return { success: true };
  } catch (error) {
    console.error(`Error sending email to ${toEmail}:`, error);
    return { success: false, error };
  }
};

module.exports = { sendEmail };
