const mongoose = require("mongoose");

const connection = async (URL) => {
  try {
    const connected = await mongoose.connect(URL);
    if (connected) {
      console.log("Dastabase connected Sucessfullly");
    } else {
      console.log("DB connected fail");
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = connection;
