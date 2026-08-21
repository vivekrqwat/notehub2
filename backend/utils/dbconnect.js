const mongoose = require('mongoose');

const dbconnect = async () => {
  try {
    if(mongoose.connection.readyState==1)return mongoose.connection
    await mongoose.connect(process.env.MG_URI, {});
    // console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); 
  }
};

module.exports = dbconnect;
