const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');

//  importing models
const Short = require('../Model/Short');

const router = new express.Router();

//  multer 
const storage  = multer.diskStorage({
   destination : (req, file, callback)=>{
      callback(null, "/uploads/" )},
   filename: (req , file , callback) =>{
      callback(null , file.fieldname+ '-' + Date.now() + file.originalname);
   }
})

const upload = multer({storage : storage});

//  multer ends here

const verifyToken = (req, res, next) => {
   const authHeader = req.headers["authorization"];
   const token = authHeader && authHeader.split(" ")[1];
   if (token == null) return res.sendStatus(403);
   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
   if (err) return res.sendStatus(404);
   req.user = user;
   next();
   });
 }

router.post('/addShorts', verifyToken , upload.single('fileUrl') , async (req , res)=>{
   const {title, caption, fileUrl} = req.body;

   console.log(req.body);

   console.log(req.header);
    
   if(!title || !caption || !fileUrl){
       res.status(400).json("Request was incomplete!");
   }
   const newShorts = await Short.create({
      title,
      caption,
      fileUrl,
   });
   if(newShorts){
      res.status(200).json("Shorts succesfully added!");
   }else{
      res.status(400).json("Something Broke Down!");

   }
   
})

module.exports = router;