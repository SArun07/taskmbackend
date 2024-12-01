const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'arunsingh@07';

// ROUTE 1: Create a User Using POST "/api/auth/createuser". No login required
router.post('/createuser', [
    body('name', 'Enter a Valid Name').isLength({ min: 3 }),
    body('email',' Enter a Valid Name').isEmail(),
    body('password', 'Password must be at least 5 Charactres').isLength({ min: 5 }),
] ,async (req, res)=>{
  let success = false;
    // if there are errors, Returned bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    
    try {
      // Check wheather with this email exists already
    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({success, error: 'Sorry the user with this email is already exists'})
    }
    const salt = await bcrypt.genSaltSync(10);
    secPass = await bcrypt.hash(req.body.password, salt);
    // create a new user
    user = await User.create({
    name: req.body.name,
    password: secPass,
    email: req.body.email,
      })
      
    //   .then(user => res.json(user))
    //   .catch(err => {console.log(err)
    // res.json({error: 'Please Enter unique value for email', message: err.message})});
      


    //Ye method bhi kar sakte hai without validation
    // console.log(req.body) // ager req.body ko use karna hai to middle ware ko lagana padega 
    // const user = User(req.body);
    // user.save();
    // res.send(req.body)

      const data = {
        user:{
          id:user.id
        }
      }
      const authToken = jwt.sign(data, JWT_SECRET)


    // res.json(user);
    success = true;
    res.json({success, authToken});
    
} catch (error) {
    console.error(error.message);      // Idealy hmlog isko logger or SQS me use karenge
    res.status(500).send("Internal server Error Occured"); 
}
})

// ROUTE 2: Authenticate a User Using POST "/api/auth/login". No login required
router.post('/login', [
  body('email', 'Enter a Valid Name').isEmail(),
  body('password', 'Password can not be blank').exists(),
] ,async (req, res)=>{
  let success = false;
  // if there are errors, Returned bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email, password} = req.body;
  try {
    let user = await User.findOne({email});
    if(!user){
      return res.status(400).json({success, error: 'Please try to login with correct crediantials'});
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if(!comparePassword){
      return res.status(400).json({success, error: 'Please try to login with correct crediantials'});
    }

    const payload = {
      user:{
        id:user.id
      }
    }
    const authToken = jwt.sign(payload, JWT_SECRET)
    success= true;
    res.json({success, authToken});

  }catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error Occured"); 
}
})
// ROUTE 3: Get loggined User Details Using POST "/api/auth/getuser". Login required
router.post('/getuser' , fetchuser, async (req, res)=>{
try {
  userId = req.user.id;
  const user = await User.findById(userId).select('-password');
  res.send(user)
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server Error Occured"); 
}
})
module.exports = router
