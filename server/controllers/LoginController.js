const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/Users");

const Login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "Username or Password is Incorrect!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET);
    res.status(200).json({ token, userId: user._id, userName: user.fullName });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = Login;
