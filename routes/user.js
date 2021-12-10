var express = require("express");
var router = express.Router();
const { getUser, getUserById, updateUser, getuserPurchaseList } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth");

router.param("userId", getUserById);
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
// router.get("/users", getallUsers)
router.put("/user/:userId", isSignedIn, isAuthenticated,updateUser);
router.get("/order/user/:userId", isSignedIn, isAuthenticated, getuserPurchaseList);
module.exports = router;