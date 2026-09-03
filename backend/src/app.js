const path = require('path');
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes');
const { errorHandler } = require('./middlewares/errorHandler');
const config = require('./config');

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    exposedHeaders: ['x-temp-token', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve(process.cwd(), config.uploadDir)));

app.get('/health', (_req, res) => {
  res.json({ error: false, code: 0, message: 'Success', data: { status: 'ok' } });
});

app.use('/api/users', userRoutes);
app.use(errorHandler);

module.exports = { app, sequelize };
