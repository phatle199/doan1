const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config({ path: `${__dirname}/config.env` });

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
app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
