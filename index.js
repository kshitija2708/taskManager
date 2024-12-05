const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose")

//uncaught Errors
process.on("uncaughtException", (err)=>{
    console.log(`Error : ${err}`);
    console.log("Closing Server by uncaughtException");
    process.exit(1);
})

//configuration
dotenv.config()


//db connection
console.log(process.env.DB_URL);

mongoose.connect(process.env.DB_URL, {useNewUrlParser:true})
    .then((data)=>{
        console.log(`db connected to ${data.connection.host}`);
    })
    .catch((err)=>{
        console.log(`Database Connection Failed ${err}`); 
    })

//start server
const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server Start at ${process.env.PORT}`);
})


//unhandled rejection by server
process.on("unhandledRejection", (err)=>{
    console.log(`Error : ${err}`);
    console.log("Closing Server");

    server.close(()=>{
        process.exit(1);
    })
})