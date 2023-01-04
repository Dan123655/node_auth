const User = require("./models/User");
const Role = require("./models/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const bodyParser = require('body-parser')
const cors = require("cors");

const app = express();
app.use(cors({
  credentials: true,
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Origin': 'https://dan123655.github.io/taskman_db',
  // 'Access-Control-Allow-Origin': 'http://localhost:3000',
  // origin: 'http://localhost:3000'
  origin: 'https://dan123655.github.io/taskman_db/'
}))



const { validationResult } = require("express-validator");
const { secret } = require("./config");
const { findById } = require("./models/User");

const generateAccessToken = (id) => {
  const payload = { id };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ incorrect: true }); //done
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        res.status(400).json({
          exists: true
        });                                                 //done
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: "USER"});
      const user = new User({
        username,
        password: hashPassword,
        roles: [userRole.value],
        tasks:'[]'
        


      });
      await user.save();

      return res.json({
        message: "user registered successfully, no tasks",
      success:true });
    } catch (e) {
      console.log(e);
      res.status(400).json({
        regerror: true,
    e:e  });
    }
  }



  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({
            notFound: true,
          thisUser:username  });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ wrongpassword: true });    //done
      }
      const token = generateAccessToken(user._id);

      return res.json({ token,tokensent:true });       //done
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: true});        //done
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
          const dbtasks = docs.tasks;
          console.log(JSON.parse(dbtasks));
          res.json({ upd: dbtasks });
          console.log("tasks sent to the user");
          // return res.send({tasks:dbtasks });
        }
      });
    } catch (e) {
      console.log(e);
      res.json({error:'bad_token'})
    }
  }













  async updateTasks(req, res) {
    try {
      console.log(req.body)
      const token = req.headers.authorization;
      // console.log(token); //ok
      if (!token) {
        return res.json({ message: "no token here" });
      }
      const credentials = jwt.verify(token, secret);
      // console.log(credentials); //ok
      if (!credentials) {
        console.log(err + " or no err");
        return res.json({ message: "ya token bad man" });
      }

      const tasksForUpdate = await req.body.newTasks;
      // console.log(tasksForUpdate)
      const upsertOptions = { new: true, upsert: true }

      const id = credentials.id
      const user = await User.findOneAndUpdate({ _id: id }, { tasks: tasksForUpdate }, upsertOptions)
      console.log(user.tasks);
 
   
      if (user.tasks) { res.json({ message: 'cloud storage up to date' }) }
   
    



      // res.json(user.tasks)
  
    } catch (e) { console.log(e); res.json({message:'bad_token'})}


  }
}
module.exports = new authController();
