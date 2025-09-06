const nodemailer = require('nodemailer');
require('dotenv').config();

const verifySendEmail = async(to,name,code) =>{
    let testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });
    const info = await transporter.sendMail({
        from: "Test-Ecom- By Divyanshu",
        to: to,
        subject: "Signup verification code(testing)",
        html: `<h2>
                Hi ${name}!!<br>Thankyou for creating your account
            <h2>
            <p>Your signup verification code is:<br>
                <h2>${code}<h2>
                Kindly ignore if you haven't requested for signu
            </p>`,
    });
    console.log(info.messageId);
};

module.exports = verifySendEmail;