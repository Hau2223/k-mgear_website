const express = require("express");
const Product = require("../models/productModel");
const cors = require('cors');
const app = express();
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Create a new product
app.post('/create', (req, res) => {
    const { name, type, price, discount, quantity, brand, description, rating, sold, imageUrl, totalReviews } = req.body;
    const newProduct = new Product({ name, type, price, discount, quantity, brand, description, rating, sold, imageUrl, totalReviews });
    newProduct
        .save()
        .then(() => {
            res.status(200).json({ message: 'Product created successfully!' });
        })
        .catch(err => {
            console.log('Error creating product:', err);
            res.status(404).json({ message: 'Error creating product' });
        });
});
// Update a product by id
app.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully!', status: 200, data: updatedProduct, });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/updateRating/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProductRating = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductRating, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully!', status: 200, data: updatedProduct, });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a product by id
app.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully!', status: 200 });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Get all products
app.get('/getAll', async (req, res) => {
    try {
        const products = await Product.find({ quantity: { $gt: 0 } });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(404).json({ message: 'Internal server error' });
    }
});

// Get products by id
app.get('/getById/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(404).json({ message: 'Product not found' });
    }
});

app.get('/getByTerm/:term', async (req, res) => {
    try {
        const { term } = req.params;
        const product = await Product.find({
            $or: [
                { name: { $regex: term, $options: 'i' } }, 
                { type: { $regex: term, $options: 'i' } },
                { brand: { $regex: term, $options: 'i' } } // Tìm kiếm không phân biệt chữ hoa chữ thường
            ]
        });
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(404).json({ message: 'Product not found' });
    }
});


app.get('/getByType/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const product = await Product.find({ type, quantity: { $gt: 0 } });
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(404).json({ message: 'Product not found' });
    }
});


module.exports = app;
