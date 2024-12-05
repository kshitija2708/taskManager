const User = require("../models/userModel");
const asyncError = require("../middleWare/asyncError");
const sendToken = require("../utils/sendJWTToken");


// create user
exports.register = asyncError(async (req, res) => {
    const { name, email, mobile, password} = req.body;
    
    if (!name || !email || !mobile  || !password ) {
        return res.status(400).json({ message: "All Input Is required" });
    }
    
    const preuser = await User.findOne({ email: email })
    if (preuser) {
        return res.status(400).json({ message: "This user already exist in our databse" });
    } 
    try {
        const user = await User.create({
            name, email, mobile , password
        });
        sendToken(user, 201, res);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
    
});


// Login
exports.loginUser = asyncError(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // console.log(email, password)

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordMatch = await user.comparePasswords(password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        sendToken(user, 200, res);
    
    } catch (error) {
        res.status(501).json({ message: error });
    }
});

//logout
exports.logout = asyncError((req, res, next) => {
    try {
        // console.log(res.cookie.token)
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })
    
        res.status(200).json({
            success: true,
            message: "Logged Out"
        })
    } catch (error) {
        res.status(501).json({ error: error });
    }
    
})

//get user
exports.getUserDetails = asyncError(async(req, res) => {
    try {
        const user = await User.findById(req.user._id)
        res.status(200).json({
            success: true,
            user,
        })
    } catch (error) {
        res.status(501).json({ error: error });
    }
})

// get all User
exports.getAllUsers = asyncError(async(req,res)=>{
    try {

        const usersData = await User.find()

        res.status(200).json({
            usersData
        }); 
    } catch (error) {
        res.status(501).json({ error: error });
    }  

})


// get single user
exports.getSingleuser = asyncError(async(req,res)=>{
    try {
        const {id} = req.params;

        const singleUserData = await User.findOne({_id:id})
        res.status(200).json(singleUserData);
    } catch (error) {
        res.status(501).json({ error: error });
    }
    
})


// delete user
exports.deleteuser = asyncError(async(req,res)=>{
    try {
        const {id} = req.params;

        const currentUser = await User.findById(req.user._id)
        if(currentUser.role !== "admin"  &&  currentUser._id !== id){
            res.status(401).json({ succcess:false, message: "Not Authorized" });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({
            success : true,
            message: "User Deleted Successfully",
        });

    } catch (error) {
        res.status(501).json({succcess:false, message: error.message });
    }
    
    
})

// update user
exports.updateUser = asyncError(async(req,res)=>{
    const {id} = req.params;
    const { name, email, mobile } = req.body;

    // const dateUpdate = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

    const updateUserdata = await User.findByIdAndUpdate({_id:id},{
        name, email, mobile
    },{new:true, runValidators: true, useFindAndModify: false,});

    await updateUserdata.save();

    res.status(200).json(updateUserdata)
    
})

exports.changePassword = asyncError( async(req, res, next) => {
    
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatch = await user.comparePasswords(req.body.oldPassword);

    if(!isPasswordMatch){
        return next( res.status(401).json({meggsge: "Incorrect Password"}));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next( res.status(404).json({meggsge: "Password not Matched"}))
    }

    user.password = req.body.newPassword;
    await user.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
        user
    })
})
