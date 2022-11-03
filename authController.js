const User = require("./models/User");
const Role = require("./models/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");

const cors = require("cors");

const app = express();

const { validationResult } = require("express-validator");
const { secret } = require("./config");

const generateAccessToken = (id) => {
  const payload = { id };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "reg errors", errors });
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        res.status(400).json({ message: "username already exists" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: "USER" });
      const user = new User({
        username,
        password: hashPassword,
        roles: [userRole.value],
      });
      await user.save();
      return res.json({ message: "user registered successfully" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "reg error" });
    }
  }
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ message: `user ${username} was not found` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: `incorrect password` });
      }
      const token = generateAccessToken(user._id);

      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "login error" });
    }
  }

  async getTasks(req, res) {
    try {
      const token = req.headers.authorization;
      console.log(token); //ok
      if (!token) {
        return res.json({ message: "no token here" });
      }
      const credentials = jwt.verify(token, secret);
      console.log(credentials); //ok
      if (!credentials) {
        console.log(err);
        return res.json({ message: "ya token bad man" });
      }
      const id = credentials.id;

      await User.findById(id).then((docs, err) => {
        if (err) {
          return res.json({ message: "tasks query error" });
        } else {
          const yourTasks = JSON.parse(docs.tasks[0]);
          console.log("tasks sent to the user");
          return res.send(yourTasks);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}
module.exports = new authController();
