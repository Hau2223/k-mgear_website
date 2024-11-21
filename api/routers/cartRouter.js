const express = require("express");
const Cart = require("../models/cartModel");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Create a new cart
app.post('/create', async (req, res)  => {
    const { idUser, idProduct, amount, status } = req.body;
    const existingCart = await Cart.findOne({ idProduct, idUser, status: "cart" });
    console.log(existingCart);
    
    if (existingCart) {
        return res.status(200).json({ message: 'Already in cart!' });
    }
    const newCart = new Cart({ idUser, idProduct, amount, status });
    console.log(newCart);
    
    newCart
        .save()
        .then(() => {
            res.status(200).json({ message: 'Cart created successfully!' });
        })
        .catch(err => {
            console.log('Error creating cart:', err);
            res.status(404).json({ message: 'Error creating cart' });
        });
});

app.get('/getById/:idUser', async (req, res) => {
    try {
        const { idUser } = req.params;
        const carts = await Cart.find({ idUser }); 
        if (!carts || carts.length === 0) {
            return res.status(404).json({ message: 'No carts found for this user' });
        }
        res.status(200).json(carts);
    } catch (error) {
        console.log('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = app;