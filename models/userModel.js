const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
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
      enum: {
        values: ['user', 'guide', 'lead-guide', 'admin'],
        message: 'Role must be user or guide or lead-guide or admin',
      },
      default: 'user',
    },
    passwordChangedAt: Date,
    active: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpiresIn: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

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

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.enteredPasswordIsCorrect = async (
  candicatePassword,
  userPassword
) => {
  return await bcrypt.compare(candicatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (tokenIssuedAt) {
  if (this.passwordChangedAt) {
    const passwordChangedAt = new Date(this.passwordChangedAt).getTime() / 1000;
    return passwordChangedAt > tokenIssuedAt;
  }

  return false;
};

userSchema.methods.createResetPasswordToken = function () {
  // Tạo reset password token bằng module crypto của nodejs
  const resetPasswordToken = crypto.randomBytes(32).toString('hex');

  // Hash và Lưu reset password token và thời hạn của token đó vào database
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetPasswordToken)
    .digest('hex');

  this.resetPasswordTokenExpiresIn = Date.now() + 10 * 60 * 1000;

  return resetPasswordToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
