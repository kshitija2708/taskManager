const express = require("express");
const router = express.Router();
const {addTask, updateTask, getTasks} = require("../controllers/taskController.js");
const {isAuthenticatedUser, authorizeRoles} = require("../middleWare/auth")

//add task
router.route("/addtask").post(isAuthenticatedUser, addTask)

//update task by id
router.route("/updatetask/:id").put(isAuthenticatedUser, updateTask)

//get all tasks of logged user
router.route("/alltasks").get(isAuthenticatedUser, getTasks)


module.exports = router;