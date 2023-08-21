require("dotenv").config();
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require("body-parser")
const multer = require('multer');
const jwt = require('jsonwebtoken');

//  importing coloudinary
const cloudinary = require('./cloudinary/index');

//  importing models
const Short = require('./Model/Short');

//  config Files
const connectDB = require('./config/DB');

//  importing Routes
const authRoutes  = require('./Routes/authRoutes');

// express instance
const app = express();
app.use(express.json()); // to accept json data
app.use(express.urlencoded({extended:false}));

//  to make axios work
app.use(cors());
app.use(cors({
  origin : ['http://localhost:3000/', 'http://localhost:7000/' ]
}));

app.use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH' , 'HEAD']}))

app.use(cors({
  allowedHeaders: ['Authorization', 'Content-Type']
}))

const storage  = multer.diskStorage({
  destination : (req, file, callback)=>{
     callback(null, "/Uploads" )},
  filename: (req , file , callback) =>{
     callback(null , file.fieldname+ '-' + Date.now() + file.originalname);
  }
})

const upload = multer({storage : storage});

//  multer ends here

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json("Token Is Null");
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  if (err) return res.status(400).json("Couldnot Verify");
  req.user = user;
  next();
  });
}

app.get("/",(req , res)=>{
  res.status(200).send("Hello world");
})

app.use("/auth" , authRoutes);

app.post('shorts/add' , verifyToken  , async (req , res)=>{
   const {title, caption , fileUrl} = req.body; 
   
   //  getting userdata from token

   const authHeader = req.headers['authorization']
   const token = authHeader && authHeader.split(" ")[1];
   const decoded = jwt.decode(token);
   const createdBy = [decoded];

   if(!title || !caption || !fileUrl ){
       res.status(400).json("Request was incomplete!");
   }
   // const newShorts = await Short.create({
   //    title,
   //    caption,
   //    fileUrl,
   //    createdBy : [createdBy[0].data]
   // });
   // if(newShorts){
   //    res.status(200).json("Shorts succesfully added!");
   // }else{
   //    res.status(400).json("Something Broke Down!");

   // }
   
});





const start = async ()=>{
  try {
      await connectDB(process.env.MONGODB_URI);
     app.listen(process.env.PORT,console.log(`SERVER STARTED AT ${process.env.PORT}`));
  } catch (error) {
      console.log(`Connection failed : ${error}`)
  }

}
start();