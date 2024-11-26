const express = require("express");
const multer = require("multer");
const Product = require("../models/productModel");
const cors = require("cors");
const app = express();
const sharp = require("sharp");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false,  limit: '20mb' }));
app.use(bodyParser.json({ limit: '20mb' }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, });

// Create a new product
app.post("/create", async  (req, res) => {
  const newProduct = new Product({
    name: req.body.name,
    type: req.body.type,
    price: req.body.price,
    discount: req.body.discount,
    quantity: req.body.quantity,
    brand: req.body.brand,
    description: req.body.description,
    rating: req.body.rating,
    sold: req.body.sold,
    imageUrl: `data:${req.body.typeImage};base64,${req.body.imageUrl}`,
    contentType: req.body.typeImage
  });
  newProduct
    .save()
    .then(() => {
      res.status(200).json({ message: "Product created successfully!", status: 200 });
    })
    .catch((err) => {
      console.log("Error creating product:", err);
      res.status(404).json({ message: "Error creating product" });
    });
});

app.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Construct update data including imageUrl and contentType
    const updateData = {
      ...req.body,
      imageUrl: `data:${req.body.typeImage};base64,${req.body.imageUrl}`,
      contentType: req.body.typeImage,
    };

    console.log(updateData);

    // Find product by ID and update
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully!",
      status: 200,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update product

// Delete product
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ message: "Product deleted successfully!", status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch all products
app.get("/getAll", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(404).json({ message: "Internal server error" });
  }
});

// Fetch product by ID
app.get("/getById/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(404).json({ message: "Product not found" });
  }
});

// Fetch products by type
app.get("/getByType/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const product = await Product.find({ type });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(404).json({ message: "Product not found" });
  }
});

module.exports = app;
