const express = require("express");
const app = express();
const user = require("./routes/userRoutes")
const task = require("./routes/taskRoutes")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

//configuration
dotenv.config({path:"/configurations/config.env"})
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))

//Routes
app.use("/api/v1", user)
app.use("/api/v1", task)

module.exports = app