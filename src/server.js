require('dotenv').config();

const { app, sequelize } = require('./app');
const config = require('./config');

const start = async () => {
  try {
    await sequelize.authenticate();
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error.message);
    process.exit(1);
  }
};

start();
