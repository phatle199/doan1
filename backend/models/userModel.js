const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: 'Passwords are not the same',
    },
  },
  photo: {
    type: String,
    default: 'default.jpeg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead guide', 'admin'],
    default: 'user',
  },
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre('save', async function (next) {
  // Chỉ mã hóa mật khẩu khi cột password được thêm hoặc được thay đổi
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.methods.enteredPasswordIsCorrect = async (
  candicatePassword,
  userPassword
) => {
  return await bcrypt.compare(candicatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (tokenIssuedAt) {
  const passwordChangedAt = this.passwordChangedAt;
  console.log(passwordChangedAt);
  console.log(tokenIssuedAt);
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
