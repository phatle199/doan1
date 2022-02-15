const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/config.env` });

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTIONS 💥, Shutting down...');
  console.log(`Error name: `, err.name);
  console.log(`Error message: `, err.message);
  console.log(`Error stack: `, err.stack);

  process.exit(1);
});

const app = require('./app');

const db = process.env.DB_CONNECTION_STRING.replace(
  '<password>',
  process.env.DB_PASSWORD
);

mongoose
  .connect(db, {
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection succesful!'));

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Server is running at http://127.0.0.1:${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTIONS 💥, Shutting down...');
  console.log(`Error name: `, err.name);
  console.log(`Error message: `, err.message);
  console.log(`Error stack: `, err.stack);

  server.close(() => {
    process.exit(1);
  });
});
