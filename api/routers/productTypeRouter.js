const express = require("express");
const Type = require("../models/productTypeModel");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Create a new cart
app.post('/create', (req, res) => {
    const { name } = req.body;
    const newCart = new Type({name});
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

module.exports = app;