import user from "../models/user.js";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import password from "../models/password.js";
dotenv.config(); 
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exist = await user.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "user already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newuser = new user({ username, email, passwordHash });
    await newuser.save();
    return res.status(200).json({ message: "signup succesfull" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
    try{
  
  const { email, password } = req.body;
  const exist = await user.findOne({ email });
  

  if (!exist) {
    return res.status(400).json({ message: "go signup no account matched" });
  }
  const isMatch = await bcrypt.compare(password, exist.passwordHash);
if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign(
    {
      _id: exist._id,
      username: exist.username,
      email: exist.email,
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );


  res.status(200).json({
    token,
    userid:exist._id,
    username:exist.username,
    message:"login successfull"
  })
    }catch(err){
        res.status(500).json({message:err.message})
    }
});
export default router;