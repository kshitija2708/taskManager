const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter Name"],
        maxLength: [30, "Name cannot exceed 30 charecters"],
        minLength: [4, "Name must exceed 4 charecters"]
    },
    email:{
        type: String,
        required: [true, "Please enter Email"],
        unique: true,
        validate: [validator.isEmail, "Please enter valid Email"]
    },
    password:{
        type: String,
        required: [true, "Please enter Name"],
        minLength: [8, "Name must exceed 4 charecters"],
        select: false             //this will not found in "model.find({})"
    },
    mobile: {
        type: String,
        required: [true, "Please Enter Mobile Number"],
        minLength: [10, "Mobile must be 10 digits"],
        maxLength: [10, "Mobile must be 10 digits"],
    },
    role:{
        type: String,
        default: "user"
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})


//JWT TOKEN
userSchema.methods.getJWTToken = function(){

    //creating a secret token and giving it expiry so that it will sign out after perticular time
    return jwt.sign({id:this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

//passwordComparer

userSchema.methods.comparePasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
};



//RESET PASSWORD Token
userSchema.methods.getResetPasswordToken = function (){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 10*60*1000;

    return resetToken;
}

module.exports = mongoose.model("User", userSchema);