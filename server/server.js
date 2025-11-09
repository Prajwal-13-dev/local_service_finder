// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); // Express Middleware
app.use(express.json()); // Express Middleware to parse JSON bodies

// 1. Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/servicefinder')
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// 2. Import Models
const Provider = require('./models/provider');
const User = require('./models/user');

// 3. Define Routes (This is your REST API)
// GET all providers (can filter by category)
app.get('/api/providers', async (req, res) => {

  try {
    const filter = {};
    if (req.query.category) {
      filter.serviceCategory = req.query.category;
    }
    const providers = await Provider.find(filter);
    res.json(providers); // Sends JSON (vs. XML)
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single provider by ID
app.get('/api/providers/:id', async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) 
        return res.status(404).json({ message: 'Provider not found' });
    res.json(provider);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new review for a provider
app.post('/api/providers/:id/reviews', async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    const newReview = {
      userName: req.body.userName, // Comes from the React Form
      rating: req.body.rating,
      comment: req.body.comment,
    };
    provider.reviews.push(newReview);
    await provider.save();
    res.status(201).json(provider);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      // We send a 400 (Bad Request) status
      // Note: In a real app, you might send a vague "Invalid credentials"
      // message for security, but this is clearer for a project.
      return res.status(400).json({ message: 'User with this email does not exist' });
    }

    // 2. Check if password matches
    // This is the simple, NON-HASHED check.
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // 3. If email and password are correct, send success
    // We send back some user data (but NOT the password)
    res.status(200).json({
      message: 'Login successful!',
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// This is the corrected route.
// It now matches your React form.

app.post('/api/provider/register', async (req, res) => {
  try {
    // 1. Destructure ALL fields from the request body
    const { 
      name, 
      email, // This is the login email
      password, 
      serviceCategory, 
      location, 
      emergencyService, 
      profile // This is the nested object
    } = req.body;

    // 2. Check if provider already exists by their LOGIN email
    let provider = await Provider.findOne({ email: email });
    
    if (provider) {
      return res.status(400).json({ message: 'A provider with this email already exists' });
    }

    // 3. If provider does NOT exist, create a new provider
    //    mapping all the fields correctly.
    provider = new Provider({
      name,
      email,             // Save login email
      password,          // Save password
      serviceCategory,   // Save category
      location,          // Save location
      emergencyService,  // Save emergency status
      profile: {
        description: profile.description, // Save description from profile object
        phone: profile.phone,             // Save phone from profile object
        email: email                      // Re-use login email as public email
      }
    });

    // 4. Save the new provider to the database
    await provider.save();

    // 5. Send a success response (returning the new provider is good practice)
    res.status(201).json(provider);

  } catch (err) {
    // Check for Mongoose validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Your User registration route looks fine, you can leave it.
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. If user does NOT exist, create a new user document
    user = new User({
      name,
      email,
      password, // Storing the plain-text password (as you requested)
    });

    // 3. Save the new user to the database
    await user.save();

    // 4. Send a success response
    res.status(201).json({ message: 'User registered successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/api/provider/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if provider exists
    //
    //    THE FIX IS HERE: Search the top-level 'email' field,
    //    not 'profile.email'.
    //
    const provider = await Provider.findOne({ email: email });
    
    if (!provider) {
      return res.status(400).json({ message: 'Provider with this email does not exist' });
    }

    // 2. Check if password matches
    if (password !== provider.password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // 3. If email and password are correct, send success
    res.status(200).json({
      message: 'Provider login successful!',
      provider: {
        id: provider._id,
        name: provider.name,
        email: provider.email // Send back the top-level email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));