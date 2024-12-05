const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    date: {
        type: Date, 
        default: new Date() 
    },
    priority: {
      type: String,
      default: "normal",
      enum: ["high", "medium", "normal", "low"],
    },
    stage: {
      type: String,
      default: "todo",
      enum: ["todo", "in progress", "completed"],
    }
})


module.exports = mongoose.model("Task", taskSchema);