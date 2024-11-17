import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All input is required"));
  } else {
    try {
      const hashPassword = await bcryptjs.hashSync(password, 10);
      const newUser = new User({
        username,
        email,
        password: hashPassword,
      });
      await newUser.save();
      res.json({ message: "Signup success" });
    } catch (error) {
      next(error);
    }
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All input is required"));
  }

  try {
    const validUser = await User.findOne({ email });

    // Check if password is correct
    if (!validUser) {
      return next(errorHandler(400, "Email or password is wrong"));
    } else {
      const validPassword = await bcryptjs.compareSync(
        password,
        validUser.password
      );

      if (!validPassword) {
        return next(errorHandler(400, "Email or password is wrong"));
      } else {
        const accessToken = jwt.sign(
          { id: validUser._id, isAdmin: validUser.isAdmin },
          process.env.JWT_SECRET
        );

        const { password: pass, ...rest } = validUser._doc;
        res
          .status(200)
          .cookie("accessToken", accessToken, {
            httpOnly: true,
          })
          .json({ rest });
      }
    }
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });

    // Check user is already exist
    if (user) {
      const accessToken = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("accessToken", accessToken, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashPassword = await bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashPassword,
        profilePicture: googlePhotoUrl,
      });

      // Save new user
      await newUser.save();

      const accessToken = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("accessToken", accessToken, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
