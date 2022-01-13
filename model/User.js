const mongoose = require('mongoose');

const User = mongoose.model('User', {
  firstName: {
    type: String,
    unique: false,
    required: true,
    trim: true,
    maxlength: 75,
    uppercase: true
  },
  lastName: {
    type: String,
    unique: false,
    required: true,
    trim: true,
    maxlength: 75,
    uppercase: true
  },
  title: {
    type: String,
    unique: false,
    required: false,
    trim: true,
    maxlength: 100,
    uppercase: true
  },
  avatar: {
    type: String,
    unique: false,
    required: false,
    trim: true,
    maxlength: 255,
    lowercase: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    unique: false,
    required: true,
    trim: true,
    maxlength: 50,
    minlength: 3
  },
  roles: {
    type: String,
    enum: ['ROLE_CUSTOMER_USER', 'ROLE_CUSTOMER_ADMIN', 'ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN'],
    default: 'ROLE_USER'
  },
  mobilePhone: {
    type: String,
    unique: false,
    required: false,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVIP: {
    type: Boolean,
    default: false
  },
  isAccountApproved: {
    type: Boolean,
    default: true
  },
  isPasswordTemp: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now // default: () => new Date(+new Date() + 7*24*60*60*1000)
  },
  otherInfos: {
    type: mongoose.Schema.Types.Mixed
  },
  currencyFavorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CurrencyFavorite'
    }
  ]
});

module.exports.User = User;
