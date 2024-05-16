import foodModle from "../models/foodModel.js";
import orderModel from "../models/orderModel.js";
import fs from "fs";

// add food item
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const food = new foodModle({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error.food not add" });
  }
};

//all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModle.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

//remove foods item
const removeFood = async (req, res) => {
  try {
    const food = await foodModle.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModle.findByIdAndDelete(req.body.id); // Changed from res.body.id to req.body.id
    res.json({ success: true, message: "food removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderModel.findById(orderId);

    // Retrieve food details for each order item
    const itemsWithPrices = await Promise.all(
      order.items.map(async (item) => {
        const foodItem = await foodModle.findById(item.foodId);
        return {
          ...item.toObject(),
          price: foodItem.price, // Assuming foodItem contains price field
        };
      })
    );

    res.json({
      success: true,
      order: { ...order.toObject(), items: itemsWithPrices },
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.json({ success: false, message: "Error fetching order details" });
  }
};

/* Update food */
const updatePrice = async (req, res) => {
  const orderId = req.params.orderId;
  const { price } = req.body;
  try {
    // Find the food item by its ID and update the price
    await foodModle.findByIdAndUpdate(price);
    res.json({ success: true, message: "Price updated successfully" });
  } catch (error) {
    console.error("Error updating price:", error);
    res.status(500).json({ success: false, message: "Failed to update price" });
  }
};

export { addFood, listFood, removeFood, getOrderDetails, updatePrice };
