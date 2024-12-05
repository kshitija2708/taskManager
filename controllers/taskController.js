const User = require("../models/userModel");
const Task = require("../models/taskModel");
const asyncError = require("../middleWare/asyncError");

//add new task
exports.addTask = asyncError(async (req, res) => {
    const {title, priority, stage} = req.body

    const newTaskData = {
        title, priority, stage, creator: req.user._id
    }

    const newTask = await Task.create(newTaskData)
    res.status(200).json({success: true, message: "Task Uploaded Successfully", newTask})
})

//update task
exports.updateTask = asyncError( async (req, res) => {
    const {id} = req.params
    const {title, priority, stage} = req.body
    
    const task = await Task.findById(id)
    
    //check that user is creator of task
    if(JSON.stringify(task.creator) !== JSON.stringify(req.user._id)){
        return res.status(403).json({message: "Not Allowed"})
    }

    const updateTaskData = await Task.findByIdAndUpdate({_id:id}, 
        {title, priority, stage},
        {new:true, runValidators: true, useFindAndModify: false,})
    
    await updateTaskData.save();

    res.status(200).json(updateTaskData)
})

//get all tasks of user
exports.getTasks = asyncError( async (req, res) => {
    const tasks = await Task.find({creator: req.user._id})

    res.status(200).json(tasks)
})