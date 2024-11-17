import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const testAPI = (req, res) => {
  res.send("Hello Controller Express");
};

export const updateUser = async (req, res, next) => {
  console.log(req.user);
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(
        errorHandler(400, "Password should be at least 6 characters")
      );
    } else {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
  }

  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 22) {
      return next(
        errorHandler(400, "Username should be between 7 and 22 characters")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username should not contain space"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username should be in lowercase letters"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username should contain only letters and numbers")
      );
    }
  }
  try {
    const updateuser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      {
        new: true,
      }
    );

    const { password, ...rest } = updateuser._doc;
    res.status(200).json({
      success: true,
      rest,
    });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  } else {
    try {
      await User.findByIdAndDelete(req.params.userId);
      res.status(200).json({ message: "User has been deleted" });
    } catch (error) {
      return next(errorHandler(500, error.message));
    }
  }
};

export const signOutUser = async (req, res, next) => {
  try {
    res
      .clearCookie("accessToken")
      .status(200)
      .json({ message: "Sign out success" });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to see all users"));
    } else {
      try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === "asc" ? 1 : -1;
        // const query = {
        //   ...(req.query.userId && { userId: req.query.userId }),
        //   ...(req.query.category && { category: req.query.category }),
        //   ...(req.query.slug && { slug: req.query.slug }),
        //   ...(req.query.postId && { _id: req.query.postId }),
        //   ...(req.query.searchTerm && {
        //     $or: [
        //       { title: { $regex: req.query.searchTerm, $options: "i" } },
        //       { content: { $regex: req.query.searchTerm, $options: "i" } },
        //     ],
        //   }),
        // };

        const listUser = await User.find()
          .select("-password")
          .sort({ updateAt: sortDirection })
          .skip(startIndex)
          .limit(limit)
          .exec();

        const totalUsers = await User.countDocuments();
        const now = new Date();

        const oneMonthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );

        const lastMonthUsers = await User.countDocuments({
          createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
          listUser,
          totalUsers,
          lastMonthUsers,
        });

        // console.log(listUser);
      } catch (error) {
        return next(errorHandler(500, error.message));
      }
    }
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

export const deleteUserWithAdmin = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this user"));
  } else {
    try {
      await User.findByIdAndDelete(req.params.userId);
      res.status(200).json({ message: "User has been deleted" });
    } catch (error) {
      return next(errorHandler(500, error.message));
    }
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    res.status(200).json(user);
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};
