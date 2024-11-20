const express = require("express");
const Comment = require("../models/comentModel");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Create a new cart
app.post('/create', (req, res) => {
    const { idUser, idProduct, comment, rating } = req.body;
    const newComment = new Comment({ idUser, idProduct, comment, rating });
    newComment
        .save()
        .then(() => {
            res.status(200).json({ message: 'Comment created successfully!',status: 200,  data: newComment, });
        })
        .catch(err => {
            console.log('Error creating comment:', err);
            res.status(404).json({ message: 'Error creating comment' });
        });
});

app.get('/getAllProductId/:idProduct', async (req, res) => {
    try {
        const { idProduct } = req.params;
        const comments = await Comment.find({ idProduct }); 
        if (!comments || comments.length === 0) {
            return res.status(404).json({ message: 'No comment found for this product' });
        }
        res.status(200).json({message: 'Successfully', status: 200, data: comments});
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = app;