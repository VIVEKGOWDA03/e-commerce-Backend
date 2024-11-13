const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
// const { use } = require("../../routes/auth/auth-routes");

// Register User
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  // Validate input
  if (!userName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    // Check if user already exists by email or userName
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or username already exists",
      });
    }

    // Hash password and create a new user
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    // Save user to the database
    const user = await newUser.save();
    console.log(user);

    // Return success response
    res.status(201).json({
      success: true,
      message: "Registration Successful",
      data: user,
    });
  } catch (e) {
    console.error("Error during registration:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred during registration",
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist! Please register first.",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged In Successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser.id,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred during login",
    });
  }
};

// logout
const logoutUser = (req, res) => {
  res.cookie("token").json({
    success: true,
    message: "logged out",
  });
};

//auth middleware

const authMiddleware = async (req, res, next) => {
  // Use req.cookies instead of req.cookie
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized User!",
    });

  try {
    // Verify the token using jwt
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded; // Attach user data to the request
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    // If token verification fails
    res.status(401).json({
      success: false,
      message: "Unauthorized User!",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
