const express = require("express");
const router = express.Router();

const { getCategoryById, createCategory, getCategory,getAllCategories, updateCategory, removeCategory } = require("../controllers/category");
const { isAdmin, isAuthenticated, isSignedIn } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//Params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//create routes
router.post("/category/create/:userId", isSignedIn, isAuthenticated, isAdmin, createCategory);

//read routes
router.get("/category/:categoryId", getCategory)
router.get("/categories", getAllCategories)

//update routes
router.put("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, updateCategory)

//delete routes
router.delete("/category/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin, removeCategory)


module.exports = router;
