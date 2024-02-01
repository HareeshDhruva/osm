const PasswordReset = require("../models/passwordResetSchema");
const User = require("../models/userModels");
const { decodePassword } = require("../utils/index");

const passworsReset = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await PasswordReset.findOne({ userId });
    const { expires_At } = result;
    if (result) {
      if (expires_At < Date.now()) {
        await PasswordReset.findOneAndDelete({ userId })
          .then(() => {
            User.findOne({ _id: userId })
              .then(() => {
                const message = "Reset token has expaired";
                res.redirect(
                  `/user/password-reset?status=error&message=${message}`
                );
              })
              .catch((error) => {
                res.redirect(`/user/password-reset?message=${error}`);
              });
          })
          .catch((error) => {
            res.redirect(`/user/password-reset?message=${error}`);
          });
      } else {
        decodePassword(userId, result.token)
          .then(async (isMatch) => {
            if (isMatch) {
              await User.findOne({ _id: userId })
                .then((user) => {
                  res.redirect(`/user/password-reset?_id=${userId}`);
                })
                .catch((error) => {
                  res.redirect(`/user/password-reset?status=fail`);
                });
            } else {
              res.redirect(
                `/user/password-reset?status=succes&message=${isMatch}`
              );
            }
          })
          .catch((error) => {
            res.redirect(`/user/password-reset?message=${error}`);
          });
      }
    }
  } catch (error) {
    res.status(201).json({ message: "user not exist" });
  }
};

module.exports = passworsReset;
