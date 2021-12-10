var express = require("express");
var router = express.Router();
const { check } = require("express-validator");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");


//SIGNUP ROUTE
router.post(
  "/signup",
  
  check("name", "must be at least 3 chars long").isLength({ min: 3 }),
  check("password", "must be at least 8 chars long").isLength({ min: 8 }),
  check("email", "must be an email").isEmail(),
  signup
);

router.post(
  "/signin",
  check("email", "must be an email").isEmail(),
  check("password", "Password is required").isLength({ min: 1 }),
  signin
);

router.get("/signout", signout);

router.get("/testroute", isSignedIn, (req, res) => {
  res.json(req.auth);
})
module.exports = router;
