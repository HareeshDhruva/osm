const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "hareeshdhruva143@gmail.com",
    pass: "qxvw xxnp jucp wvre",
  },
});

const sendPasswordchangeEmail = async (user, res) => {
  const { email, firstname, lastname } = user;
  if (!email || !firstname || !lastname) {
    return res.status(404).json({ message: "user not found to send message" });
  }
  try {
    await transporter.sendMail({
      from: '"OSM 👻" <noreplay-@example.com>',
      to: email,
      subject: "Password Change",
      text: "Hello",
      html: `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
              <title>Password change</title>
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
                  h3{
                    font-family: 'Poppins', sans-serif;
                  }
                  p{
                      color: #666;
                      font-family: 'Poppins', sans-serif;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h3>Hello ${firstname + " " + lastname}</h3>
                  <div id="countdown">
                  </div>
                  <p>Your request to change the Password has been Successfully completed!</p>
              </div>
          </body>   
          </html>
          `,
    });

    res.status(200).json({ message: "Password Change Sucessfully" });
  } catch (error) {
    console.log(error);
    res.status(201).json({ message: "Something Went Wrong" });
  }
};
module.exports = { sendPasswordchangeEmail };
