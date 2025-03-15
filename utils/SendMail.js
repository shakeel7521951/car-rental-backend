import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const SendMail = async (email, subject, text) => {
  try {
    const msg = {
      to: email,
      from: "aqibmalik1586@gmail.com",
      subject: subject,
      html: text, 
    };

    await sgMail.send(msg);
  } catch (error) {
    throw new Error("Failed to send mail");
  }
};

export default SendMail;
