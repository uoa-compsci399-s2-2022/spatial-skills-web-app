import User from "../models/user.js";
import APIError from "../handlers/APIError.js";
import bcrypt from "bcrypt";

const createUser = async (req, res, next) => {
  // Check if user already exists
  const exists = await User.findOne({ username: req.body.username }).exec();
  if (exists) {
    return next(new APIError("User already exists.", 400));
  }

  let createdUser;
  if (req.body.sub) {
    // Google sign in user
    //Hash google unique identifier (need to decrypt when used)
    const hashedSub = await bcrypt.hash(req.body.sub, 10);
    createdUser = new User({
      username: req.body.username,
      sub: hashedSub,
      permissions: req.body.permissions,
    });
  } else {
    // Other user
    createdUser = new User({
      username: req.body.username,
      permissions: req.body.permissions,
    });
  }

  try {
    await createdUser.validate();
  } catch (e) {
    return next(new APIError("Invalid or missing inputs.", 400));
  }

  let result;
  try {
    result = await createdUser.save();
  } catch (e) {
    return next(new APIError("Could not save user.", 500));
  }

  res.status(201).json(result);
};

export { createUser };
