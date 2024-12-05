const asyncError = require("./asyncError");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken")

exports.isAuthenticatedUser = asyncError(async (req, res, next) =>{
    const {token} = req.cookies;
    // console.log(token);
    if(!token){
        return next(res.status(401).json({message: "Please Login First"}));
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(data.id);

    next();
})

exports.authorizeRoles = (...roles) => {
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return next(res.status(403).json({message: `${req.user.role} cannot access this`}))
        }
        next()
    }
}