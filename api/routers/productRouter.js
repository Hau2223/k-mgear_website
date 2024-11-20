const express = require("express");
const Product = require("../models/productModel");
const cors = require('cors');
const app = express();
app.use(cors());
// Create a new product
app.post('/create', (req, res) => {
    const { name, type, price, discount, quantity, brand, description, rating, sold, imageUrl } = req.body;
    const newProduct = new Product({ name, type, price, discount, quantity, brand, description, rating, sold, imageUrl });
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

// Get all products
app.get('/getAll', async (req, res) => {
    try {
        const products = await Product.find();
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

app.get('/getByType/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const product = await Product.find({type});        
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error); 
        res.status(404).json({ message: 'Product not found' });
    }
});


module.exports = app;
