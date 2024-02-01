const jwt = require("jsonwebtoken");
const userAuth = async (req, res, next) => {
  const authHead = req.body?.headers?.authorization;
  if (!authHead || !authHead?.startsWith("Bearer")) {
    next("Authentication === failed");
  }
  const token = authHead?.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.body.user = { userId: payload.userId };
    next();
  } catch (error) {
    next("authontication fail");
  }
};
module.exports = userAuth;
