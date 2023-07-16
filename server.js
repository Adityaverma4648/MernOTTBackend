require("dotenv").config();
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport')

//  config Files
const connectDB = require('./config/DB');

//  importing Routes
const authRoutes  = require('./Routes/authRoutes');
const crudRoutes = require('./Routes/crudRoutes');


// express instance
const app = express();
app.use(express.json()); // to accept json data
app.use(express.urlencoded({extended:false}));


// cookies and session 
app.use(cookieParser())
// Session Setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie : {  },
}))

app.get("/",(req , res)=>{
  res.status(200).send("Hello world");
})

app.use("/auth" , authRoutes);
app.use("/crud" , crudRoutes);


const start = async ()=>{
  try {
      await connectDB(process.env.MONGODB_URI);
     app.listen(process.env.PORT,console.log(`SERVER STARTED AT ${process.env.PORT}`));
  } catch (error) {
      console.log(`Connection failed : ${error}`)
  }

}
start();