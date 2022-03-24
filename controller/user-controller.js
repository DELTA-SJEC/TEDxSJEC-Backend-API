const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../database/models/User");
const History = require("../database/models/History");
const validator = require("validator");
const DeviceDetector = require("device-detector-js");
const saltRounds = 10;

const sessionHistory = async (req, res, next) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const device = new DeviceDetector();
    const deviceInfo = device.parse(req.headers["user-agent"]);
    const history = new History({ ip: ip, device: deviceInfo });
    await history.save();
    next();
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(422).send({
        error: "Please provide all the details",
      });
    } else if (!validator.isEmail(email)) {
      return res.status(422).send({
        error: "Please provide a valid email",
      });
    } else if (password.length < 6) {
      return res.status(422).send({
        error: "Password must be at least 6 characters long",
      });
    } else {
      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      const userCheck = await User.findOne({ email: email });

      if (!!userCheck) {
        return res.status(422).send({
          error: "User already have a account.",
        });
      }

      const user = new User({
        name,
        email,
        password: hashedPassword,
      });
      const response = await user.save();
      return res.status(201).json({
        message: "User created successfully",
        user: response,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

exports.login = async (req, res, next) => {
  sessionHistory(req, res, next);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).send({
        error: "Please provide all the details",
      });
    } else if (!validator.isEmail(email)) {
      return res.status(422).send({
        error: "Please provide a valid email",
      });
    } else if (password.length < 6) {
      return res.status(422).send({
        error: "Password must be at least 6 characters long",
      });
    } else {
      const userCheck = await User.findOne({ email: email });
      if (!userCheck) res.status(422).send({ error: "User does not exist" });
      var check = bcrypt.compareSync(password, userCheck.password);
      if (!check) res.status(422).send({ error: "Wrong password" });
      if (!!check) {
        const token = jwt.sign(
          {
            _id: userCheck._id,
          },
          process.env.TOKEN_SECRET
        );
        return res.status(200).json({
          token: token,
          message: "User logged in successfully!",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
