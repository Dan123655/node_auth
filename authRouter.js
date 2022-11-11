const Router = require("express");
const express = require("express");
const app = express();
const cors = require("cors");
const router = new Router();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const controller = require("./authController");

app.use(cors())

const { check } = require("express-validator");
// const jwt = require("jsonwebtoken");

router.post(
  "/registration",
  [
    check("username", "username field cannot be empty").notEmpty(),
    check(
      "password",
      "password should be between 5 and 12 characters"
    ).isLength({ min: 5, max: 12 }),
  ],
  controller.registration
);
router.post("/login", controller.login);
// router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers)
router.get("/tasks", controller.getTasks);
router.get("/update", controller.updateTasks);

module.exports = router;
