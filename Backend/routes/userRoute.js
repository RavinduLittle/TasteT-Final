import express  from "express"
import { loginUser,registerUser,getUserDetails } from "../controller/userController.js"

const userRoute = express.Router()

userRoute.post ("/register",registerUser)
userRoute.post("/login",loginUser)
userRoute.get('/details/:userId', getUserDetails);

export default userRoute;