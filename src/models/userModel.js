const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required. Please enter your name."],
    trim: true,
  },
  email: {
    type: String,
    required: [
      true,
      "Email address is required. Please provide an Email Address.",
    ],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email."],
  },
  photo: {
    type: Buffer,
    default: undefined,
  },
  password: {
    type: String,
    required: [true, "Password is required. Please create a Password."],
    minlength: [8, "Password should be at least 8 characters."],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  console.log("Password hashing started....");
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// return user without user's password and tokens
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

userSchema.methods.matchPassword = async function (
  enteredPassword,
  userPassword
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

const USER = mongoose.model("USER", userSchema);

module.exports = USER;
