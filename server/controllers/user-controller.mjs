import User from "../models/user.js";
import APIError from "../handlers/APIError.js";
import bcrypt from "bcrypt";

const createSignInUser = async (req, res, next) => {
  if (req.body.usertype == "signin" && !req.body.password) {
    return next(new APIError("Invalid or missing inputs.", 400));
  }

  const hashedPass = await bcrypt.hash(req.body.password, 10);

  const createdUser = new User({
    username: req.body.username,
    password: hashedPass,
    usertype: req.body.usertype,
    roles: req.body.roles,
  });

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

export { createSignInUser };
