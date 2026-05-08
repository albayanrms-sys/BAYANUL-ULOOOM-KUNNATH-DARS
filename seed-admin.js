const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' }); // Load env vars if any

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], default: 'student' }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seed() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/albayan";
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');

    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Admin account created: admin / admin123');
    } else {
      console.log('Admin account already exists.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
}

seed();
