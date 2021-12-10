const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({
      error: [errors.array()[0].msg, errors.array()[0].param],
    });

  const user = new User(req.body);
  user.save((err, user) => {
    if (err)
      return res.status(400).json({
        message: "User was not added",
      });
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({
      error: [errors.array()[0].msg, errors.array()[0].param],
    });

  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user)
      return res.status(400).json({
        error: "USER email doesn't exist",
      });

    if (!user.authenticate(password))
      return res.status(401).json({
        error: "Email and password doesn't match",
      });
    //create token
    var token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });
    //send message to frontnd
    const { _id, email, name, role } = user;
    return res.json({ token: token, user: { token, _id, email, name, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signed out",
  });
};

//Protected Routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//Custom Middlewares
exports.isAuthenticated = (req, res, next) => {
  var checker = req.profile && req.auth && req.profile._id == req.auth._id;
  // console.log(req.profile._id)
  if (!checker)
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
    next();
};
exports.isAdmin = (req, res, next) => {
  if (req.profile.role == 0)
    return res.status(403).json({
      error: "You are not an admin, ACCESS DENIED",
    });
    next();
};
