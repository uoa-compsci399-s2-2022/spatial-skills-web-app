import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

import User from "../models/user.js";
import APIError from "../handlers/APIError.js";

// GLOBAL VARS
const accessTokenTime = "30m";
const refreshTokenTime = "3h";

const SECURECOOKIE = process.env.NODE_ENV === "production" ? true : false;

// HELPER FUNCTIONS
const createTokens = async (res, name, permissions) => {
  const accessToken = jwt.sign(
    {
      UserInfo: {
        name: name,
        permissions: permissions,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: accessTokenTime } // Set to 15min+ after dev
  );

  const refreshToken = jwt.sign(
    {
      UserInfo: {
        name: name,
        permissions: permissions,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: refreshTokenTime }
  );

  // Creating securing cookie using refresh token named jwt
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: SECURECOOKIE,
    maxAge: 3 * 60 * 60 * 1000, //match cookie expiry to refresh token
  });

  res.json({ accessToken });
};

// ACCESS: PUBLIC
const studentLogin = async (req, res, next) => {
  const existUser = await User.findOne({
    name: req.body.name,
    permissions: req.body.permissions,
  }).exec();
  if (!existUser) {
    return next(new APIError("User not registered.", 400));
  }

  createTokens(res, existUser.name, existUser.permissions);
};

// ACCESS: PUBLIC - GATED BY GOOGLE LOGIN
const adminLogin = async (req, res, next) => {
  if (!req.body.name) {
    return next(new APIError("Name not provided.", 400));
  }
  if (!req.body.gIdToken) {
    return next(new APIError("ID token not provided.", 400));
  }

  // Verifying google ID_TOKEN https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
  const AuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  try {
    const ticket = await AuthClient.verifyIdToken({
      idToken: req.body.gIdToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
  } catch (e) {
    return next(new APIError("Failed to verify Google ID.", 400));
  }

  const existUser = await User.findOne({
    name: req.body.name,
    permissions: "admin",
  }).exec();

  if (!existUser) {
    return next(new APIError("Admin not registered.", 400));
  }

  createTokens(res, existUser.name, existUser.permissions);
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

    existUser = await User.findOne({
      name: decoded.UserInfo.name,
      permissions: decoded.UserInfo.permissions,
    });

    if (!existUser) {
      throw new Error();
    }
  } catch (e) {
    return next(new APIError("Forbidden.", 403));
  }

  try {
    // create new access token
    accessToken = jwt.sign(
      {
        UserInfo: {
          name: existUser.name,
          permissions: existUser.permissions,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: accessTokenTime }
    );
  } catch (e) {
    return next(new APIError("Could not create token.", 500));
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
  res.clearCookie("jwt", { httpOnly: true, secure: SECURECOOKIE });
  res.json({ message: "Logged out" });
};

export { studentLogin, adminLogin, refresh, logout };
