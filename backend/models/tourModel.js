const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tên tour là bắt buộc.'],
    unique: true,
    trim: true,
    maxlength: 100,
  },
  duration: {
    type: Number,
    required: [true, 'Số ngày là bắt buộc.'],
    min: [1, 'Số ngày của một tour ít nhất phải là 1'],
  },
  difficulty: {
    type: String,
    required: [true, 'Độ khó là bắt buộc.'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Độ khó phải là easy hoặc medium hoặc difficulty',
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
    required: [true, 'Một tour phải có ít nhất 3 ảnh để giới thiệu.'],
  },
  imageCover: {
    type: String,
    required: [true, 'Một tour phải có một ảnh bìa.'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Một tour phải có số lượng người tham gia tối đa'],
    min: [1, 'Một nhóm phải có ít nhất một người tham gia'],
  },
  price: {
    type: Number,
    required: [true, 'Một tour phải có giá'],
    min: [0, 'Giá không thể âm'],
  },
  summary: {
    type: String,
    required: [true, 'Một tour phải có tóm tắt'],
    minlength: 10,
  },
  description: {
    type: String,
    required: [true, 'Một tour phải có mô tả'],
  },
  startDates: {
    type: [String],
    required: [true, 'Một tour phải có các ngày bắt đầu'],
  },
  startLocation: {
    type: String,
  },
  locations: {
    type: [String],
  },
  // guides: {

  // },
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

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
