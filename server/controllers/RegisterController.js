const bcrypt = require("bcrypt");
const userModel = require("../models/Users");

const Register = async (req, res) => {
  try {
    const { username, password, fullName } = req.body;
    const user = await userModel.findOne({ username });
    if (user) {
      return res.json({ error: "User already exists" });
    }
    const hashedPassowrd = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      username,
      fullName,
      password: hashedPassowrd,
    });
    await newUser.save();
    res.json({ message: "User Registered Successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = Register;
