const express = require('express');
const cors = require('cors');
require('dotenv').config();

const travelRoutes = require('./routes/travelRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/routes', travelRoutes);

app.get('/', (req, res) => {
  res.send('Smart Travel Planner API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
