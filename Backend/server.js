import express from "express"
import cors from "cors"
// import { connect } from "mongoose"
import { connectdb } from "./config/db.js"
import foodroute from "./routes/foodroute.js"
import userRoute from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"


// app config 
const app=express()
const port=4000

//middlware
app.use(express.json())
app.use(cors())

// Use userRouter
app.use('/api/user', userRoute);

//db connection
connectdb();

//api endpoint
app.use("/api/food",foodroute)
app.use("/image",express.static('uploads'))
app.use("/api/user",userRoute)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
    res.send("API working")
})

app.listen(port,()=>{
    console.log(`server started on http://localhost:${port}`)
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));