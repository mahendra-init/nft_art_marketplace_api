const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

//SIGNUP
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await User.create({
      name: name,
      email: email,
      password: password,
    });

    const token = createToken(newUser._id);

    res.status(201).json({
      status: "success",
      data: newUser,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failure",
      data: null,
      token: null,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(500).json({
        status: "failure",
        message: "Please provide email and password!",
        token: null,
      });
    }

    // Check user existance in the database
    let user = await User.findOne({ email: email });

    if (!user) {
      throw new Error();
    }

    // Validate the provided password with the hashed one stored in the database
    const isPasswordValid = await user.matchPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials!");
    }

    // Create a JSON Web Token that will be used for authentication
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000 /* 90 days */),
      secure: true,
      httpOnly: true,
    });

    res.status(200).json({
      status: "success",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failure",
      data: null,
      token: null,
    });
  }
};

const authenticate = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new Error();
    }
    const payload = verifyToken(token);
    const user = await User.findOne({ _id: payload.id });

    if (!user) {
      throw new Error("The User belonging to this token no longer exists!");
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failure",
      message: "INVALID TOKEN",
      token: null,
    });
  }
};
module.exports = {
  signup,
  login,
  authenticate,
};
