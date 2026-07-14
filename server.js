require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/auth');
const schoolRoutes = require('./src/routes/schools');
const busRoutes = require('./src/routes/buses');
const driverRoutes = require('./src/routes/drivers');
const studentRoutes = require('./src/routes/students');
const trackingRoutes = require('./src/routes/tracking');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/tracking', trackingRoutes);

app.get('/', (req, res) => {
  res.send('School Bus Tracking Backend Running');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});