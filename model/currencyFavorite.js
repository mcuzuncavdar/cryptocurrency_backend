const mongoose = require("mongoose");

const CurrencyFavorite = mongoose.model('CurrencyFavorite', {
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  favoriteIds: {
    type: Array,
    required: true,
    default: []
  }
});

module.exports.CurrencyFavorite = CurrencyFavorite;
