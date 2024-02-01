const nodemailer = require("nodemailer");
const verification = require("../models/emailVerificatin");
const { createJWT } = require(".");
const { v4: uuidv4 } = require("uuid");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "hareeshdhruva143@gmail.com",
    pass: "qxvw xxnp jucp wvre",
  },
});

const sendNotififcation = async (user, res) => {
  const { _id, email, firstname, lastname } = user;
  const token = _id + uuidv4();
  const link = process.env.APP_URL + "/user/verify/" + _id + "/" + token;
  try {
    const info = await transporter.sendMail({
      from: '"OSM 👻" <noreplay-@example.com>',
      to: email,
      subject: "Email verification",
      text: "Hello",
      html: `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
              <title>Email Confirmation</title>
              <style>
                  body {
                      font-family: 'Poppins', sans-serif;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                      text-align: center;
                  }
          
                  .container {
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                      background-color: #fffff;
                      border-radius: 5px;
                      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
                  }
          
                  h1 {
                      color: #333;
                      font-family: 'Poppins', sans-serif;
                  }
          
                  p{
                      color: #666;
                      font-family: 'Poppins', sans-serif;
                  }
          
                  .confirmation-button {
                      display: inline-block;
                      padding: 10px 20px;
                      background: #007bff;
                      color: #fffff;
                      text-decoration: none;
                      border-radius: 5px;
                      font-family: 'Poppins', sans-serif;
                  }
          
                  .confirmation-button:hover {
                      background: #0056b3;
                  }
                  a{
                    color: #fffff;
                    font-family: 'Poppins', sans-serif;
                  }
                  h3{
                    font-family: 'Poppins', sans-serif;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h3>${firstname + " " + lastname}</h3>
                  <p>Thank you for signing up! Please click the button below to confirm your email address:</p>
                  <a href=${link} class="confirmation-button" style="color:#fff">Confirm Email</a>
              </div>
          </body>
          </html>
          `,
    });
    try {
      const jwtToken = createJWT(_id);
      const newVerifiedEmail = await verification.create({
        userId: _id,
        token: jwtToken,
        created_At: Date.now(),
        expires_At: Date.now() + 3600000,
      });
      if (!newVerifiedEmail) {
        transporter.sendMail(info).then(() => {
          res.status(201).send({
            success: "Pending",
            message:
              "Verification email has been sent to your email for verification",
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
    res.status(200).json({ data: link, message: "Verify Email Address" });
  } catch (error) {
    console.log(error);
  }
};
module.exports = { sendNotififcation };
