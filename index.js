const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS
const userRoutes = require("./route/user.route");

dotenv.config();

const app = express();

// Enable CORS
app.use(cors({
  
  origin: 'http://localhost:5174',
  credentials : true,
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.mongodb; // Read from .env file

// Routes
app.use('/api', userRoutes);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB 🚀'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
