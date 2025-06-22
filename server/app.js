const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

if(process.env.USE_MYSQL === 'true') {
    const db = require('./models/mysql');

    db.sequelize
    .sync()
    .then(() => {
      console.log('MySQL models synced (tables created if not exist)');
    })
    .catch((err) => {
      console.error('Sequelize sync error:', err.message);
    });

    app.use('/api/auth', require('./routes/mysql/authRoutes'));
    app.use('/api/chat', require('./routes/mysql/chat'));
    app.use('/api/user', require('./routes/mysql/user'));
    app.use('/api/admin', require('./routes/mysql/admin'));
} else {
    const connectDB = require('./config/db');
    connectDB();

    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/chat', require('./routes/chat'));
    app.use('/api/user', require('./routes/user'));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
