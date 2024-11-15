const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const movieRoutes = require('./routes/movieRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes')

const app = express();

connectDB();

app.use(cors());

// Middleware để parse body request
app.use(express.json());

// Middleware cơ bản để kiểm tra
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Cinema app!</h1>');
});

app.use('/movies', movieRoutes);

app.use('/auth', authRoutes)

app.use('/products', productRoutes)

app.listen(3001, () => {
  console.log("Server is running on 3001");
});

module.exports = app