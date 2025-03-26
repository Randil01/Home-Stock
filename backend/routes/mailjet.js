const mailjet = require('node-mailjet').connect('17919e91b89ea7d9abf6cceb14313145', '581db2d4ccf9ba9d4fdfd3bb36dfe906');

const sendEmail = (toEmail, subject, text) => {
  const request = mailjet
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: {
            Email: 'your-email@example.com', // Your email address
            Name: 'Home Stock',
          },
          To: [
            {
              Email: toEmail,  // Recipient email address
            },
          ],
          Subject: subject,
          TextPart: text,
          HTMLPart: `<h3>${text}</h3>`,  // Optional HTML content
        },
      ],
    });

  request
    .then((result) => {
      console.log('Email sent successfully:', result.body);
    })
    .catch((err) => {
      console.log('Error sending email:', err);
    });
};

module.exports = { sendEmail };
