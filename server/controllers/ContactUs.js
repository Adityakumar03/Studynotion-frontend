const { contactUsEmail } = require("../mail/templates/contactFormRes")
const mailSender = require("../utils/mailSender")

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body

  try {
    // 1. Send Confirmation Email to User
    await mailSender(
      email,
      "Confirmation: Message Received",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    )

    // 2. Send Notification Email to ADMIN (Yourself)
    await mailSender(
      process.env.MAIL_USER,
      `New Lead: ${firstname} ${lastname}`,
      `<h3>New Contact Inquiry</h3>
       <p><b>From:</b> ${firstname} ${lastname} (${email})</p>
       <p><b>Phone:</b> ${countrycode} ${phoneNo}</p>
       <p><b>Message:</b> ${message}</p>`
    )

    return res.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" })
  }
}