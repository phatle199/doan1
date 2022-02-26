const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: 100,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
    min: [1, 'Duration must be greater than 0'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty must be easy or medium or hard',
    },
  },
  ratingsAverage: {
    type: Number,
    default: 0,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  images: {
    type: [String],
    // validate: {
    //   validator: (value) => Array.isArray(value) && value.length > 2,
    //   message: 'A tour must have at least 3 images',
    // },
  },
  imageCover: {
    type: String,
    // required: [true, 'A tour must have at least 1 image cover'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a max group size'],
    min: [1, 'Max group size must be greater than 0'],
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
    min: [1, 'Price must be greater than 0'],
  },
  summary: {
    type: String,
    required: [true, 'A tour must have a summary'],
    minlength: [20, 'Summary must have at least 20 characters'],
  },
  description: {
    type: String,
    required: [true, 'A tour must have a description'],
    minlength: [30, 'Summary must have at least 30 characters'],
  },
  startDates: {
    type: [String],
    required: [true, 'A tour must have start dates'],
  },
  startLocation: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
    address: String,
    description: String,
    day: Number,
  },
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number,
    },
  ],
  guides: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    validate: {
      validator: (value) => Array.isArray(value) && value.length > 0,
      message: 'A tour must have at least 1 guide',
    },
  },
  // reviews: {

  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

// Modelling Tour Guides: Embedding
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });

// Modelling Tour Guides: Child referencing
tourSchema.pre(/^find/, function (next) {
  this.populate('guides');
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
