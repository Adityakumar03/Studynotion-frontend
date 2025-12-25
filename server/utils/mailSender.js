const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false, // For port 587
    });

    // FORCE VERCEL TO WAIT USING A PROMISE
    return await new Promise((resolve, reject) => {
      transporter.sendMail({
        from: `"Studynotion || EdTech App" <${process.env.MAIL_USER}>`,
        to: `${email}`,
        subject: `${title}`,
        html: `${body}`,
      }, (err, info) => {
        if (err) {
          console.error("Nodemailer Error:", err);
          reject(err); // This sends the error to the 'catch' block
        } else {
          console.log("Email Sent:", info.response);
          resolve(info); // This returns the success info
        }
      });
    });

  } catch (error) {
    console.log("Error in mailSender:", error.message);
    throw error; // Rethrow to let the controller/model know it failed
  }
};

module.exports = mailSender;