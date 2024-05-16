import express from "express"
import authMiddleware from "../middleware/auth.js"
import { PlOrder, userOrders, verifyOrder, listOrders, updateStatus, getOrderDetails  } from "../controller/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,PlOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.get('/list',listOrders);
orderRouter.post("/status",updateStatus);
orderRouter.get('/details/:orderId', getOrderDetails);



export default  orderRouter;

