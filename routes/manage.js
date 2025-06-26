import dotenv from "dotenv";
import Password from '../models/password.js';
import express from 'express';
import jwt from 'jsonwebtoken'
const router = express.Router();
dotenv.config();
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

router.post('/manage', verifyToken, async (req, res) => {
  try {
    const { site, username, password } = req.body;


    const newdata = new Password({
      site,
      userId: req.user._id,
      username,
      password,
    });

    await newdata.save();
    res.status(200).json({ newdata, message: "Saved successfully" });

  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
});


router.get("/retrive", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const data = await Password.find({ userId }); 

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE endpoint to delete a password entry by ID
router.delete("/manage/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params; 

    
    const entry = await Password.findOne({ _id: id, userId });

    if (!entry) {
      return res.status(404).json({ message: "Password entry not found or unauthorized" });
    }

    await Password.findByIdAndDelete(id);
    res.status(200).json({ message: "Password entry deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: err.message });
  }
});


export default router;
