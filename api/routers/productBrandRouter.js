const express = require("express");
const Brand = require("../models/productBrandModel");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create a new cart
app.post('/create', (req, res) => {
    const { name } = req.body;
    const newCart = new Brand({ name });
    newCart
        .save()
        .then(() => {
            res.status(200).json({ message: 'Brand created successfully!' });
        })
        .catch(err => {
            console.log('Error creating brand:', err);
            res.status(404).json({ message: 'Error creating brand' });
        });
});

module.exports = app;