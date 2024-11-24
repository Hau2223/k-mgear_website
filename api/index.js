const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8000;
const cors = require('cors');
mongoose.connect(
    'mongodb+srv://nguyentrunghau220203:hau123@cluster0.afk8u.mongodb.net/',
    {
      // useNewUrlParser: true,
      // useUnifiedTopology: true
      // Các tùy chọn khác nếu cần thiết
    },
  )
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log('Error connecting to MongoDB', err);
  });

  const userRou = require('./routers/userRouter');
  const productRou = require('./routers/productRouter');
  const cartRou = require("./routers/cartRouter");
  const productBrandRou = require("./routers/productBrandRouter")
  const productTypeRou = require("./routers/productTypeRouter");
  const commentRou = require("./routers/commentRouter");
  
  app.use(cors({ origin: 'http://localhost:3000' }));
  app.use('/api/user', userRou);
  app.use('/api/product', productRou);
  app.use('/api/cart', cartRou);
  app.use('/api/brand', productBrandRou);
  app.use('/api/type', productTypeRou);
  app.use('/api/comment', commentRou);
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  
app.listen(port, () => {
  console.log('Sever running on port 8000 ');
});
