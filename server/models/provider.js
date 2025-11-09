const mongoose = require('mongoose');

// This schema is the same as before
const reviewSchema = new mongoose.Schema({
  userName: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
});

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  serviceCategory: { type: String, required: true, enum: ['Plumber', 'Electrician', 'Carpenter', 'Painter', 'General Service'] },
  profile: {
    description: String,
    phone: String,
     
  },
  location: String, 
  reviews: [reviewSchema], 
  emergencyService: { type: Boolean, default: false },

  password: { type: String, required: true },
});


module.exports = mongoose.model('Provider', providerSchema);