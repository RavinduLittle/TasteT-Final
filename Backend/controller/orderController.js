import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PlOrder = async (req, res) => {
    const frontend_url = "http://localhost:5174";

    try {
        // Calculate the total amount of the order
        const totalAmount = req.body.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Create a new order object with correct field assignments
        const newOrder = new orderModel({
            userId: req.body.userId,
            amount: totalAmount, // Assign totalAmount to the amount field
            items: req.body.items, // Assign items array to the items field
            address: req.body.address,
        });

        // Save the new order to the database
        await newOrder.save();

        // Clear the user's cart after order is placed
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Prepare line items for Stripe checkout
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "lkr",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100* 10, // Assuming unit amount is in cents
            },
            quantity: item.quantity,
        }));

        // Add delivery charges as a separate line item
        line_items.push({
            price_data: {
                currency: "lkr",
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: 2 * 100 * 80, // Assuming delivery charges calculation
            },
            quantity: 1,
        });

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        // Respond with the session URL
        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error('Error while processing order:', error);

        // Return a more detailed error message
        res.status(500).json({
            success: false,
            message: "An error occurred while processing your order. Please try again later.",
            error: error.message, // Include the error message for better debugging
        });
    }
};


const verifyOrder = async (req,res) => {

    const {orderId,success} = req.body;
    try {
        if (success=="true") {
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//user orders for frontend
const userOrders = async (req,res) => {

    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//listing order for admin panel
const listOrders = async (req,res) =>{
    try {
        const order = await orderModel.find({});
        res.json({success:true,data:order})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

//api for updating order status
const updateStatus = async(req,res) =>{
    try {
        await orderModel. findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"status updated"})
    } catch (error) {
       console.log(error)
       res.json({success:false,message:"Error"})
    }
}

const getOrderDetails = async (req, res) => {
    const orderId = req.params.orderId;
    try {
      const order = await orderModel.findById(orderId); // Assuming you have a model named orderModel
      if (order) {
        res.json(order);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  

export { PlOrder,verifyOrder,userOrders,listOrders,updateStatus,getOrderDetails };
