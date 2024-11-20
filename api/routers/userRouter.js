const express = require("express");
const User = require("../models/userModel");
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
// Create a new cart
app.post('/register', (req, res) => {
    const { name, type, username, password } = req.body;
    const newUser = new User({ name, type, username, password });
    newUser
      .save()
      .then(() => {
        res.status(200).json({ message: 'User registered successfully!' });
      })
      .catch(err => {
        console.log('Error registering user!!!', err);
        res.status(400).json({ message: 'Error registered the user!' });
      });
  });

  const createToken = userId => {
    const payload = {
      userId: userId,
    };
    const token = jwt.sign(payload, 'Q$r2K6W8n!jCW%Zk', { expiresIn: '1h' });
    return token;
  };

  app.post('/login', (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) {
      return res
        .status(404)
        .json({message: 'Email and the password are required'});
    }
  
    User.findOne({username})
      .then(user => {
        if (!user) {
          return res.status(404).json({message: 'User not found'});
        }
        if (user.password !== password) {
          return res.status(404).json({message: 'Invalid Password'});
        }
        const token = createToken(user._id);
        const type = user.type;
        res.status(200).json({type,token, status: 200});
      })
      .catch(err => {
        console.log('Error in finding the user', err);
        res.status(404).json({message: 'Internal server Error!'});
      });
  });

module.exports = app;