const { User } = require("../model/schoolDB");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register logic
exports.registerAdmin = async (req, res) => {
  const { name, email, password, secretKey } = req.body;

  // Verify admin secret key
  if (secretKey !== process.env.secretKey) {
    return res.json({ message: "Unauthorized account creation" });
  }

  // Check if the user exists
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.json({ message: "Email has already been taken" });
  }

  // Hashing the password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role: "admin",
    isActive: true,
    teacher: null,
    parent: null,
  });

  const newUser = await user.save();

  res.status(201).json({ message: "Admin account created", newUser });
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "Invalid credentials" });
  }

  // Check if the user is active
  if (!user.isActive) {
    return res.json({ message: "Your account has been deactivated" });
  }

  // Check for missing password
  if (!password || !user.password) {
    return res.json({ message: "Missing credentials" });
  }

  // Check the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.json({ message: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};