const mongoose = require("mongoose");
const Verification = require("../models/emailVerificatin");
const User = require("../models/userModels");
const { decodePassword } = require("../utils/index");

const verfiyEmail = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await Verification.findOne({ userId });
    const { expires_At } = result;
    if (result) {
      if (expires_At < Date.now()) {
        await Verification.findOne({ userId })
          .then(() => {
            User.findOne({ _id: userId })
              .then(() => {
                const message = "Verification token has expaired";
                res.redirect(`/user/verified?status=error&message=${message}`);
              })
              .catch((error) => {
                res.redirect(`/user/verified?message=${error}`);
              });
          })
          .catch((error) => {
            res.redirect(`/user/verified?message=${error}`);
          });
      } else {
        decodePassword(userId, result.token)
          .then(async (isMatch) => {
            if (isMatch) {
              await User.findOneAndUpdate({ _id: userId }, { verified: true })
                .then((user) => {
                  console.log(user);
                  res.redirect(`/user/verified?status=success`);
                })
                .catch((error) => {
                  res.redirect(`/user/verified?status=fail`);
                });
            } else {
              res.redirect(`/user/verified?status=succes&message=${isMatch}`);
            }
          })
          .catch((error) => {
            res.redirect(`/user/verified?message=${error}`);
          });
      }
    }
  } catch (error) {
    res.status(201).json({ message: "user not exist" });
  }
};

module.exports = verfiyEmail;
