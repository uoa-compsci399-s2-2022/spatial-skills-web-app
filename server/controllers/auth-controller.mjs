import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

import User from "../models/user.js";
import APIError from "../handlers/APIError.js";

// GLOBAL VARS
const accessTokenTime = "60s";
const refreshTokenTime = "1d";

// ACCESS: PUBLIC
const login = async (req, res, next) => {
  if (!req.body.username) {
    return next(new APIError("No username provided.", 400));
  }

  const existUser = await User.findOne({ username: req.body.username }).exec();

  if (!existUser) {
    return next(new APIError("User not registered.", 400));
  }

  //Login for google sign in users
  if (existUser.sub) {
    if (!req.body.sub) {
      return next(new APIError("Google identifier not provided.", 400));
    }

    const match = await bcrypt.compare(req.body.sub, existUser.sub);

    //identifiers do not match
    if (!match) {
      return next(new APIError("Google-identifier do not match.", 400));
    }
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        username: existUser.username,
        permissions: existUser.permissions,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: accessTokenTime } // Set to 15min+ after dev
  );

  const refreshToken = jwt.sign(
    { username: existUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: refreshTokenTime }
  );

  // Creating securing cookie using refresh token named jwt
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None", //allow cross-site as server and client stored in different hosts
    maxAge: 24 * 60 * 60 * 1000, //match cookie expiry to refresh token
  });

  res.json({ accessToken });
};

// ACCESS: PUBLIC
// DESCRIPTION: refresh acess token if expired
const refresh = async (req, res, next) => {
  //Expect cookie

  if (!req.cookies.jwt) {
    return next(new APIError("Missing cookie.", 400));
  }

  const refreshToken = req.cookies.jwt;

  let decoded, existUser, accessToken;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    existUser = await User.findOne({ username: decoded.username });

    if (!existUser) {
      throw new Error();
    }

    // create new access token
    accessToken = jwt.sign(
      {
        UserInfo: {
          username: existUser.username,
          permissions: existUser.permissions,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: accessTokenTime } // Set to 15min+ after dev
    );
  } catch (e) {
    return next(new APIError("Failed to verify.", 403));
  }
  res.json({ accessToken });
};

// ACCESS: PUBLIC
// DESCRIPTION: clear cookies if exists
const logout = async (req, res, next) => {
  //Expect cookies
  if (!req.cookies?.jwt) {
    return next(new APIError("Missing cookie.", 400));
  }
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Logged out" });
};

export { login, refresh, logout };
