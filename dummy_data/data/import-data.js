const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');

// console.log(`${__dirname}/../config.env`);
dotenv.config({ path: `${__dirname}/../../config.env` });

const app = require('../../app');

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

const DUMMY_TOURS = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);

const DUMMY_USERS = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, 'utf-8')
);

const importDummyData = async () => {
  try {
    await Tour.create(DUMMY_TOURS, { validateBeforeSave: false });
    // await User.create(DUMMY_USERS, { validateBeforeSave: false });

    console.log('Imported dummy data successfully 👍');
  } catch (err) {
    console.log('Something went wrong when importing data 💥', err);
  }
  process.exit(1);
};

const deleteDataFromACollections = async () => {
  try {
    await Tour.deleteMany();
    // await User.deleteMany();
    console.log('Deleted data successfully 👍');
  } catch (err) {
    console.log('Something went wrong when deleting data 💥', err);
  }
  process.exit(1);
};

if (process.argv[2] === '--import') {
  importDummyData();
} else if (process.argv[2] === '--delete') {
  deleteDataFromACollections();
} else {
  console.log('Invalid action 🙁');
  process.exit(1);
}
