import express from "express";
import {
  addFood,
  listFood,
  removeFood,
  updateFoodPrice,
  
} from "../controller/foodcontroller.js";
import multer from "multer";

const foodroute = express.Router();

// image store
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

foodroute.post("/add", upload.single("image"), addFood);
foodroute.get("/list", listFood);
foodroute.post("/remove", removeFood);
foodroute.put('/updatePrice', updateFoodPrice)

export default foodroute;
