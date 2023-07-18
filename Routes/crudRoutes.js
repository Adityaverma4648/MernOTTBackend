const express = require('express');
const multer = require('multer');

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

router.post('/addShorts', upload.single('fileUrl') , async (req , res)=>{
   const {title, caption , fileUrl} = req.body;

   if(!title || !caption || !fileUrl){
       res.status(400).json("Request was incomplete!");
   }
   const newShorts = await Short.create({
      title,
      caption,
      fileUrl,
   });
   if(newShorts){
      res.status(200).json("Shorts succesfully added!")
   }else{
      res.status(400).json("Something Broke Down!")

   }
   
})

module.exports = router;