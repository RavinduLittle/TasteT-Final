import foodModel from "../models/foodmodel.js";
import orderModel from "../models/orderModel.js";
import fs from "fs";

// Add food item
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
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
    console.error("Error adding food:", error);
    res.status(500).json({ success: false, message: "Error: food not added" });
  }
};

// List all food items
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error("Error fetching food list:", error);
    res.status(500).json({ success: false, message: "Error fetching food list" });
  }
};

// Remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (food) {
      fs.unlink(`uploads/${food.image}`, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        }
      });

      await foodModel.findByIdAndDelete(req.body.id);
      res.json({ success: true, message: "Food removed" });
    } else {
      res.status(404).json({ success: false, message: "Food not found" });
    }
  } catch (error) {
    console.error("Error removing food:", error);
    res.status(500).json({ success: false, message: "Error removing food" });
  }
};

// Get order details
const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Retrieve food details for each order item
    const itemsWithPrices = await Promise.all(
      order.items.map(async (item) => {
        const foodItem = await foodModel.findById(item.foodId);
        if (!foodItem) {
          throw new Error(`Food item not found for ID: ${item.foodId}`);
        }
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
    res.status(500).json({ success: false, message: "Error fetching order details" });
  }
};

// Update food price
const updateFoodPrice = async (req, res) => {
  try {
    const { id, price } = req.body;
    const food = await foodModel.findById(id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food not found' });
    }
    food.price = price;
    await food.save();
    res.json({ success: true, message: 'Price updated successfully' });
  } catch (error) {
    console.error('Error updating price:', error);
    res.status(500).json({ success: false, message: 'Error updating price' });
  }
};

export { addFood, listFood, removeFood, getOrderDetails,updateFoodPrice };
