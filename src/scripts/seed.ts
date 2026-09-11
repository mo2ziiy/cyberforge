/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Seed script for populating MongoDB with initial data.
 * Run: npx tsx src/scripts/seed.ts
 *
 * Requires MongoDB to be running.
 * Also creates a default admin user.
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/cyberforge";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // Create admin user
  const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },
    bookmarks: [String],
    favoriteTools: [String],
    completedTopics: [String],
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  const adminExists = await User.findOne({ email: "admin@cyberforge.dev" });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("admin123", 12);
    await User.create({
      name: "Admin",
      email: "admin@cyberforge.dev",
      password: hashedPassword,
      role: "admin",
    });
    console.log("Admin user created: admin@cyberforge.dev / admin123");
  } else {
    console.log("Admin user already exists");
  }

  console.log("Seed complete!");
  await mongoose.disconnect();
}

seed().catch(console.error);
