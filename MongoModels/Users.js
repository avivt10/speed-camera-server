const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true, 
  },
  LastName: {
    type: String,
    required: true,
  },
  Phone: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Users", UsersSchema); 
