const express = require("express");
const router = express.Router();
const {register, updateUser, deleteuser, getSingleuser, getAllUsers, loginUser, logout, changePassword, getUserDetails} = require("../controllers/userController");
const {isAuthenticatedUser, authorizeRoles} = require("../middleWare/auth")

// registration route
router.route("/register").post(register);

// get all user data route
router.route("/user/getallusers").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

// get singleuser data  route
router.route("/user/details/:id").get(isAuthenticatedUser, getSingleuser);

// delete route
router.route("/user/deleteuser/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deleteuser);

// update route
router.route("/user/updateuser/:id").put( updateUser);

// login route
router.route("/login").post(loginUser);

//logout
router.route("/logout").get(logout);

//change Password
router.route("/changepassword").put(isAuthenticatedUser, changePassword)

//my profile
router.route("/profile").get(isAuthenticatedUser, getUserDetails)

module.exports = router;


