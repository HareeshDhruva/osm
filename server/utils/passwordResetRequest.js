const nodemailer = require("nodemailer");
const passwordReset = require("../models/passwordResetSchema");
const { createJWT } = require("./index");
const { v4: uuidv4 } = require("uuid");
const { use } = require("bcrypt/promises");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "hareeshdhruva143@gmail.com",
    pass: "qxvw xxnp jucp wvre",
  },
});

const sendPasswordReset = async (user, res) => {
  const { _id, email, firstname, lastname } = user;
  const token = _id + uuidv4();
  const link =
    process.env.APP_URL + "/user/password-reset/" + _id + "/" + token;
  try {
    const info = await transporter.sendMail({
      from: '"OSM 👻" <noreplay-@example.com>',
      to: email,
      subject: "Password Reset",
      text: "Hello",
      html: `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
              <title>Password request</title>
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
                      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
                  }
          
                  h1 {
                      color: #333;
                      font-family: 'Poppins', sans-serif;
                  }
          
                  p{
                      color: #666;
                      font-family: 'Poppins', sans-serif;
                  }

                  h3{
                    font-family: 'Poppins', sans-serif;
                  }
          
                  .confirmation-button {
                      display: inline-block;
                      padding: 10px 20px;
                      background: #10e645;
                      color: #fff;
                      text-decoration: none;
                      border-radius: 5px;
                      font-family: 'Poppins', sans-serif;
                  }
          
                  .confirmation-button:hover {
                      background: #0056b3;
                  }
                  a{
                    color: #fff;
                    font-family: 'Poppins', sans-serif;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h3>${firstname + " " + lastname}</h3>
                  <p>Thank you for Password Reset service! Please click the button below to reset your password:</p>
                  <a href=${link} class="confirmation-button" style="color:#fff">Reset Password</a>
              </div>
          </body>
          </html>
          `,
    });
    try {
      const jwtToken = createJWT(_id);
      const user = await passwordReset.findOneAndUpdate(
        { userId: _id },
        {
          userId: _id,
          token: jwtToken,
          email,
          created_At: Date.now(),
          expires_At: Date.now() + 3600000,
        }
      );
      if (user) {
        return res
          .status(200)
          .json({ message: "Check Your Mail Already Sent" });
      }

      const newRequestReset = await passwordReset.create({
        userId: _id,
        token: jwtToken,
        email,
        created_At: Date.now(),
        expires_At: Date.now() + 3600000,
      });

      if (!newRequestReset) {
        transporter.sendMail(info).then(() => {
          res.status(200).json({ message: "Check Your Mail Already Sent" ,data:link});
        });
      }
    } catch (error) {
      console.log(error);
    }
    res.status(200).json({ message: "Sucessfully Send Reset Mail",data:link});
  } catch (error) {
    console.log(error);
  }
};
module.exports = { sendPasswordReset };
