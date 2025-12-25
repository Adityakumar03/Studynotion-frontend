const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      secure: false, // Use false for port 587, true for port 465
    })

    let info = await transporter.sendMail({
      from: `"Studynotion || EdTech App" <${process.env.MAIL_USER}>`, // sender address
      to: `${email}`, // list of receivers
      subject: `${title}`, // Subject line
      html: `${body}`, // html body
    })
    
    console.log("Email Info: ", info.response);
    return info;

  } catch (error) {
    console.log("Error in mailSender: ", error.message);
    // IMPORTANT: Throw the error so the calling function (OTP hook) knows it failed
    throw error; 
  }
}

module.exports = mailSender;